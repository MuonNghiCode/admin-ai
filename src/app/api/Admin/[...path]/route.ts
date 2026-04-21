import type { NextRequest } from "next/server";
import { forwardProxyRequest } from "@/app/api/_shared/proxy";

export async function GET(request: NextRequest) {
  return forwardProxyRequest(request, "GET", "admin");
}

export async function POST(request: NextRequest) {
  return forwardProxyRequest(request, "POST", "admin");
}

export async function PUT(request: NextRequest) {
  return forwardProxyRequest(request, "PUT", "admin");
}

export async function PATCH(request: NextRequest) {
  return forwardProxyRequest(request, "PATCH", "admin");
}

export async function DELETE(request: NextRequest) {
  return forwardProxyRequest(request, "DELETE", "admin");
}
