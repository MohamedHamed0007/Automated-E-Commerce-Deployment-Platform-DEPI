import ShipmentModel from "../../config/DB/Models/Shipment/Shipment.models";
import { shippo } from "../../config/env/env";
import { createNotFoundError } from "../../utils/ApiErrors/ApiErrors";
import mongoose from "mongoose";

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
  // 1. Simulation Mode for development/testing
  // If the input starts with "SHIPPO_", bypass DB and fetch mock data from Shippo directly
  if (shipmentId.startsWith("SHIPPO_")) {
    try {
      // NOTE: SDK expects (trackingNumber, carrier)
      const tracking = await shippo.trackingStatus.get(shipmentId, "shippo");
      
      const historyList = tracking.trackingHistory || [];
      const events = historyList.map((event: any) => {
        let locationStr = "Unknown";
        if (event.location) {
          const city = event.location.city || "";
          const state = event.location.state || "";
          locationStr = [city, state].filter(Boolean).join(", ") || "Unknown";
        }
        
        let dateStr = "";
        if (event.statusDate) {
          dateStr = typeof event.statusDate === "string" 
            ? event.statusDate 
            : event.statusDate.toISOString ? event.statusDate.toISOString() : String(event.statusDate);
        }

        return {
          status: event.status || "UNKNOWN",
          location: locationStr,
          date: dateStr,
        };
      });

      return {
        status: tracking.trackingStatus?.status || "UNKNOWN",
        statusDetails: tracking.trackingStatus?.statusDetails || "Simulation tracking data (Test Data)",
        carrier: "shippo",
        trackingNumber: shipmentId,
        trackingUrl: "", // No real URL in test mode
        events,
      };
    } catch (error: any) {
      console.error("Shippo Simulation API Error:", error.message);
      throw new Error("Failed to fetch simulation data from Shippo");
    }
  }

  // ---------------------------------------------------------
  // 2. Production Code for real shipments in the database
  // ---------------------------------------------------------
  
  // Check if input is a valid MongoDB ObjectId or a Tracking Number
  const isMongoId = mongoose.Types.ObjectId.isValid(shipmentId);
  
  // Build query based on input type
  const query = isMongoId
    ? { _id: shipmentId, userId }
    : { trackingNumber: shipmentId, userId };

  const shipment = await ShipmentModel.findOne(query);
  
  if (!shipment) throw createNotFoundError("Shipment not found");

  if (!shipment.trackingNumber || !shipment.selectedRate) {
    return {
      status: "PENDING",
      statusDetails: "Tracking information is not yet available. The shipment may not be paid or label not yet generated.",
      carrier: shipment.selectedRate?.carrier || "Unknown",
      trackingNumber: shipment.trackingNumber || "",
      trackingUrl: shipment.trackingUrl || "",
      events: [],
    };
  }

  try {
    // Fetch tracking status from Shippo
    // NOTE: SDK expects (trackingNumber, carrier)
    const tracking = await shippo.trackingStatus.get(
      shipment.trackingNumber,
      shipment.selectedRate.carrier
    );

    // Safeguard against undefined history for newly created test labels
    const historyList = tracking.trackingHistory || [];

    const events = historyList.map((event: any) => {
      // Safely format location
      let locationStr = "Unknown";
      if (event.location) {
        const city = event.location.city || "";
        const state = event.location.state || "";
        locationStr = [city, state].filter(Boolean).join(", ") || "Unknown";
      }

      // Safely format date (handle both String and Date Object)
      let dateStr = "";
      if (event.statusDate) {
        dateStr = typeof event.statusDate === "string" 
          ? event.statusDate 
          : event.statusDate.toISOString ? event.statusDate.toISOString() : String(event.statusDate);
      }

      return {
        status: event.status || "UNKNOWN",
        location: locationStr,
        date: dateStr,
      };
    });

    return {
      status: tracking.trackingStatus?.status || "UNKNOWN",
      statusDetails: tracking.trackingStatus?.statusDetails || "",
      carrier: shipment.selectedRate.carrier,
      trackingNumber: shipment.trackingNumber,
      trackingUrl: shipment.trackingUrl || "",
      events,
    };
  } catch (error: any) {
    console.error("Shippo Tracking API Error:", error.message);
    
    // Fallback for newly created test labels that are not yet registered with the carrier
    return {
      status: "PENDING",
      statusDetails: "Tracking information is currently unavailable or pending carrier update.",
      carrier: shipment.selectedRate.carrier,
      trackingNumber: shipment.trackingNumber,
      trackingUrl: shipment.trackingUrl || "",
      events: [],
    };
  }
}