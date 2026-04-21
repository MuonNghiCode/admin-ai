import type { NextRequest } from "next/server";
import { forwardProxyRequest } from "@/app/api/_shared/proxy";

export async function GET(request: NextRequest) {
  return forwardProxyRequest(request, "GET", "auth");
}

export async function POST(request: NextRequest) {
  return forwardProxyRequest(request, "POST", "auth");
}

export async function PUT(request: NextRequest) {
  return forwardProxyRequest(request, "PUT", "auth");
}

export async function PATCH(request: NextRequest) {
  return forwardProxyRequest(request, "PATCH", "auth");
}

export async function DELETE(request: NextRequest) {
  return forwardProxyRequest(request, "DELETE", "auth");
}
