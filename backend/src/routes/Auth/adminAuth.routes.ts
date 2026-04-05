import { Router } from "express";
import { adminLoginController } from "../../controllers/Auth/adminAuth.controller";

const router = Router();

router.post("/login", adminLoginController);

export default router;
