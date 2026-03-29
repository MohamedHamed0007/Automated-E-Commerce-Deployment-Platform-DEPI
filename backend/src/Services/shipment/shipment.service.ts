import ShipmentModel from "../../config/DB/Models/Shipment/Shipment.models";
import { shippo } from "../../config/env/env";
import { IAddress, IRate, IShipment } from "../../types/Shipment/shipment.mongoose.types";
import { applyCommission } from "../commission/commission.service";
import { createNotFoundError } from "../../utils/ApiErrors/ApiErrors";

interface PackageInput {
  length: number;
  width: number;
  height: number;
  units: "cm" | "in";
  weight: number;
}

interface CreateShipmentInput {
  userId: string;
  package: PackageInput;
  senderAddress: IAddress;
  receiverAddress: IAddress;
}

interface SelectRateInput {
  shipmentId: string;
  userId: string;
  shippoRateId: string;
}


function buildShippoAddress(address: IAddress) {
  return {
    name: address.name,
    phone: address.phone,
    email: address.email,
    street1: address.street,
    city: address.city,
    state: address.state,
    zip: address.zip,
    country: address.country,
  };
}


export async function createShipment(data: CreateShipmentInput): Promise<IShipment> {
  return await ShipmentModel.create({
    userId: data.userId,
    package: data.package,
    senderAddress: data.senderAddress,
    receiverAddress: data.receiverAddress,
    comparisonResults: [],
    selectedRate: null,
    status: "draft",
    shippoShipmentId: null,
  });
}

export async function getUserShipments(userId: string): Promise<IShipment[]> {
  return await ShipmentModel.find({ userId }).sort({ createdAt: -1 });
}

export async function getShipmentById(shipmentId: string, userId: string): Promise<IShipment> {
  const shipment = await ShipmentModel.findOne({ _id: shipmentId, userId });
  if (!shipment) throw createNotFoundError("Shipment not found");
  return shipment;
}


export async function compareRates(shipmentId: string, userId: string): Promise<IRate[]> {
  const shipment = await ShipmentModel.findOne({ _id: shipmentId, userId });
  if (!shipment) throw createNotFoundError("Shipment not found");

  const addressFrom = buildShippoAddress(shipment.senderAddress);
  const addressTo = buildShippoAddress(shipment.receiverAddress);

  const parcel = {
    length: shipment.package.length.toString(),
    width: shipment.package.width.toString(),
    height: shipment.package.height.toString(),
    distanceUnit: shipment.package.units,
    massUnit: "g" as any,
    weight: (shipment.package.weight * 1000).toString(),
  };

  const result = await shippo.shipments.create({
    addressFrom,
    addressTo,
    parcels: [parcel],
    async: false,
  });

  if (result.status === "ERROR") {
    const messages = result.messages.map((m: any) => m.text).join(", ");
    throw new Error(`Shippo Error: ${messages}`);
  }

  const rates: IRate[] = result.rates.map((r: any) => ({
    carrier: r.provider,
    service: r.servicelevel?.name || "Standard",
    finalRate: applyCommission(parseFloat(r.amount)),
    currency: r.currency,
    deliveryDays: r.estimatedDays || 0,
    shippoRateId: r.objectId,
  }));

  shipment.comparisonResults = rates;
  shipment.shippoShipmentId = result.objectId;
  shipment.status = "compared";
  await shipment.save();

  return rates;
}


export async function selectRate(input: SelectRateInput): Promise<IShipment> {
  const shipment = await ShipmentModel.findOne({ _id: input.shipmentId, userId: input.userId });
  if (!shipment) throw createNotFoundError("Shipment not found");

  if (shipment.status !== "compared") {
    throw new Error("Shipment must be in 'compared' status to select a rate");
  }

  const rate = shipment.comparisonResults.find((r) => r.shippoRateId === input.shippoRateId);
  if (!rate) throw new Error("The selected rate is not found in comparison results");

  shipment.selectedRate = rate;
  shipment.status = "compared";
  await shipment.save();

  return shipment;
}


export async function createLabel(shipmentId: string): Promise<IShipment> {
  const shipment = await ShipmentModel.findById(shipmentId);
  if (!shipment) throw createNotFoundError("Shipment not found");


  if (shipment.status === "booked" && shipment.trackingNumber) {
    console.log("[DEBUG] Shipment already booked. Skipping label creation.");
    return shipment;
  }

 
  if (!shipment.selectedRate || !shipment.selectedRate.shippoRateId) {
    throw new Error("Shipment must have a selected rate to create a label");
  }

  try {
    console.log(`[DEBUG] Attempting Shippo Transaction for Rate ID: ${shipment.selectedRate.shippoRateId}`);

    const transaction = await shippo.transactions.create({
      rate: shipment.selectedRate.shippoRateId,
      labelFileType: "PDF",
      async: false,
    });

    console.log(`[DEBUG] Shippo Transaction Response Status: ${transaction.status}`);

    if (transaction.status !== "SUCCESS") {
      console.error("❌ Shippo Transaction Failed!");
      console.error("Full Debug Messages:", JSON.stringify(transaction.messages, null, 2));
      
      throw new Error(transaction.messages?.[0]?.text || "Label purchase failed from Shippo side");
    }

 
    shipment.trackingNumber = transaction.trackingNumber;
    shipment.trackingUrl = transaction.trackingUrlProvider;
    shipment.labelUrl = transaction.labelUrl;
    shipment.paidOn = new Date();
    shipment.status = "booked";

    await shipment.save();
    console.log("✅ Shipment status updated to 'booked' successfully.");

    return shipment;
  } catch (error: any) {
    console.error("❌ Error in createLabel Service:", error.message);
    throw error;
  }
}