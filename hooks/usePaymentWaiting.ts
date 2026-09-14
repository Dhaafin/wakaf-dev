"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import { useToast } from "@/lib/store/toast";
import type { Transaction } from "@/types";

export function usePaymentWaiting(txId: string) {
  const router = useRouter();
  const { push } = useToast();

  const [tx, setTx] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState<boolean>(false);
  const [simulating, setSimulating] = useState<boolean>(false);
  const [expiring, setExpiring] = useState<boolean>(false);
  const redirectedRef = useRef(false);

  // Initial fetch
  const fetchTransaction = useCallback(
    async (isBackground = false) => {
      if (!isBackground) setLoading(true);
      try {
        const fresh = await api.getTransaction(txId);
        setTx(fresh);
        setError(null);
        return fresh;
      } catch (err) {
        if (!isBackground) {
          setError(err instanceof Error ? err.message : "Gagal memuat transaksi");
        }
        return null;
      } finally {
        if (!isBackground) setLoading(false);
      }
    },
    [txId],
  );

  useEffect(() => {
    fetchTransaction();
  }, [fetchTransaction]);

  // Kalau transaksi ternyata sudah "paid", langsung alihkan ke halaman sukses.
  useEffect(() => {
    if (tx?.status === "paid" && !redirectedRef.current) {
      redirectedRef.current = true;
      router.replace(`/sukses/${tx.id}`);
    }
  }, [tx?.status, tx?.id, router]);

  // Polling otomatis setiap 5 detik saat transaksi masih berstatus pending
  useEffect(() => {
    if (!tx || tx.status !== "pending") return;
    const interval = setInterval(async () => {
      try {
        const fresh = await api.getTransaction(txId);
        if (fresh) {
          setTx(fresh);
        }
      } catch {
        /* abaikan error polling di background */
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [tx?.status, txId]);

  // Trigger manual cek status
  const handleManualCheck = useCallback(async () => {
    setChecking(true);
    try {
      const fresh = await fetchTransaction(true);
      if (fresh?.status === "paid") {
        push({
          kind: "success",
          title: "Pembayaran Diterima!",
          desc: "Alhamdulillah, pembayaran Anda telah terkonfirmasi lunas.",
        });
        redirectedRef.current = true;
        router.replace(`/sukses/${fresh.id}`);
      } else if (fresh?.status === "expired") {
        push({
          kind: "info",
          title: "Transaksi Kedaluwarsa",
          desc: "Batas waktu pembayaran untuk transaksi ini telah habis.",
        });
      } else {
        push({
          kind: "info",
          title: "Menunggu Pembayaran",
          desc: "Pembayaran belum terdeteksi. Silakan selesaikan transaksi melalui Midtrans.",
        });
      }
    } catch {
      push({
        kind: "error",
        title: "Gagal Memeriksa Status",
        desc: "Terjadi gangguan jaringan, coba beberapa saat lagi.",
      });
    } finally {
      setChecking(false);
    }
  }, [fetchTransaction, push, router]);

  // Membuka popup Snap Midtrans
  const handleOpenMidtrans = useCallback(() => {
    if (!tx?.snapToken || typeof window === "undefined" || !window.snap) {
      push({
        kind: "error",
        title: "Layanan Pembayaran Belum Siap",
        desc: "Token pembayaran Midtrans tidak ditemukan. Coba segarkan halaman.",
      });
      return;
    }

    window.snap.pay(tx.snapToken, {
      onSuccess: () => {
        push({
          kind: "success",
          title: "Pembayaran Berhasil",
          desc: "Alhamdulillah, wakaf Anda telah berhasil ditunaikan.",
        });
        redirectedRef.current = true;
        router.replace(`/sukses/${tx.id}`);
      },
      onPending: () => {
        push({
          kind: "info",
          title: "Menunggu Pembayaran",
          desc: "Silakan selesaikan transaksi sesuai instruksi metode yang dipilih.",
        });
        fetchTransaction(true);
      },
      onError: () => {
        push({
          kind: "error",
          title: "Pembayaran Belum Berhasil",
          desc: "Terjadi kendala pada transaksi. Silakan coba kembali.",
        });
      },
      onClose: () => {
        fetchTransaction(true);
      },
    });
  }, [tx, push, router, fetchTransaction]);

  // Simulasi demo (khusus pengujian)
  const handleSimulatePayment = useCallback(async () => {
    if (!tx || simulating) return;
    setSimulating(true);
    try {
      const res = await api.simulatePayment(tx.id);
      setTx(res.transaction);
      push({
        kind: "success",
        title: "Pembayaran Diterima (Simulasi)",
        desc: "Status transaksi kini LUNAS. Mengalihkan ke halaman sukses…",
      });
      redirectedRef.current = true;
      setTimeout(() => router.replace(`/sukses/${tx.id}`), 900);
    } catch (e) {
      push({
        kind: "error",
        title: "Simulasi Gagal",
        desc: e instanceof Error ? e.message : undefined,
      });
      setSimulating(false);
    }
  }, [tx, simulating, push, router]);

  const handleExpire = useCallback(async () => {
    if (!tx || tx.status !== "pending" || expiring) return;
    setExpiring(true);
    try {
      const updated = await api.expireTransaction(tx.id);
      setTx(updated);
      push({
        kind: "info",
        title: "Waktu Pembayaran Habis",
        desc: "Batas waktu transaksi kedaluwarsa.",
      });
    } catch {
      /* abaikan bila sudah dibayar */
    } finally {
      setExpiring(false);
    }
  }, [tx, expiring, push]);

  return {
    tx,
    loading,
    error,
    checking,
    simulating,
    expiring,
    handleManualCheck,
    handleOpenMidtrans,
    handleSimulatePayment,
    handleExpire,
  };
}
