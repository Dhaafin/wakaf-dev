import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import { MOCK_LATENCY_MIN, MOCK_LATENCY_MAX } from "@/lib/config";

// ============================================================================
// Helper sisi SERVER untuk API routes mock.
// ----------------------------------------------------------------------------
// DEMO: setiap respons sengaja ditunda 500–1500ms supaya UI menampilkan
// skeleton / spinner seperti memanggil backend sungguhan. Hapus `mockLatency()`
// saat backend asli sudah terpasang.
// ============================================================================

export function mockLatency(): Promise<void> {
  const ms =
    MOCK_LATENCY_MIN +
    Math.random() * (MOCK_LATENCY_MAX - MOCK_LATENCY_MIN);
  return new Promise((r) => setTimeout(r, ms));
}

export async function ok<T>(data: T, init?: number): Promise<NextResponse> {
  await mockLatency();
  const body: ApiResponse<T> = { ok: true, data };
  return NextResponse.json(body, { status: init ?? 200 });
}

export async function fail(
  error: string,
  status = 400,
  fieldErrors?: Record<string, string>,
): Promise<NextResponse> {
  await mockLatency();
  const body: ApiResponse<never> = { ok: false, error, fieldErrors };
  return NextResponse.json(body, { status });
}
