import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectToDatabase } from "@/lib/mongoose";
import ShipmentModel from "@/models/Shipment";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await context.params;

    const shipment = mongoose.Types.ObjectId.isValid(id)
      ? await ShipmentModel.findById(id).lean()
      : await ShipmentModel.findOne({ trackingNumber: id }).lean();

    if (!shipment) {
      return NextResponse.json({ message: "Shipment not found" }, { status: 404 });
    }

    return NextResponse.json({ data: shipment });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch shipment";

    return NextResponse.json({ message }, { status: 500 });
  }
}
