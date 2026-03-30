import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler/asyncHandler.utils";
import { successResponse } from "../../utils/Response/api.response.utils";
import * as shipmentService from "../../Services/shipment/shipment.service";
import { trackShipment } from "../../Services/tracking/tracking.services";

export const createShipment = asyncHandler(
  async (req: Request, res: Response) => {
    const shipment = await shipmentService.createShipment({
      ...req.body,
      userId: req.user!.userId,
    });
    return successResponse(res, "Shipment created successfully", shipment, 201);
  }
);

export const getUserShipments = asyncHandler(
  async (req: Request, res: Response) => {
    const shipments = await shipmentService.getUserShipments(req.user!.userId);
    return successResponse(res, "Shipments retrieved successfully", shipments, 200);
  }
);

export const getShipmentById = asyncHandler(
  async (req: Request, res: Response) => {
    const shipment = await shipmentService.getShipmentById(
      req.params.id,
      req.user!.userId
    );
    return successResponse(res, "Shipment retrieved successfully", shipment, 200);
  }
);

export const compareRates = asyncHandler(
  async (req: Request, res: Response) => {
    await shipmentService.compareRates(
      req.params.id,
      req.user!.userId
    );
    const shipment = await shipmentService.getShipmentById(
      req.params.id,
      req.user!.userId
    );
    return successResponse(res, "Rates compared successfully", shipment, 200);
  }
);

export const selectRate = asyncHandler(
  async (req: Request, res: Response) => {
    const { shippoRateId } = req.body;
    const shipment = await shipmentService.selectRate({
      shipmentId: req.params.id,
      userId: req.user!.userId,
      shippoRateId,
    });
    return successResponse(res, "Rate selected successfully", shipment, 200);
  }
);

export const getTracking = asyncHandler(
  async (req: Request, res: Response) => {
    const tracking = await trackShipment(req.params.id, req.user!.userId);
    return successResponse(res, "Tracking info retrieved successfully", tracking, 200);
  }
);