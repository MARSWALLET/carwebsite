/**
 * Freaky Cars - Landing Page (White Theme, No Audio)
 * Generated: 2026-04-17 | Antigravity IDE
 */
"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const Scene = dynamic(() => import("@/features/landing/components/Scene"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden" style={{ background: "#f5f3ef" }}>

      {/* ─── NAVIGATION ─────────────────────────────────────────────── */}
      <header className="absolute top-0 left-0 w-full z-20 flex justify-between items-center px-10 py-7 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3">
          <svg width="30" height="30" viewBox="0 0 34 34" fill="none">
            <polygon points="17,2 32,32 2,32" fill="#e6940a" />
            <polygon points="17,10 26,28 8,28" fill="#fff" opacity="0.4" />
          </svg>
          <span className="text-gray-900 text-2xl font-black uppercase tracking-tighter">
            Freaky<span className="text-amber-500">Cars</span>
          </span>
        </div>
        <nav className="pointer-events-auto hidden md:flex gap-10 text-gray-700 text-xs font-bold tracking-[0.25em] uppercase">
          {["Models", "Experience", "Reserve"].map((item) => (
            <a key={item} href="#" className="hover:text-amber-500 transition-colors duration-200">
              {item}
            </a>
          ))}
        </nav>
      </header>

      {/* ─── HERO COPY (left side) ──────────────────────────────────── */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 z-10 pointer-events-none max-w-xs">
        <p className="text-amber-500 uppercase tracking-[0.35em] text-xs font-bold mb-3">
          The Beast Arrives
        </p>
        <h2 className="text-gray-900 text-7xl font-black uppercase leading-[0.88] mb-5">
          Huracán<br />
          <span className="text-amber-500">STO</span>
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          640 CV of pure Italian fury.<br />
          Scroll to feel the drift.
        </p>
        <div className="mt-8 flex gap-3 pointer-events-auto">
          <button className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-widest py-3 px-6 transition-colors">
            Reserve Now
          </button>
          <button className="border border-gray-300 hover:border-amber-500 text-gray-700 hover:text-amber-500 text-xs font-bold uppercase tracking-widest py-3 px-6 transition-colors">
            Explore
          </button>
        </div>
      </div>

      {/* ─── SPEC STRIP ─────────────────────────────────────────────── */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex gap-14 pointer-events-none">
        {[
          { label: "0–60 mph", value: "2.9s" },
          { label: "Top Speed", value: "325 km/h" },
          { label: "Horsepower", value: "640 CV" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-amber-500 text-2xl font-black">{s.value}</div>
            <div className="text-gray-400 text-[10px] uppercase tracking-widest mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ─── SCROLL CTA ─────────────────────────────────────────────── */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex flex-col items-center gap-2">
        <span className="text-gray-400 uppercase tracking-[0.3em] text-[10px]">Scroll to Drive</span>
        <div className="w-px h-7 bg-gradient-to-b from-amber-500/60 to-transparent animate-pulse" />
      </div>

      {/* ─── 3D CANVAS ──────────────────────────────────────────────── */}
      <Suspense
        fallback={
          <div className="w-full h-full flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <span className="uppercase tracking-widest text-xs text-gray-400">Loading…</span>
          </div>
        }
      >
        <Scene />
      </Suspense>
    </main>
  );
}
