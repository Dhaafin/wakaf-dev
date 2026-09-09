import Link from "next/link";
import { LoginForm } from "./molecules/LoginForm";

export function LoginOrganism() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-brand-950 text-white flex items-center justify-center py-12">
      {/* BACKGROUND GRADIENT GLOW */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(600px circle at 15% 20%, #1e9a4c 0, transparent 45%), radial-gradient(500px circle at 85% 10%, #44b06a 0, transparent 40%)",
        }}
      />

      <div className="container-app relative max-w-md w-full animate-fade-in">
        <div className="text-center mb-6">
          <span className="badge bg-white/10 text-brand-100 inline-block">
            Wakaf Digital KBM · Autentikasi
          </span>
          <h1 className="mt-3 font-serif text-3xl font-bold text-white">
            Selamat Datang
          </h1>
          <p className="mt-2 text-sm text-brand-100/80">
            Masuk ke akun Anda untuk mengelola program &amp; transparansi.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white p-8 text-brand-950 shadow-2xl">
          <LoginForm />

          <div className="mt-6 text-center text-xs text-brand-600 border-t border-brand-100 pt-4">
            Belum punya akun?{" "}
            <Link href="/program" className="font-semibold text-brand-700 hover:underline">
              Mulai Berwakaf Tanpa Akun
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
