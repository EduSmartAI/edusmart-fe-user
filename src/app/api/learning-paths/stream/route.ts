import { NextRequest, NextResponse } from "next/server";
import apiServer from "EduSmart/lib/apiServer";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams;
  const learningPathId =
    search.get("learningPathId") ?? search.get("LearningPathId");

  if (!learningPathId) {
    return NextResponse.json(
      { success: false, message: "Missing learningPathId" },
      { status: 400 },
    );
  }

  try {
    const upstream = await apiServer.student.api.learningPathsList(
      { LearningPathId: learningPathId },
      {
        headers: { Accept: "text/event-stream" },
        format: undefined,
        cache: "no-store",
      },
    );

    if (!upstream.body) {
      return NextResponse.json(
        { success: false, message: "Upstream stream unavailable" },
        { status: 502 },
      );
    }

    const headers = new Headers(upstream.headers);
    headers.set("Content-Type", "text/event-stream");
    headers.set("Cache-Control", "no-cache, no-transform");
    headers.set("Connection", "keep-alive");

    return new Response(upstream.body, {
      status: upstream.status ?? 200,
      headers,
    });
  } catch (err) {
    console.error("[learning-paths] stream error:", err);
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : "Internal server error",
      },
      { status: 502 },
    );
  }
}

