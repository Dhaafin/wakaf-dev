"use client";

import { useState } from "react";
import { PROGRAM_TYPE_TERMS, type Program } from "@/types";
import { api, ApiError } from "@/lib/api/client";
import { validateWakafForm } from "@/lib/validation";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/lib/store/toast";

export interface UseWakafFormOptions {
  program: Program;
  onCreated: (txId: string) => void;
  /** Nominal awal terisi — dipakai saat datang dari kalkulator zakat. */
  nominalAwal?: number;
}

export function useWakafForm({
  program,
  onCreated,
  nominalAwal,
}: UseWakafFormOptions) {
  const terms = PROGRAM_TYPE_TERMS[program.program_type];
  const wakif = useSession((s) => s.wakif);
  const { push } = useToast();

  const [nominal, setNominal] = useState<number | "">(nominalAwal ?? "");
  const [nama, setNama] = useState(wakif?.nama ?? "");
  const [email, setEmail] = useState(wakif?.email ?? "");
  const [telepon, setTelepon] = useState("");
  const [atasNama, setAtasNama] = useState<"sendiri" | "orang-lain">("sendiri");
  const [namaAtasNama, setNamaAtasNama] = useState("");
  const [visibilitas, setVisibilitas] = useState<"publik" | "anonim">("publik");
  const [doa, setDoa] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const values = {
      nominal,
      nama,
      email,
      telepon,
      atasNama,
      namaAtasNama,
      visibilitas,
      doa,
    };
    const localErrors = validateWakafForm(values);
    setErrors(localErrors);
    if (Object.keys(localErrors).length > 0) {
      push({
        kind: "error",
        title: "Form belum lengkap",
        desc: "Periksa kembali kolom yang ditandai merah.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const tx = await api.createTransaction({
        programId: program.id,
        nominal: Number(nominal),
        nama: nama.trim(),
        email: email.trim(),
        telepon: telepon.trim(),
        atasNama,
        namaAtasNama: atasNama === "orang-lain" ? namaAtasNama.trim() : undefined,
        visibilitas,
        doa: doa.trim() || undefined,
      });

      push({
        kind: "success",
        title: `Tagihan ${terms.judulForm.toLowerCase().replace(/^(tunaikan|salurkan) /, "")} dibuat`,
        desc: tx.snapToken
          ? "Membuka jendela pembayaran Midtrans..."
          : `Nomor VA ${tx.vaNumber} telah diterbitkan.`,
      });

      // Buka popup pembayaran Midtrans Snap secara instan bila tersedia
      if (tx.snapToken && typeof window !== "undefined" && window.snap) {
        window.snap.pay(tx.snapToken, {
          onSuccess: () => {
            push({
              kind: "success",
              title: "Pembayaran Berhasil",
              desc: "Alhamdulillah, donasi Anda telah berhasil ditunaikan.",
            });
            window.location.href = `/sukses/${tx.id}`;
          },
          onPending: () => {
            push({
              kind: "info",
              title: "Menunggu Pembayaran",
              desc: "Silakan selesaikan pembayaran sesuai metode yang Anda pilih.",
            });
            onCreated(tx.id);
          },
          onError: () => {
            push({
              kind: "error",
              title: "Pembayaran Belum Selesai",
              desc: "Terjadi kendala pada transaksi. Anda dapat mencoba kembali di halaman instruksi.",
            });
            onCreated(tx.id);
          },
          onClose: () => {
            onCreated(tx.id);
          },
        });
        return;
      }

      onCreated(tx.id);
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        setErrors(err.fieldErrors);
      }
      push({
        kind: "error",
        title: "Gagal membuat tagihan",
        desc: err instanceof Error ? err.message : undefined,
      });
      setSubmitting(false);
    }
  }

  return {
    terms,
    nominal,
    setNominal,
    nama,
    setNama,
    email,
    setEmail,
    telepon,
    setTelepon,
    atasNama,
    setAtasNama,
    namaAtasNama,
    setNamaAtasNama,
    visibilitas,
    setVisibilitas,
    doa,
    setDoa,
    errors,
    submitting,
    handleSubmit,
  };
}
