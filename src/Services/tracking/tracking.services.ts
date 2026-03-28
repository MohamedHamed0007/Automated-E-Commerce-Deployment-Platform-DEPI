import ShipmentModel from "../../config/DB/Models/Shipment/Shipment.models";
import { shippo } from "../../config/env/env";
import { createNotFoundError } from "../../utils/ApiErrors/ApiErrors";

interface TrackingResult {
  status: string;
  statusDetails: string;
  carrier: string;
  trackingNumber: string;
  trackingUrl: string;
  events: Array<{
    status: string;
    location: string;
    date: string;
  }>;
}

export async function trackShipment(shipmentId: string, userId: string): Promise<TrackingResult> {
  const shipment = await ShipmentModel.findOne({ _id: shipmentId, userId });
  if (!shipment) throw createNotFoundError("Shipment not found");

  if (!shipment.trackingNumber || !shipment.selectedRate) {
    throw new Error("Tracking information not available for this shipment");
  }

  const tracking = await shippo.trackingStatus.get(
    shipment.selectedRate.carrier,
    shipment.trackingNumber
  );

  const events = tracking.trackingHistory.map((event) => ({
    status: event.status,
    location: event.location ? `${event.location.city}, ${event.location.state}` : "Unknown",
    date: event.statusDate?.toISOString() || "",
  }));

  return {
    status: tracking.trackingStatus?.status || "UNKNOWN",
    statusDetails: tracking.trackingStatus?.statusDetails || "",
    carrier: shipment.selectedRate.carrier,
    trackingNumber: shipment.trackingNumber,
    trackingUrl: shipment.trackingUrl || "",
    events,
  };
}