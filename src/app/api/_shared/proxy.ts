import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types";

type ProxyTarget = "admin" | "auth" | "profiles";

function resolveBackendBaseUrl() {
  return process.env.BACKEND_API_BASE_URL || "http://localhost:7017";
}

function extractDescription(payload: unknown, status: number, rawText: string) {
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;

    const nestedError = obj.error;
    if (nestedError && typeof nestedError === "object") {
      const nested = nestedError as Record<string, unknown>;
      if (typeof nested.description === "string" && nested.description.trim()) {
        return nested.description;
      }
    }

    if (typeof obj.description === "string" && obj.description.trim()) {
      return obj.description;
    }
    if (typeof obj.message === "string" && obj.message.trim()) {
      return obj.message;
    }
    if (typeof obj.title === "string" && obj.title.trim()) {
      return obj.title;
    }
  }

  if (rawText.trim()) {
    return rawText.slice(0, 600);
  }

  return status >= 500
    ? "Backend internal server error"
    : "Proxy request failed";
}

function wrap<T>(
  payload: unknown,
  status: number,
  rawText: string,
): ApiResponse<T> {
  if (
    payload &&
    typeof payload === "object" &&
    "isSuccess" in payload &&
    "isFailure" in payload &&
    "value" in payload
  ) {
    return payload as ApiResponse<T>;
  }

  const ok = status >= 200 && status < 300;
  return {
    value: payload as T,
    isSuccess: ok,
    isFailure: !ok,
    error: {
      code: ok ? "" : String(status),
      description: ok ? "" : extractDescription(payload, status, rawText),
    },
  };
}

export async function forwardProxyRequest(
  request: NextRequest,
  method: string,
  target: ProxyTarget,
) {
  const backendBase = resolveBackendBaseUrl();
  const upstream = `${backendBase}${request.nextUrl.pathname}${request.nextUrl.search}`;

  try {
    const headers: Record<string, string> = {
      Accept: "application/json, text/plain, */*",
    };

    const incomingContentType = request.headers.get("content-type");
    if (incomingContentType) {
      headers["Content-Type"] = incomingContentType;
    }

    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      headers.Authorization = authHeader;
    }

    const init: RequestInit = {
      method,
      cache: "no-store",
      headers,
    };

    if (method !== "GET" && method !== "HEAD") {
      const bodyText = await request.text();
      if (bodyText.length > 0) {
        init.body = bodyText;
        if (!headers["Content-Type"]) {
          headers["Content-Type"] = "application/json";
        }
      }
    }

    const upstreamResponse = await fetch(upstream, init);
    const rawText = await upstreamResponse.text();

    let payload: unknown = null;
    if (rawText.trim()) {
      try {
        payload = JSON.parse(rawText);
      } catch {
        payload = { message: rawText };
      }
    }

    return NextResponse.json(wrap(payload, upstreamResponse.status, rawText), {
      status: upstreamResponse.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        value: null,
        isSuccess: false,
        isFailure: true,
        error: {
          code: "NETWORK_ERROR",
          description:
            error instanceof Error
              ? error.message
              : `Cannot reach backend ${target} service`,
        },
      } satisfies ApiResponse<null>,
      { status: 502 },
    );
  }
}
