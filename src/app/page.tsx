/**
 * Freaky Cars - Landing Page
 * Generated: 2026-04-17 | Antigravity IDE
 *
 * Hydration-safe: splash screen only renders after mount (useEffect).
 * Audio starts on first user click (browser AudioContext policy).
 */
"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";

const Scene = dynamic(() => import("@/features/landing/components/Scene"), {
  ssr: false,
});

export default function Home() {
  // Mount flag prevents SSR/client mismatch on the splash overlay
  const [mounted, setMounted] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <main
      className="relative w-full h-screen bg-black overflow-hidden"
      onClick={() => setStarted(true)}
    >
      {/* ─── NAVIGATION ─────────────────────────────────────────────── */}
      <header className="absolute top-0 left-0 w-full z-20 flex justify-between items-center px-10 py-7 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3">
          <svg width="32" height="32" viewBox="0 0 34 34" fill="none">
            <polygon points="17,2 32,32 2,32" fill="#e6940a" />
            <polygon points="17,10 26,28 8,28" fill="#000" opacity="0.5" />
          </svg>
          <span className="text-white text-2xl font-black uppercase tracking-tighter">
            Freaky<span className="text-amber-500">Cars</span>
          </span>
        </div>
        <nav className="pointer-events-auto hidden md:flex gap-10 text-white text-xs font-bold tracking-[0.25em] uppercase">
          {["Models", "Experience", "Reserve"].map((item) => (
            <a
              key={item}
              href="#"
              className="hover:text-amber-400 transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </nav>
      </header>

      {/* ─── HERO COPY ──────────────────────────────────────────────── */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 z-10 pointer-events-none max-w-xs">
        <p className="text-amber-500 uppercase tracking-[0.35em] text-xs font-bold mb-3">
          The Beast Arrives
        </p>
        <h2 className="text-white text-7xl font-black uppercase leading-[0.88] mb-5">
          Huracán<br />
          <span className="text-amber-500">STO</span>
        </h2>
        <p className="text-white/50 text-sm leading-relaxed">
          640 CV of pure Italian fury.
          <br />Scroll to feel the drift.
        </p>
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
            <div className="text-white/40 text-[10px] uppercase tracking-widest mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ─── SCROLL CTA ─────────────────────────────────────────────── */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex flex-col items-center gap-2">
        <span className="text-white/40 uppercase tracking-[0.3em] text-[10px]">Scroll to Drive</span>
        <div className="w-px h-7 bg-gradient-to-b from-amber-500/70 to-transparent animate-pulse" />
      </div>

      {/* ─── SPLASH (client-only to avoid hydration mismatch) ────────── */}
      {mounted && !started && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/85 backdrop-blur-sm cursor-pointer select-none">
          <div className="text-center pointer-events-none">
            <div className="text-amber-500 text-7xl mb-5 animate-pulse">▶</div>
            <h3 className="text-white text-3xl font-black uppercase tracking-widest mb-2">
              Start Engine
            </h3>
            <p className="text-white/40 text-sm uppercase tracking-widest">
              Click anywhere · Sound on
            </p>
          </div>
        </div>
      )}

      {/* ─── 3D CANVAS ──────────────────────────────────────────────── */}
      <Suspense
        fallback={
          <div className="w-full h-full flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <span className="uppercase tracking-widest text-xs text-white/40">Loading Engine…</span>
          </div>
        }
      >
        <Scene />
      </Suspense>
    </main>
  );
}
