import Shipment, {
  IShipment,
} from "../../config/DB/Models/Shipment/Shipment.models";
import { fetchRatesWithCommission } from "../carrier/carrier.service";

// Called when user submits package + addresses
export const createShipmentWithRates = async (userId: string, body: any) => {
  // 1. Fetch rates from carrier API (commission already added inside)
  const rates = await fetchRatesWithCommission({
    packageDetails: body.package,
    senderAddress: body.senderAddress,
    receiverAddress: body.receiverAddress,
  });

  // 2. Save shipment to DB with the comparison results
  const shipment = await Shipment.create({
    userId,
    package: body.package,
    senderAddress: body.senderAddress,
    receiverAddress: body.receiverAddress,
    comparisonResults: rates, // stored with finalRate (commission included)
    status: "compared",
  });

  return shipment;
};

// Called when user picks a rate
export const selectRate = async (
  shipmentId: string,
  userId: string,
  shippoRateId: string,
) => {
  const shipment = await Shipment.findOne({ _id: shipmentId, userId });

  if (!shipment)
    throw Object.assign(new Error("Shipment not found"), {
      status: 404,
      code: "NOT_FOUND",
    });
  if (shipment.status === "cancelled")
    throw Object.assign(new Error("Shipment is cancelled"), {
      status: 422,
      code: "ALREADY_CANCELLED",
    });
  if (shipment.selectedRate)
    throw Object.assign(new Error("Rate already selected"), {
      status: 409,
      code: "RATE_ALREADY_SELECTED",
    });

  // Find the chosen rate from the saved results
  const chosen = shipment.comparisonResults.find(
    (r) => r.shippoRateId === shippoRateId,
  );
  if (!chosen)
    throw Object.assign(new Error("Rate not found"), {
      status: 404,
      code: "NOT_FOUND",
    });

  shipment.selectedRate = chosen;
  shipment.status = "booked";
  await shipment.save();

  return shipment;
};

// Get one shipment (only the owner or admin can access)
export const getShipmentById = async (
  shipmentId: string,
  userId: string,
  role: string,
) => {
  const query =
    role === "admin"
      ? { _id: shipmentId } // admin sees any shipment
      : { _id: shipmentId, userId }; // user sees only their own

  const shipment = await Shipment.findOne(query);
  if (!shipment)
    throw Object.assign(new Error("Shipment not found"), {
      status: 404,
      code: "NOT_FOUND",
    });
  return shipment;
};

// Get all shipments — admin only
export const getAllShipments = async (filters: any) => {
  const query: any = {};
  if (filters.status) query.status = filters.status;
  if (filters.userId) query.userId = filters.userId;

  const page = parseInt(filters.page || "1");
  const limit = parseInt(filters.limit || "20");
  const skip = (page - 1) * limit;

  const [shipments, total] = await Promise.all([
    Shipment.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Shipment.countDocuments(query),
  ]);

  return {
    shipments,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};
