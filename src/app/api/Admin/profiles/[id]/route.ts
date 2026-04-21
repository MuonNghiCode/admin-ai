import { NextRequest } from "next/server";
import { forwardProxyRequest } from "@/app/api/_shared/proxy";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  await context.params;
  return forwardProxyRequest(request, "GET", "profiles");
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  await context.params;
  return forwardProxyRequest(request, "PUT", "profiles");
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  await context.params;
  return forwardProxyRequest(request, "DELETE", "profiles");
}
