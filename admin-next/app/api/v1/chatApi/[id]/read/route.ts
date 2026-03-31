import { NextResponse } from "next/server";

import { markChatRead } from "@/lib/chatRepository";

export const dynamic = "force-dynamic";

export async function PATCH(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await markChatRead(id);

    return NextResponse.json({ data: { id, read: true } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to mark chat as read";
    return NextResponse.json({ message }, { status: 500 });
  }
}
