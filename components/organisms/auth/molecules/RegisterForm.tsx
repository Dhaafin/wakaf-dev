"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { Spinner } from "@/components/atoms/Spinner";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password: password,
      });

      if (res.error) {
        setErrorMessage(
          res.error.message || "Gagal mendaftar. Periksa kembali data Anda."
        );
      } else {
        router.replace("/riwayat");
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
        <label htmlFor="name" className="label">
          Nama Lengkap
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
          placeholder="Fulan bin Fulan"
        />
      </div>

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
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          placeholder="Minimal 8 karakter"
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
        {loading && <Spinner className="h-4 w-4" />}
        Daftar Sekarang
      </button>
    </form>
  );
}
