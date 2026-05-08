import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongoose";
import ShipmentModel from "@/models/Shipment";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();

    const shipments = await ShipmentModel.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ data: shipments });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch shipments";

    return NextResponse.json({ message }, { status: 500 });
  }
}
