import mongoose, { Document } from "mongoose";

export interface IRate {
  carrier: string; // e.g. "UPS"
  service: string; // e.g. "Ground"
  finalRate: number; // carrier rate + commission (user sees this)
  currency: string; // "USD"
  deliveryDays: number;
  shippoRateId: string; // Shippo's internal ID, needed to book
}

// The package dimensions
 export interface IPackage {
  length: number;
  width: number;
  height: number;
  units: "cm" | "in";
  weight: number;
}

// An address object
 export interface IAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface IShipment extends Document {
  userId: mongoose.Types.ObjectId;
  package: IPackage;
  senderAddress: IAddress;
  receiverAddress: IAddress;
  comparisonResults: IRate[]; // filled after carrier API call
  selectedRate?: IRate; // filled when user picks one
  status: "draft" | "compared" | "booked" | "cancelled";
  paidOn?: Date;
  createdAt: Date;
  updatedAt: Date;
}
