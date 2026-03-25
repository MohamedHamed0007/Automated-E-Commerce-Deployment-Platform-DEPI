import { stripe } from "../../config/Payment/stripe";
import Payment from "../../config/DB/Models/Payment/Payment.model";
import { Types } from "mongoose";

type CreatePaymentInput = {
  shipmentId: string;
  userId: string;
  amount: number;
  currency?: string;
};

export const createPaymentIntentForShipment = async ({
  shipmentId,
  userId,
  amount,
  currency = "egp",
}: CreatePaymentInput) => {
  // 1) create local payment record first
  const payment = await Payment.create({
    shipmentId: new Types.ObjectId(shipmentId),
    userId: new Types.ObjectId(userId),
    amount,
    currency,
    status: "pending",
  });

  // 2) create Stripe payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    metadata: {
      paymentId: payment._id.toString(),
      shipmentId,
      userId,
    },
  });

  // 3) save Stripe intent id
  payment.stripePaymentIntentId = paymentIntent.id;
  await payment.save();

  return {
    payment,
    clientSecret: paymentIntent.client_secret,
  };
};

export const markPaymentSucceeded = async (paymentId: string, paidAt = new Date()) => {
  return Payment.findByIdAndUpdate(
    paymentId,
    {
      status: "paid",
      paidAt,
    },
    { new: true }
  );
};

export const markPaymentFailed = async (paymentId: string) => {
  return Payment.findByIdAndUpdate(
    paymentId,
    {
      status: "failed",
    },
    { new: true }
  );
};
