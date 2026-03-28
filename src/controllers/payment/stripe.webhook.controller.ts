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
        const paymentIntent = event.data.object as any;
        const paymentId = paymentIntent.metadata?.paymentId;

        if (!paymentId) {
          console.warn("Missing paymentId in metadata");
          break;
        }

        // 1) Update payment status to paid
        await markPaymentSucceeded(paymentId);

        // 2) Fetch payment and shipment
        const payment = await Payment.findById(paymentId);
        if (!payment) {
          console.warn("Payment not found for paymentId:", paymentId);
          break;
        }

        const shipment = await Shipment.findById(payment.shipmentId);
        if (!shipment) {
          console.warn("Shipment not found for shipmentId:", payment.shipmentId);
          break;
        }

        // 3) Prevent duplicate booking if webhook hits twice
        if (shipment.status === "booked" && shipment.shippoShipmentId) {
          console.log("Shipment already booked, skipping Shippo creation");
          break;
        }

        if (!shipment.selectedRate) {
          console.warn("Shipment has no selectedRate");
          break;
        }

        // 4) Create shipment in Shippo
        const shipmentRes = await axios.post(
          "https://api.goshippo.com/shipments/",
          {
            address_from: {
              street1: shipment.senderAddress.street,
              city: shipment.senderAddress.city,
              state: shipment.senderAddress.state,
              zip: shipment.senderAddress.zip,
              country: shipment.senderAddress.country,
            },
            address_to: {
              street1: shipment.receiverAddress.street,
              city: shipment.receiverAddress.city,
              state: shipment.receiverAddress.state,
              zip: shipment.receiverAddress.zip,
              country: shipment.receiverAddress.country,
            },
            parcels: [
              {
                length: shipment.package.length,
                width: shipment.package.width,
                height: shipment.package.height,
                distance_unit: shipment.package.units,
                weight: shipment.package.weight,
                mass_unit: "kg",
              },
            ],
            async: false,
          },
          {
            headers: {
              Authorization: `ShippoToken ${process.env.SHIPPO_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        shipment.shippoShipmentId = shipmentRes.data?.object_id || null;

        // 5) Buy label using the selected rate
        const transactionRes = await axios.post(
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

        // 6) Save tracking + label info
        shipment.trackingNumber = transactionRes.data?.tracking_number || null;
        shipment.trackingUrl =
          transactionRes.data?.tracking_url_provider || null;
        shipment.labelUrl = transactionRes.data?.label_url || null;
        shipment.status = "booked";
        shipment.paidOn = new Date();

        await shipment.save();

        console.log("Shipment booked successfully");
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as any;
        const paymentId = paymentIntent.metadata?.paymentId;

        if (!paymentId) {
          console.warn("Missing paymentId in metadata");
          break;
        }

        await markPaymentFailed(paymentId);
        break;
      }

      case "payment_intent.processing": {
        console.log("Payment is processing");
        break;
      }

      default: {
        console.log(`Unhandled event type: ${event.type}`);
      }
    }

    return res.sendStatus(200);
  } catch (error: any) {
    return res.status(500).json({
      message: "Webhook handler failed",
      error: error.message,
    });
  }
};