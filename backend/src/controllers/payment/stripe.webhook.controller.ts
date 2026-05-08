import { Request, Response } from "express";
import axios from "axios";
import { stripe } from "../../config/Payment/stripe";
import Payment from "../../config/DB/Models/Payment/Payment.model";
import Shipment from "../../config/DB/Models/Shipment/Shipment.models";
import {
  markPaymentSucceeded,
  markPaymentFailed,
} from "../../Services/payment/payment.service";

export const stripeWebhookController = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  if (!sig) {
    return res.status(400).send("Missing Stripe signature");
  }

  let event: any;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("Stripe event:", event.type);

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        console.log("💳 Processing payment_intent.succeeded...");
        const paymentIntent = event.data.object as any;
        const paymentId = paymentIntent.metadata?.paymentId;

        if (!paymentId) {
          console.warn("⚠️ Missing paymentId in metadata");
          break;
        }

        console.log("📝 Payment ID:", paymentId);
        const updatedPayment = await markPaymentSucceeded(paymentId);
        console.log("✅ Payment marked as succeeded:", updatedPayment);

        const payment = await Payment.findById(paymentId);
        if (!payment) {
          console.warn("⚠️ Payment not found:", paymentId);
          break;
        }

        const shipment = await Shipment.findById(payment.shipmentId);
        if (!shipment) {
          console.warn("⚠️ Shipment not found:", payment.shipmentId);
          break;
        }

        console.log("📦 Shipment found:", shipment._id, "status:", shipment.status);

        if (!shipment.selectedRate?.shippoRateId) {
          console.warn("⚠️ No shippoRateId in selectedRate");
          break;
        }

        // 🟢 5. منع التكرار (منع إعادة محاولة شراء بوليصة تم حجزها أو قيد المحاولة)
        if (shipment.trackingNumber || shipment.status === "booked") {
          console.log("Shipment already booked or processed, skipping Shippo purchase...");
          break;
        }

        console.log("Attempting to buy Shippo rate:", shipment.selectedRate.shippoRateId);

        console.log("🚀 Attempting to buy Shippo label...");
        console.log("📋 Rate ID:", shipment.selectedRate.shippoRateId);
        console.log("🔑 Shippo API Key loaded:", !!process.env.SHIPPO_API_KEY);
        
        // 🔥 6. شراء اللابل مباشرة (معزول في Try/Catch للتعامل مع أخطاء Shippo)
        let transactionRes;
        try {
          console.log("📤 Sending request to Shippo...");
          transactionRes = await axios.post(
            "https://api.goshippo.com/transactions/",
            {
              rate: shipment.selectedRate.shippoRateId,
              label_file_type: "PDF",
              async: false,
            },
            {
              headers: {
                Authorization: `ShippoToken ${process.env.SHIPPO_API_KEY}`,
                "Content-Type": "application/json",
              },
            }
          );
          console.log("📥 Shippo response:", JSON.stringify(transactionRes.data, null, 2));
        } catch (shippoError: any) {
          // ❌ لو Shippo رفض العملية (مثل: Rate غير صالح أو مستخدم)
          console.error(
            "❌ Shippo API Error:",
            JSON.stringify(shippoError?.response?.data || shippoError.message, null, 2)
          );
          
          // تحديث الحالة لـ فشل الحجز لتجنب التعليق في حالة booked الوهمية
          shipment.status = "cancelled";
          await shipment.save();
          break; 
        }

        // التأكد من أن Shippo يرجع SUCCESS وليس حالة أخرى مثل QUEUED
        console.log("SHIPPO TRANSACTION RESPONSE STATUS:", transactionRes.data?.status);

        if (transactionRes.data?.status !== "SUCCESS") {
          console.warn("Shippo transaction returned non-SUCCESS:", transactionRes.data);
          shipment.status = "cancelled";
          await shipment.save();
          break;
        }

        // 🟢 7. حفظ البيانات
        shipment.trackingNumber = transactionRes.data?.tracking_number || null;
        shipment.trackingUrl = transactionRes.data?.tracking_url_provider || null;
        shipment.labelUrl = transactionRes.data?.label_url || null;
        shipment.status = "booked";
        shipment.paidOn = new Date();

        await shipment.save();

        console.log("✅ Shipment booked successfully!");
        console.log("   - trackingNumber:", shipment.trackingNumber);
        console.log("   - labelUrl:", shipment.labelUrl);
        console.log("   - status:", shipment.status);
        break;
      }

      case "payment_intent.payment_failed": {
        console.log("💳 Payment failed event received");
        const paymentIntent = event.data.object as any;
        const paymentId = paymentIntent.metadata?.paymentId;

        if (!paymentId) break;

        await markPaymentFailed(paymentId);
        break;
      }

      case "payment_intent.processing": {
        console.log("💳 Payment processing...");
        break;
      }

      default:
        console.log("📝 Unhandled event:", event.type);
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.sendStatus(200);
  } catch (error: any) {
    console.error("❌ Webhook error:", error?.response?.data || error.message);
    return res.status(500).json({
      message: "Webhook handler failed",
      error: error.message,
    });
  }
};