import { Request, Response } from "express";
import { stripe } from "../../config/Payment/stripe";
import {
  markPaymentSucceeded,
  markPaymentFailed,
} from "../../Services/payment/payment.service";

export const stripeWebhookController = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as any;

        const paymentId = paymentIntent.metadata?.paymentId;

        if (paymentId) {
          await markPaymentSucceeded(paymentId);
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as any;

        const paymentId = paymentIntent.metadata?.paymentId;

        if (paymentId) {
          await markPaymentFailed(paymentId);
        }
        break;
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
