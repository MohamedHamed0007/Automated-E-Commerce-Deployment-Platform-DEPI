import { Request, Response } from "express";
import { stripe } from "../../config/Payment/stripe";
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

        if (!paymentIntent.metadata?.paymentId) {
          console.warn("Missing paymentId in metadata");
          break;
        }

        await markPaymentSucceeded(paymentIntent.metadata.paymentId);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as any;

        if (!paymentIntent.metadata?.paymentId) {
          console.warn("Missing paymentId in metadata");
          break;
        }

        await markPaymentFailed(paymentIntent.metadata.paymentId);
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