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
    name: "Shipment",
    street1: address.street,
    city: address.city,
    state: address.state,
    zip: address.zip,
    country: address.country,
  };
}

// -------------------------
// 1️⃣ Create a new Shipment (Draft)
// -------------------------
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

// -------------------------
// 2️⃣ Get User's Shipments
// -------------------------
export async function getUserShipments(userId: string): Promise<IShipment[]> {
  return await ShipmentModel.find({ userId }).sort({ createdAt: -1 });
}

// -------------------------
// 3️⃣ Get Shipment by ID (with user ownership check)
// -------------------------
export async function getShipmentById(shipmentId: string, userId: string): Promise<IShipment> {
  const shipment = await ShipmentModel.findOne({ _id: shipmentId, userId });
  if (!shipment) throw createNotFoundError("Shipment not found");
  return shipment;
}

// -------------------------
// 4️⃣ Compare Rates from Shippo
// -------------------------
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

// -------------------------
// 5️⃣ Select Rate (save rate, no label yet)
// -------------------------
export async function selectRate(input: SelectRateInput): Promise<IShipment> {
  const shipment = await ShipmentModel.findOne({ _id: input.shipmentId, userId: input.userId });
  if (!shipment) throw createNotFoundError("Shipment not found");

  if (shipment.status !== "compared") {
    throw new Error("Shipment must be in 'compared' status to select a rate");
  }

  const rate = shipment.comparisonResults.find((r) => r.shippoRateId === input.shippoRateId);
  if (!rate) throw new Error("The selected rate is not found in comparison results");

  shipment.selectedRate = rate;
  shipment.status = "booked";
  await shipment.save();

  return shipment;
}

// -------------------------
// 6️⃣ Create Label (called by payment team after payment)
// -------------------------
export async function createLabel(shipmentId: string): Promise<IShipment> {
  const shipment = await ShipmentModel.findById(shipmentId);
  if (!shipment) throw createNotFoundError("Shipment not found");

  if (shipment.status !== "booked" || !shipment.selectedRate) {
    throw new Error("Shipment must be booked with a selected rate to create a label");
  }

  const transaction = await shippo.transactions.create({
    rate: shipment.selectedRate.shippoRateId,
    labelFileType: "PDF",
    async: false,
  });

  if (transaction.status !== "SUCCESS") {
    throw new Error(transaction.messages?.[0]?.text || "Label purchase failed");
  }

  shipment.trackingNumber = transaction.trackingNumber;
  shipment.trackingUrl = transaction.trackingUrlProvider;
  shipment.labelUrl = transaction.labelUrl;
  shipment.paidOn = new Date();
  await shipment.save();

  return shipment;
}