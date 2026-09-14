"use client";

import { useState, useCallback } from "react";
import { api } from "@/lib/api/client";
import { useAsync } from "@/lib/hooks/use-async";
import { useToast } from "@/lib/store/toast";
import { PROGRAM_TYPE_TERMS, type Certificate } from "@/types";
import { formatRupiah, formatTanggal } from "@/lib/format";

export function useCertificate(rawCertId: string) {
  const certId = decodeURIComponent(rawCertId);
  const { push } = useToast();
  const [downloading, setDownloading] = useState(false);

  const {
    data: cert,
    loading,
    error,
  } = useAsync(() => api.getCertificate(certId), [certId]);

  const handlePrint = useCallback(() => {
    if (typeof window !== "undefined") {
      window.print();
    }
  }, []);

  const handleDownloadPdf = useCallback(async () => {
    if (!cert) return;
    setDownloading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4",
      });

      const W = doc.internal.pageSize.getWidth();
      const H = doc.internal.pageSize.getHeight();
      const terms = PROGRAM_TYPE_TERMS[cert.program_type];

      // Bingkai ganda elegan - Nuansa Hijau Zamrud KBM
      doc.setDrawColor(21, 124, 61);
      doc.setLineWidth(3);
      doc.rect(24, 24, W - 48, H - 48);

      doc.setDrawColor(187, 247, 208);
      doc.setLineWidth(1);
      doc.rect(32, 32, W - 64, H - 64);

      // Header Organisasi
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(21, 124, 61);
      doc.text("YAYASAN KHAZANAH BERKAH MULIA", W / 2, 68, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(
        "Terdaftar & Diakui Resmi di Badan Wakaf Indonesia (BWI) — Surat Keputusan No. 3.3.00318",
        W / 2,
        82,
        { align: "center" },
      );

      // Judul Sertifikat
      doc.setFont("times", "bold");
      doc.setFontSize(28);
      doc.setTextColor(6, 78, 59);
      doc.text(terms.bukti.toUpperCase(), W / 2, 125, { align: "center" });

      // Nomor Dokumen
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(71, 85, 105);
      doc.text(`Nomor Registrasi: ${cert.id}`, W / 2, 148, { align: "center" });

      // Garis Aksen Emas/Zamrud
      doc.setDrawColor(202, 138, 4);
      doc.setLineWidth(1.5);
      doc.line(W / 2 - 80, 160, W / 2 + 80, 160);

      // Teks Pernyataan
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(51, 65, 85);
      doc.text("Dengan penuh rasa syukur dan amanah, menerangkan bahwa:", W / 2, 195, {
        align: "center",
      });

      // Nama Pihak
      doc.setFont("times", "bold");
      doc.setFontSize(24);
      doc.setTextColor(6, 78, 59);
      doc.text(cert.namaPihak, W / 2, 230, { align: "center" });

      // Keterangan Akad & Program
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(51, 65, 85);
      const narasi = `Telah menunaikan amanah ${terms.kataKerja} sejumlah ${formatRupiah(
        cert.nominal,
      )} untuk dialokasikan pada program "${cert.programNama}".`;
      doc.text(doc.splitTextToSize(narasi, W - 220), W / 2, 265, {
        align: "center",
      });

      // Kotak Rincian Bawah
      const boxY = 320;
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(W / 2 - 220, boxY, 440, 60, 4, 4, "F");

      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text("Tanggal Penerbitan", W / 2 - 200, boxY + 24);
      doc.text("Lembaga Nazhir / Pengelola", W / 2 + 30, boxY + 24);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(formatTanggal(cert.tanggal), W / 2 - 200, boxY + 44);
      doc.text(cert.nazhir, W / 2 + 30, boxY + 44);

      // Doa & Penutup
      doc.setFont("times", "italic");
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.text(
        "Semoga Allah SWT menerima amal ibadah ini, melipatgandakan pahala, dan menjadikannya saksi kebaikan di akhirat kelak.",
        W / 2,
        425,
        { align: "center" },
      );

      // Footer Verifikasi
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Dokumen digital ini diterbitkan secara sah dan dapat diverifikasi keasliannya melalui sistem resmi Yayasan Khazanah Berkah Mulia.`,
        W / 2,
        H - 50,
        { align: "center" },
      );

      doc.save(`${terms.bukti.replace(/\s+/g, "-")}-${cert.id.replace(/\//g, "-")}.pdf`);

      push({
        kind: "success",
        title: "Unduh Berhasil",
        desc: "Berkas PDF sertifikat digital telah diunduh ke perangkat Anda.",
      });
    } catch (err) {
      console.error("Download PDF error:", err);
      push({
        kind: "error",
        title: "Gagal Mengunduh PDF",
        desc: "Terjadi kendala saat menghasilkan dokumen sertifikat.",
      });
    } finally {
      setDownloading(false);
    }
  }, [cert, push]);

  const handleShare = useCallback(async () => {
    if (!cert) return;
    const url = typeof window !== "undefined" ? window.location.href : "";
    const terms = PROGRAM_TYPE_TERMS[cert.program_type];
    const text = `Alhamdulillah, berikut adalah ${terms.bukti} resmi dari Yayasan Khazanah Berkah Mulia: ${url}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: terms.bukti,
          text,
          url,
        });
        return;
      } catch {
        /* fallback clipboard */
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      push({
        kind: "info",
        title: "Tautan Disalin",
        desc: "Tautan sertifikat digital berhasil disalin ke papan klip.",
      });
    }
  }, [cert, push]);

  return {
    cert,
    loading,
    error,
    certId,
    downloading,
    handlePrint,
    handleDownloadPdf,
    handleShare,
  };
}
