import { Router } from "express";
import { createPaymentController } from "../../controllers/payment/payment.controller";
import { authentication } from "../../middleware/Auth/auth.middleware";

const router = Router();

router.post("/", authentication, createPaymentController);


export default router;
