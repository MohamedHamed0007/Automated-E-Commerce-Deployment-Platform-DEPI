import { NextResponse } from "next/server";

import { appendMessage } from "@/lib/chatRepository";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { chatId?: string; message?: string };
    const chatId = body.chatId?.trim();
    const message = body.message?.trim();

    if (!chatId || !message) {
      return NextResponse.json(
        { message: "chatId and message are required." },
        { status: 400 }
      );
    }

    const createdMessage = await appendMessage(chatId, message);
    return NextResponse.json({ data: createdMessage }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send message";
    return NextResponse.json({ message }, { status: 500 });
  }
}
