/**
 * Freaky Cars - CarExperience
 * Generated: 2026-04-17 | Antigravity IDE
 *
 * CRITICAL FIX: Camera is at Z=10, looking toward -Z.
 * Objects in front of camera must have Z < 10.
 * Car drives FROM Z=-60 (far in front) TO Z=0 (parked center).
 * No <Scroll> wrapper on 3D objects — only for HTML overlays.
 */
"use client";

import React, { useRef, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { ScrollControls, useScroll, ContactShadows, Grid } from "@react-three/drei";
import * as THREE from "three";
import LamborghiniModel from "./LamborghiniModel";
import SandParticles from "./SandParticles";

// ─── Audio Engine (self-contained, no context issues) ────────────────────────

let globalAudioCtx: AudioContext | null = null;
let engineOsc: OscillatorNode | null = null;
let engineGain: GainNode | null = null;
let noiseSource: AudioBufferSourceNode | null = null;
let screechGain: GainNode | null = null;
let masterGain: GainNode | null = null;
let audioStarted = false;

function startAudio() {
  if (audioStarted) return;
  audioStarted = true;

  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  globalAudioCtx = ctx;

  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0, ctx.currentTime);
  master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 0.5);
  master.connect(ctx.destination);
  masterGain = master;

  // Engine oscillator — sawtooth through lowpass
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(55, ctx.currentTime);
  const lpf = ctx.createBiquadFilter();
  lpf.type = "lowpass";
  lpf.frequency.setValueAtTime(500, ctx.currentTime);
  const eGain = ctx.createGain();
  eGain.gain.setValueAtTime(0.55, ctx.currentTime);
  osc.connect(lpf);
  lpf.connect(eGain);
  eGain.connect(master);
  osc.start();
  engineOsc = osc;
  engineGain = eGain;

  // Tire screech — white noise through bandpass
  const bufSize = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1;

  const bpf = ctx.createBiquadFilter();
  bpf.type = "bandpass";
  bpf.frequency.setValueAtTime(3000, ctx.currentTime);
  bpf.Q.setValueAtTime(6, ctx.currentTime);

  const sGain = ctx.createGain();
  sGain.gain.setValueAtTime(0, ctx.currentTime);
  sGain.connect(master);
  screechGain = sGain;

  const ns = ctx.createBufferSource();
  ns.buffer = buf;
  ns.loop = true;
  ns.connect(bpf);
  bpf.connect(sGain);
  ns.start();
  noiseSource = ns;
}

function updateAudio(offset: number, isDrifting: boolean) {
  if (!globalAudioCtx || !engineOsc) return;
  const now = globalAudioCtx.currentTime;
  engineOsc.frequency.linearRampToValueAtTime(55 + offset * 250, now + 0.1);
  if (screechGain) {
    screechGain.gain.linearRampToValueAtTime(isDrifting ? 0.85 : 0.0, now + 0.3);
  }
}

// ─── Inner scroll-aware scene (must be child of <ScrollControls>) ─────────────

function DriftScene() {
  const scroll = useScroll();

  useFrame(() => {
    const off = scroll.offset;
    const isDrifting = off > 0.42 && off < 0.82;
    updateAudio(off, isDrifting);
  });

  return (
    <>
      <LamborghiniModel />
      <SandParticles />
    </>
  );
}

// ─── Main exported component ─────────────────────────────────────────────────

export default function CarExperience() {
  const handleClick = useCallback(() => {
    startAudio();
  }, []);

  return (
    <group onClick={handleClick} onPointerDown={handleClick}>
      {/* ScrollControls - children can use useScroll() */}
      <ScrollControls pages={5} damping={0.15}>
        <DriftScene />
      </ScrollControls>

      {/* Ground — rendered outside scroll so it stays fixed */}
      <Grid
        infiniteGrid
        fadeDistance={80}
        fadeStrength={4}
        cellColor="#1a1a1a"
        sectionColor="#333"
        cellThickness={0.5}
        sectionThickness={1}
        position={[0, 0, 0]}
      />

      <ContactShadows
        position={[0, 0.01, 0]}
        scale={30}
        blur={3}
        far={6}
        opacity={0.8}
        frames={Infinity}
      />
    </group>
  );
}
