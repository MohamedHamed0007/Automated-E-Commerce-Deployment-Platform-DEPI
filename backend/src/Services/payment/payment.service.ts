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
  const payment = await Payment.create({
    shipmentId: new Types.ObjectId(shipmentId),
    userId: new Types.ObjectId(userId),
    amount,
    currency,
    status: "pending",
  });

  const stripeAmount = Math.round(amount * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: stripeAmount,
    currency,
    automatic_payment_methods: {
      enabled: true,
      
    },
    metadata: {
      paymentId: payment._id.toString(),
      shipmentId,
      userId,
    },
  });

  payment.stripePaymentIntentId = paymentIntent.id;
  await payment.save();

  return {
    payment,
    clientSecret: paymentIntent.client_secret,
  };
};

export const markPaymentSucceeded = async (
  paymentId: string,
  paidAt = new Date()
) => {
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