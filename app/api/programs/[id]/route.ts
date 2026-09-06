import { getProgram } from "@/lib/mock-db";
import { ok, fail } from "@/lib/api/server";

export const dynamic = "force-dynamic";

// GET /api/programs/:id — id boleh berupa id asli atau slug.
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const prog = getProgram(decodeURIComponent(params.id));
  if (!prog) return fail("Program tidak ditemukan.", 404);
  return ok(prog);
}
