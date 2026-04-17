/**
 * Freaky Cars - Audio Engine Hook
 * Generated: 2026-04-17 | Antigravity IDE
 *
 * Creates procedural engine revving and tire screeching sounds
 * using the Web Audio API — no audio file assets required.
 */

import { useEffect, useRef, useCallback } from "react";

interface AudioNodes {
  ctx: AudioContext;
  engineOsc: OscillatorNode;
  engineGain: GainNode;
  noiseBuffer: AudioBuffer;
  noiseSource: AudioBufferSourceNode | null;
  noiseGain: GainNode;
  screechGain: GainNode;
  screechFilter: BiquadFilterNode;
  masterGain: GainNode;
  isRunning: boolean;
}

export function useAudioEngine() {
  const nodesRef = useRef<AudioNodes | null>(null);

  const init = useCallback(async () => {
    if (nodesRef.current?.isRunning) return;

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

    // ─── Master volume ────────────────────────────────────────────────
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0, ctx.currentTime);
    masterGain.connect(ctx.destination);

    // ─── Engine: sawtooth oscillator through a lowpass filter ────────
    const engineOsc = ctx.createOscillator();
    engineOsc.type = "sawtooth";
    engineOsc.frequency.setValueAtTime(60, ctx.currentTime); // idle

    const engineFilter = ctx.createBiquadFilter();
    engineFilter.type = "lowpass";
    engineFilter.frequency.setValueAtTime(600, ctx.currentTime);
    engineFilter.Q.setValueAtTime(2, ctx.currentTime);

    const engineGain = ctx.createGain();
    engineGain.gain.setValueAtTime(0.6, ctx.currentTime);

    engineOsc.connect(engineFilter);
    engineFilter.connect(engineGain);
    engineGain.connect(masterGain);
    engineOsc.start();

    // ─── Tire screech: white noise + sharp bandpass ───────────────────
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const screechFilter = ctx.createBiquadFilter();
    screechFilter.type = "bandpass";
    screechFilter.frequency.setValueAtTime(3200, ctx.currentTime);
    screechFilter.Q.setValueAtTime(8, ctx.currentTime);

    const screechGain = ctx.createGain();
    screechGain.gain.setValueAtTime(0, ctx.currentTime);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(1.5, ctx.currentTime);
    noiseGain.connect(screechFilter);
    screechFilter.connect(screechGain);
    screechGain.connect(masterGain);

    nodesRef.current = {
      ctx,
      engineOsc,
      engineGain,
      noiseBuffer,
      noiseSource: null,
      noiseGain,
      screechGain,
      screechFilter,
      masterGain,
      isRunning: false,
    };
  }, []);

  /**
   * Start audio (must be called from a user interaction due to browser policy)
   */
  const start = useCallback(() => {
    const n = nodesRef.current;
    if (!n || n.isRunning) return;
    n.isRunning = true;
    n.masterGain.gain.setValueAtTime(0, n.ctx.currentTime);
    n.masterGain.gain.linearRampToValueAtTime(1.0, n.ctx.currentTime + 0.3);
  }, []);

  /**
   * Update audio parameters based on scroll offset (0 → 1).
   * @param offset scroll ratio
   * @param isDrifting whether the car is currently drifting
   */
  const update = useCallback((offset: number, isDrifting: boolean) => {
    const n = nodesRef.current;
    if (!n || !n.isRunning) return;
    const { ctx, engineOsc, screechGain, screechFilter } = n;
    const now = ctx.currentTime;

    // Engine pitch: 60 Hz idle → 180 Hz full throttle
    const targetFreq = 60 + offset * 300;
    engineOsc.frequency.linearRampToValueAtTime(targetFreq, now + 0.1);

    // Screech starts and fades with drift
    if (isDrifting) {
      if (!n.noiseSource) {
        const src = ctx.createBufferSource();
        src.buffer = n.noiseBuffer;
        src.loop = true;
        src.connect(n.noiseGain);
        src.start();
        n.noiseSource = src;
      }
      screechGain.gain.linearRampToValueAtTime(0.9, now + 0.2);
      // Vary screech pitch slightly with speed
      screechFilter.frequency.linearRampToValueAtTime(2800 + offset * 1200, now + 0.1);
    } else {
      screechGain.gain.linearRampToValueAtTime(0.0, now + 0.5);
      if (n.noiseSource) {
        try { n.noiseSource.stop(now + 0.5); } catch (_) { /* already stopped */ }
        n.noiseSource = null;
      }
    }
  }, []);

  const stop = useCallback(() => {
    const n = nodesRef.current;
    if (!n) return;
    n.masterGain.gain.linearRampToValueAtTime(0, n.ctx.currentTime + 0.5);
    n.isRunning = false;
  }, []);

  useEffect(() => {
    init();
    return () => {
      nodesRef.current?.ctx.close();
      nodesRef.current = null;
    };
  }, [init]);

  return { start, stop, update };
}
