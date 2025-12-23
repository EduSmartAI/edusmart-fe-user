import { NextRequest } from "next/server";
import {
  getAuthHeaderFromCookie,
  getSidFromCookie,
  refreshTokens,
} from "EduSmart/lib/authServer";

const BACKEND = process.env.API_URL?.replace(/\/$/, "");
if (!BACKEND) {
  throw new Error("Missing API_URL env for learning-path SSE proxy");
}

const STREAM_TARGET = `${BACKEND}/student/api/LearningPaths/stream-by-id`;

export const runtime = "nodejs";

async function openUpstreamStream(
  learningPathId: string,
  abortSignal: AbortSignal,
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "text/event-stream",
  };

  if (STREAM_TARGET.includes("ngrok")) {
    headers["ngrok-skip-browser-warning"] = "true";
  }

  const applyAuthHeaders = async () => {
    const auth = await getAuthHeaderFromCookie();
    if (!auth) return null;
    return { ...headers, ...auth };
  };

  const authHeaders = await applyAuthHeaders();
  if (!authHeaders) {
    return new Response("Unauthorized", { status: 401 });
  }

  const baseRequest = {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({ learningPathId }),
    cache: "no-store" as RequestCache,
    signal: abortSignal,
  };

  const response = await fetch(STREAM_TARGET, baseRequest);
  if (response.status !== 401) {
    return response;
  }

  const sid = await getSidFromCookie();
  if (!sid) {
    return response;
  }

  try {
    // Skip cookie update - Route Handler không phải Server Action, cookie sẽ được set từ Server Actions
    await refreshTokens(sid, true);
  } catch {
    return response;
  }

  const refreshedHeaders = await applyAuthHeaders();
  if (!refreshedHeaders) {
    return response;
  }

  return fetch(STREAM_TARGET, {
    ...baseRequest,
    headers: refreshedHeaders,
  });
}

export async function POST(req: NextRequest) {
  let payload: { learningPathId?: string } = {};
  try {
    payload = await req.json();
  } catch {
    // ignore – handled below
  }

  const learningPathId = payload.learningPathId?.trim();
  if (!learningPathId) {
    return new Response("learningPathId is required", { status: 400 });
  }

  const upstreamAbort = new AbortController();
  req.signal.addEventListener("abort", () => upstreamAbort.abort(), {
    once: true,
  });

  const upstream = await openUpstreamStream(
    learningPathId,
    upstreamAbort.signal,
  );

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => "");
    const message =
      text || `Upstream stream failed with status ${upstream.status}`;
    return new Response(message, { status: upstream.status });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body!.getReader();
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          if (value) controller.enqueue(value);
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      } finally {
        reader.releaseLock();
      }
    },
    cancel() {
      upstreamAbort.abort();
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

