"use client";

import { useState } from "react";
import type { Certificate } from "@/types";
import { formatRupiah, formatTanggal } from "@/lib/format";
import { PROGRAM_TYPE_LABEL } from "@/types";
import { Spinner } from "@/components/ui/spinner";

// Sertifikat wakaf. Tampil sebagai kartu print-friendly + tombol:
//  - "Unduh PDF": generate PDF sungguhan via jsPDF (import dinamis).
//  - "Cetak": window.print() (globals.css punya aturan @media print).
export function CertificateView({ cert }: { cert: Certificate }) {
  const [downloading, setDownloading] = useState(false);

  async function unduhPdf() {
    setDownloading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
      const W = doc.internal.pageSize.getWidth();
      const H = doc.internal.pageSize.getHeight();

      // bingkai — hijau KBM
      doc.setDrawColor(21, 124, 61);
      doc.setLineWidth(3);
      doc.rect(24, 24, W - 48, H - 48);
      doc.setLineWidth(1);
      doc.rect(34, 34, W - 68, H - 68);

      doc.setTextColor(12, 58, 32);
      doc.setFont("times", "bold");
      doc.setFontSize(26);
      doc.text("SERTIFIKAT WAKAF", W / 2, 100, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(90, 90, 90);
      doc.text("Yayasan Khazanah Berkah Mulia — Terdaftar di Badan Wakaf Indonesia", W / 2, 122, {
        align: "center",
      });

      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      doc.text("Dengan ini menerangkan bahwa:", W / 2, 170, { align: "center" });

      doc.setFont("times", "bold");
      doc.setFontSize(22);
      doc.setTextColor(12, 58, 32);
      doc.text(cert.namaPihak, W / 2, 205, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      const narasi = `telah menunaikan ${PROGRAM_TYPE_LABEL[cert.program_type]} sebesar ${formatRupiah(
        cert.nominal,
      )} untuk program "${cert.programNama}".`;
      doc.text(doc.splitTextToSize(narasi, W - 200), W / 2, 235, {
        align: "center",
      });

      doc.setFontSize(11);
      doc.text(`Nomor Sertifikat : ${cert.id}`, W / 2, 290, { align: "center" });
      doc.text(`Tanggal          : ${formatTanggal(cert.tanggal)}`, W / 2, 308, {
        align: "center",
      });
      doc.text(`Nazhir Pengelola : ${cert.nazhir}`, W / 2, 326, {
        align: "center",
      });

      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text(
        `Verifikasi keaslian di: /verifikasi  (kode: ${cert.id})`,
        W / 2,
        H - 60,
        { align: "center" },
      );
      doc.text(
        "Dokumen ini dihasilkan dari demo Wakaf Digital — bukan dokumen resmi.",
        W / 2,
        H - 46,
        { align: "center" },
      );

      doc.save(`Sertifikat-Wakaf-${cert.id.replace(/\//g, "-")}.pdf`);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div
        id="sertifikat"
        className="print-page relative overflow-hidden rounded-2xl border-2 border-brand-600 bg-white p-8 shadow-sm sm:p-12"
      >
        <div className="pointer-events-none absolute inset-3 rounded-xl border border-brand-200" />
        <div className="relative text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">
            Yayasan Khazanah Berkah Mulia
          </p>
          <h2 className="mt-3 font-serif text-2xl font-bold text-brand-950 sm:text-3xl">
            Sertifikat Wakaf
          </h2>
          <p className="mt-1 text-xs text-brand-400">
            Terdaftar di Badan Wakaf Indonesia (BWI)
          </p>

          <div className="mx-auto mt-8 max-w-xl">
            <p className="text-sm text-brand-600">Diberikan kepada</p>
            <p className="mt-2 font-serif text-2xl font-bold text-brand-900">
              {cert.namaPihak}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-brand-700">
              yang telah menunaikan{" "}
              <span className="font-semibold">
                {PROGRAM_TYPE_LABEL[cert.program_type]}
              </span>{" "}
              sebesar{" "}
              <span className="font-semibold">{formatRupiah(cert.nominal)}</span>{" "}
              untuk program{" "}
              <span className="font-semibold">&ldquo;{cert.programNama}&rdquo;</span>.
            </p>
          </div>

          <dl className="mx-auto mt-8 grid max-w-md grid-cols-1 gap-x-8 gap-y-2 text-left text-sm sm:grid-cols-2">
            <div>
              <dt className="text-brand-400">Nomor Sertifikat</dt>
              <dd className="font-semibold text-brand-900">{cert.id}</dd>
            </div>
            <div>
              <dt className="text-brand-400">Tanggal</dt>
              <dd className="font-semibold text-brand-900">
                {formatTanggal(cert.tanggal)}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-brand-400">Nazhir Pengelola</dt>
              <dd className="font-semibold text-brand-900">{cert.nazhir}</dd>
            </div>
          </dl>

          <p className="mt-8 text-[11px] text-brand-400">
            Verifikasi keaslian sertifikat di halaman{" "}
            <span className="font-semibold">Verifikasi Sertifikat</span> dengan
            kode <span className="font-mono">{cert.id}</span>.
            <br />
            Dokumen demo — bukan dokumen resmi.
          </p>
        </div>
      </div>

      <div className="no-print flex flex-wrap gap-3">
        <button
          onClick={unduhPdf}
          disabled={downloading}
          className="btn-primary"
        >
          {downloading ? <Spinner className="h-4 w-4" /> : "⬇️"}
          Unduh Sertifikat (PDF)
        </button>
        <button onClick={() => window.print()} className="btn-outline">
          🖨️ Cetak
        </button>
      </div>
    </div>
  );
}
