import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectToDatabase } from "@/lib/mongoose";
import UserModel from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
    }

    const user = await UserModel.findById(id).lean();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ data: user });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch user";

    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
    }

    const deletedUser = await UserModel.findByIdAndDelete(id).lean();

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ data: deletedUser });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete user";

    return NextResponse.json({ message }, { status: 500 });
  }
}
