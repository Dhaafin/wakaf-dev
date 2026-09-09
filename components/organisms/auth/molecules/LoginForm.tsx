"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Spinner } from "@/components/atoms/Spinner";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await signIn.email({
        email: email.trim(),
        password: password,
      });

      if (res.error) {
        setErrorMessage(res.error.message || "Gagal masuk. Periksa kembali email & password Anda.");
      } else {
        router.replace("/admin/dashboard");
      }
    } catch {
      setErrorMessage("Terjadi kesalahan sistem. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      {errorMessage && (
        <div className="rounded-xl bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-200">
          {errorMessage}
        </div>
      )}

      <div>
        <label htmlFor="email" className="label">
          Alamat Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          placeholder="nama@email.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="label">
          Kata Sandi
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          placeholder="••••••••"
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
        {loading && <Spinner className="h-4 w-4" />}
        Masuk
      </button>
    </form>
  );
}
