"use client";

import { useState, useCallback, useEffect } from "react";
import type { Certificate } from "@/types";
import { api, ApiError } from "@/lib/api/client";

export function useVerification(initialKode = "") {
  const [kode, setKode] = useState(initialKode);
  const [loading, setLoading] = useState(false);
  const [hasil, setHasil] = useState<Certificate | null>(null);
  const [notFound, setNotFound] = useState(false);

  const executeVerification = useCallback(async (targetCode: string) => {
    const trimmed = targetCode.trim();
    if (!trimmed) return;

    setLoading(true);
    setHasil(null);
    setNotFound(false);
    try {
      const cert = await api.getCertificate(trimmed);
      setHasil(cert);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setNotFound(true);
      } else {
        setNotFound(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleVerify = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      await executeVerification(kode);
    },
    [kode, executeVerification],
  );

  const handleReset = useCallback(() => {
    setKode("");
    setHasil(null);
    setNotFound(false);
  }, []);

  // Baca query parameter ?kode=... dari URL jika tersedia (mis. scan QR code)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryKode = params.get("kode");
      if (queryKode) {
        setKode(queryKode);
        executeVerification(queryKode);
      }
    }
  }, [executeVerification]);

  return {
    kode,
    setKode,
    loading,
    hasil,
    notFound,
    handleVerify,
    handleReset,
  };
}
