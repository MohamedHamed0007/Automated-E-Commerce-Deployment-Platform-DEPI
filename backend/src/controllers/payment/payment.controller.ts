import { Request, Response } from "express";
import mongoose from "mongoose";
import Shipment from "../../config/DB/Models/Shipment/Shipment.models";
import { createPaymentIntentForShipment } from "../../Services/payment/payment.service";
import { stripe } from "../../config/Payment/stripe";

// Create Payment
export const createPaymentController = async (req: Request, res: Response) => {
  try {
    const { shipmentId } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!shipmentId) {
      return res.status(400).json({ message: "shipmentId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(shipmentId)) {
      return res.status(400).json({ message: "Invalid shipmentId" });
    }

    const shipment = await Shipment.findOne({
      _id: shipmentId,
      userId,
    });

    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    if (!shipment.selectedRate) {
      return res.status(400).json({
        message: "No selected rate for this shipment",
      });
    }

    const amount = shipment.selectedRate.finalRate;

    const currency = (shipment.selectedRate.currency || "usd").toLowerCase();

    const result = await createPaymentIntentForShipment({
      shipmentId,
      userId,
      amount,
      currency,
    });

    return res.status(201).json({
      clientSecret: result.clientSecret,
      paymentId: result.payment._id,
      paymentIntentId: result.payment.stripePaymentIntentId, 
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to create payment intent",
      error: error.message,
    });
  }
};

// Confirm Payment
export const confirmPaymentController = async (req: Request, res: Response) => {
  try {
    const { paymentIntentId, returnUrl } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ message: "paymentIntentId is required" });
    }

    if (!returnUrl) {
      return res.status(400).json({ message: "returnUrl is required" });
    }

    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      return_url: returnUrl,
      payment_method: "pm_card_visa",
    });

    return res.json({
      message: "Payment confirmed",
      status: paymentIntent.status,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to confirm payment",
      error: error.message,
    });
  }
};