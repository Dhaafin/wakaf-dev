"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api/client";
import { useToast } from "@/lib/store/toast";
import type { AdminAnalyticsData } from "@/types";

export function useAdminAnalytics() {
  const { push } = useToast();
  const [data, setData] = useState<AdminAnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAdminAnalytics();
      setData(res);
      setLastUpdated(new Date());
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Gagal memuat analitik dashboard eksekutif.";
      setError(msg);
      push({
        kind: "error",
        title: "Gagal Memuat Analitik",
        desc: msg,
      });
    } finally {
      setLoading(false);
    }
  }, [push]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refetch: fetchAnalytics,
  };
}
