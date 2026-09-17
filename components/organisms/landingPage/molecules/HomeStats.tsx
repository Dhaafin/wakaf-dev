"use client";

import { motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { api } from "@/lib/api/client";
import { useAsync } from "@/lib/hooks/use-async";
import { CountUp } from "@/components/atoms/CountUp";
import { formatRupiahCompact } from "@/lib/format";

interface HomeStatsProps {
  className?: string;
}

function MorphBubbleCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative overflow-hidden rounded-[2.25rem] border border-brand-200/90 border-t-4 border-t-emerald-600 bg-white p-8 sm:p-9 shadow-sm transition-all duration-300 hover:border-emerald-700 hover:shadow-xl hover:shadow-emerald-950/20 ${className}`}
    >
      {/* THE MORPHING LIQUID BUBBLE (Framer Motion Spring Physics) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute bg-emerald-900 z-0 shadow-sm"
        initial={false}
        animate={
          isHovered
            ? {
                x: mousePos.x - 425,
                y: mousePos.y - 425,
                width: 850,
                height: 850,
                borderRadius: "50%",
                opacity: 1,
              }
            : {
                x: cardRef.current ? cardRef.current.clientWidth - 72 : 280,
                y: 32,
                width: 40,
                height: 40,
                borderRadius: "50%",
                opacity: 0.9,
              }
        }
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 24,
          mass: 0.7,
        }}
      />

      {/* Card Content Container */}
      <div className="relative z-10 flex h-full flex-col justify-between">
        {children}
      </div>
    </motion.div>
  );
}

export function HomeStats({ className = "" }: HomeStatsProps) {
  const { data, loading } = useAsync(() => api.getStats(), []);

  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
        
        {/* CARD 1: Total Dana Terkumpul (Span 7 pada LG) */}
        <MorphBubbleCard className="lg:col-span-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500 group-hover:text-emerald-200 transition-colors duration-500 pr-14">
              Total Dana Wakaf & Infaq Terhimpun
            </p>
            {loading ? (
              <div className="mt-3 h-12 w-48 rounded-xl bg-brand-100 animate-pulse" />
            ) : (
              <div className="mt-2">
                <p className="font-serif text-3xl font-bold tracking-tight text-brand-950 group-hover:text-white sm:text-4xl lg:text-5xl transition-colors duration-500">
                  <CountUp
                    value={data?.totalTerkumpul ?? 0}
                    format={(n) => formatRupiahCompact(n)}
                  />
                </p>
                {/* Underline Emerald Accent Line */}
                <div className="mt-3.5 h-1.5 w-10 rounded-full bg-emerald-600 group-hover:bg-emerald-300 group-hover:w-28 transition-all duration-500 ease-out" />
              </div>
            )}
          </div>
          <p className="mt-6 text-xs leading-relaxed text-brand-600 group-hover:text-emerald-100 sm:text-sm transition-colors duration-500">
            Terkelola secara produktif & amanah sesuai standar syariat Islam untuk kemaslahatan jangka panjang umat.
          </p>
        </MorphBubbleCard>

        {/* CARD 2: Total Wakif (Span 5 pada LG) */}
        <MorphBubbleCard className="lg:col-span-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500 group-hover:text-emerald-200 transition-colors duration-500 pr-14">
              Jumlah Donatur & Wakif
            </p>
            {loading ? (
              <div className="mt-3 h-10 w-32 rounded-xl bg-brand-100 animate-pulse" />
            ) : (
              <div className="mt-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-3xl font-bold tracking-tight text-brand-950 group-hover:text-white sm:text-4xl transition-colors duration-500">
                    <CountUp
                      value={data?.totalWakif ?? 0}
                      format={(n) => n.toLocaleString("id-ID")}
                    />
                  </span>
                  <span className="text-sm font-bold text-emerald-700 group-hover:text-emerald-200 transition-colors duration-500">+ Orang</span>
                </div>
                {/* Underline Emerald Accent Line */}
                <div className="mt-3.5 h-1.5 w-8 rounded-full bg-emerald-600 group-hover:bg-emerald-300 group-hover:w-20 transition-all duration-500 ease-out" />
              </div>
            )}
          </div>
          <p className="mt-6 text-xs leading-relaxed text-brand-600 group-hover:text-emerald-100 sm:text-sm transition-colors duration-500">
            Partisipasi aktif para wakif & donatur yang tersebar di seluruh pelosok Nusantara.
          </p>
        </MorphBubbleCard>

        {/* CARD 3: Program Aktif (Span 4 pada LG) */}
        <MorphBubbleCard className="lg:col-span-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500 group-hover:text-emerald-200 transition-colors duration-500 pr-14">
              Program Berkelanjutan
            </p>
            {loading ? (
              <div className="mt-3 h-10 w-24 rounded-xl bg-brand-100 animate-pulse" />
            ) : (
              <div className="mt-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-3xl font-bold tracking-tight text-brand-950 group-hover:text-white sm:text-4xl transition-colors duration-500">
                    <CountUp
                      value={data?.totalProgram ?? 0}
                      format={(n) => n.toLocaleString("id-ID")}
                    />
                  </span>
                  <span className="text-sm font-semibold text-brand-600 group-hover:text-emerald-200 transition-colors duration-500">Program Aktif</span>
                </div>
                {/* Underline Emerald Accent Line */}
                <div className="mt-3.5 h-1.5 w-6 rounded-full bg-emerald-600 group-hover:bg-emerald-300 group-hover:w-16 transition-all duration-500 ease-out" />
              </div>
            )}
          </div>
          <p className="mt-6 text-xs text-brand-600 group-hover:text-emerald-100 leading-relaxed transition-colors duration-500">
            Pendidikan, Masjid, Kesehatan, & Pemberdayaan Ekonomi Umat.
          </p>
        </MorphBubbleCard>

        {/* CARD 4: Dana Tersalurkan & Syariah (Span 8 pada LG) */}
        <MorphBubbleCard className="lg:col-span-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500 group-hover:text-emerald-200 transition-colors duration-500 pr-14">
              Total Dana Tersalurkan & Legalitas BWI
            </p>
            {loading ? (
              <div className="mt-3 h-10 w-40 rounded-xl bg-brand-100 animate-pulse" />
            ) : (
              <div className="mt-2">
                <p className="font-serif text-3xl font-bold tracking-tight text-brand-950 group-hover:text-white sm:text-4xl transition-colors duration-500">
                  <CountUp
                    value={data?.totalDisalurkan ?? 0}
                    format={(n) => formatRupiahCompact(n)}
                  />
                </p>
                {/* Underline Emerald Accent Line */}
                <div className="mt-3.5 h-1.5 w-12 rounded-full bg-emerald-600 group-hover:bg-emerald-300 group-hover:w-28 transition-all duration-500 ease-out" />
              </div>
            )}
          </div>
          <p className="mt-6 text-xs text-brand-600 group-hover:text-emerald-100 leading-relaxed sm:text-sm transition-colors duration-500">
            100% tersalurkan tepat sasaran, terdaftar resmi di Badan Wakaf Indonesia (BWI), & diaudit secara tembus pandang.
          </p>
        </MorphBubbleCard>

      </div>
    </div>
  );
}
