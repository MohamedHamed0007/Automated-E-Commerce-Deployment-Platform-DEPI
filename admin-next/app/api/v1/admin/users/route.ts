import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongoose";
import UserModel from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();

    const users = await UserModel.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ data: users });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch users";

    return NextResponse.json({ message }, { status: 500 });
  }
}
