import { NextResponse } from "next/server";

import { listMessages } from "@/lib/chatRepository";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const limit = Math.max(1, Number(searchParams.get("limit") ?? "20"));

    const result = await listMessages(id, page, limit);

    return NextResponse.json({
      data: {
        messages: result.messages,
        total: result.total,
        page,
        limit,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch messages";
    return NextResponse.json({ message }, { status: 500 });
  }
}
