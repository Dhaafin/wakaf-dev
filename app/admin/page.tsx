"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api/client";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/lib/store/toast";
import { DEMO_ADMIN } from "@/lib/config";
import { Spinner } from "@/components/ui/spinner";

// LOGIN ADMIN (mock). Satu akun di-hardcode di lib/config.ts (DEMO_ADMIN).
export default function AdminLoginPage() {
  const router = useRouter();
  const admin = useSession((s) => s.admin);
  const loginAdmin = useSession((s) => s.loginAdmin);
  const { push } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (admin) router.replace("/admin/dashboard");
  }, [admin, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const res = await api.adminLogin(email.trim(), password);
      loginAdmin({ email: res.email, nama: res.nama });
      push({ kind: "success", title: "Selamat datang, Admin" });
      router.replace("/admin/dashboard");
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) setErrors(err.fieldErrors);
      push({
        kind: "error",
        title: "Login admin gagal",
        desc: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md py-10">
      <div className="rounded-2xl border border-brand-200 bg-white p-8 shadow-sm">
        <h1 className="font-serif text-2xl font-bold text-brand-950">
          Masuk Panel Admin
        </h1>
        <p className="mt-1 text-sm text-brand-600">
          Area pengelola yayasan. Terpisah dari alur publik.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <div>
            <label htmlFor="email" className="label">
              Email admin
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="admin@kbm.or.id"
            />
          </div>
          <div>
            <label htmlFor="password" className="label">
              Kata sandi
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`input ${errors.password ? "input-error" : ""}`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="field-error">{errors.password}</p>
            )}
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading && <Spinner className="h-4 w-4" />}
            Masuk
          </button>
        </form>

        <div className="mt-4 rounded-xl bg-brand-50 p-3 text-xs text-brand-500">
          <p className="font-semibold text-brand-600">Kredensial demo</p>
          <p className="mt-1 font-mono">{DEMO_ADMIN.email}</p>
          <p className="font-mono">{DEMO_ADMIN.password}</p>
        </div>
      </div>
    </div>
  );
}
