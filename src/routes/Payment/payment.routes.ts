import { Router } from "express";
import { createPaymentController } from "../../controllers/payment/payment.controller";
import { authentication } from "../../middleware/Auth/auth.middleware";
import { confirmPaymentController } from "../../controllers/payment/payment.controller";
const router = Router();

router.post("/", authentication, createPaymentController);
router.post("/confirm", confirmPaymentController);

export default router;
