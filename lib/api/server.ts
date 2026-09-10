import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types";

export function ok<T>(data: T, init?: number): NextResponse {
  const body: ApiResponse<T> = { ok: true, data };
  return NextResponse.json(body, { status: init ?? 200 });
}

export function fail(
  error: string,
  status = 400,
  fieldErrors?: Record<string, string>,
): NextResponse {
  const body: ApiResponse<never> = { ok: false, error, fieldErrors };
  return NextResponse.json(body, { status });
}

