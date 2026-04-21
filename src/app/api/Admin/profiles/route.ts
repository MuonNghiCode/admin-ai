import { NextRequest } from "next/server";
import { forwardProxyRequest } from "@/app/api/_shared/proxy";

export async function GET(request: NextRequest) {
  return forwardProxyRequest(request, "GET", "profiles");
}

export async function POST(request: NextRequest) {
  return forwardProxyRequest(request, "POST", "profiles");
}
