import { NextResponse } from "next/server";

import { createChatThread } from "@/lib/chatRepository";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      userId?: string;
      participantName?: string;
      participantEmail?: string;
      name?: string;
      email?: string;
    };

    const createdChat = await createChatThread(body);
    return NextResponse.json({ data: createdChat }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create chat";
    return NextResponse.json({ message }, { status: 500 });
  }
}
