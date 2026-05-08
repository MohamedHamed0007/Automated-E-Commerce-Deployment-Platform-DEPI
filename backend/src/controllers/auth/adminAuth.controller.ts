import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../utils/AsyncHandler/asyncHandler.utils";
import { adminLoginService } from "../../Services/auth/adminAuth.service";

// ── POST /api/v1/auth/admin/login ─────────────────────────────────────────
export const adminLoginController = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    // 2b-2e: Extract credentials, call service, and return standardized 200 format
    const result = await adminLoginService(req.body);

    res.status(200).json({ token: result });
  }
);
