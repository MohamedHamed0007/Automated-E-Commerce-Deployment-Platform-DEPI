import { Router } from "express";
import { stripeWebhookController } from "../../controllers/payment/stripe.webhook.controller";

const router = Router();

router.post("/webhook", stripeWebhookController);

export default router;
