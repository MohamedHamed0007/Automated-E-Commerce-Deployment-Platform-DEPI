import { NextResponse } from "next/server";

import { listChats } from "@/lib/chatRepository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const chats = await listChats();
    return NextResponse.json({ data: chats });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch chats";
    return NextResponse.json({ message }, { status: 500 });
  }
}
