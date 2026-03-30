import { Request, Response } from "express";
import mongoose from "mongoose";
import Shipments from "../../config/DB/Models/Shipment/Shipment.models";
import { createPaymentIntentForShipment } from "../../Services/payment/payment.service";
import { successResponse } from "../../utils/Response/api.response.utils";

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

    const shipment = await Shipments.findOne({
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
    const currency = shipment.selectedRate.currency;

    if (amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const result = await createPaymentIntentForShipment({
      shipmentId,
      userId,
      amount,
      currency,
    });

    return successResponse(
      res,
      "Payment intent created",
      {
        clientSecret: result.clientSecret,
        payment: result.payment,
      },
      201
    );
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to create payment intent",
      error: error.message,
    });
  }
};

// Confirm Payment - Stripe Elements handles this client-side now
export const confirmPaymentController = async (req: Request, res: Response) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ message: "paymentIntentId is required" });
    }

    return successResponse(res, "Payment confirmation endpoint ready", { status: "pending" }, 200);
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to confirm payment",
      error: error.message,
    });
  }
};