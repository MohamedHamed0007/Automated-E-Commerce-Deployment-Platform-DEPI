import { NextResponse } from "next/server";

import { markChatClosed } from "@/lib/chatRepository";

export const dynamic = "force-dynamic";

export async function PATCH(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await markChatClosed(id);

    return NextResponse.json({ data: { id, closed: true } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to close chat";
    return NextResponse.json({ message }, { status: 500 });
  }
}
