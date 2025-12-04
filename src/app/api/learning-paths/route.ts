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

  const mode = search.get("mode");
  const acceptHeader =
    mode === "text" ? "text/plain, application/json" : "application/json";

  try {
    const result = await apiServer.student.api.learningPathsList(
      { LearningPathId: learningPathId },
      {
        headers: { Accept: acceptHeader },
        cache: "no-store",
      },
    );

    return NextResponse.json(result.data ?? null, {
      status: result.status ?? 200,
    });
  } catch (err) {
    console.error("[learning-paths] snapshot error:", err);
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : "Internal server error",
      },
      { status: 502 },
    );
  }
}

