/**
 * Freaky Cars - Real Car Model (Ferrari 458 / Supercar)
 * Generated: 2026-04-17 | Antigravity IDE
 *
 * Loads the real Three.js Ferrari GLB (the same shown on the Three.js homepage).
 * Applies a Lamborghini-style orange paint via material override.
 * Scroll-driven: drives in from -Z, drifts sideways with wheel spin.
 *
 * Coordinate system:
 *   Camera at [0, 2.8, 10] facing -Z.
 *   Car starts at Z=-60 (far in front), arrives at Z=0.
 */
"use client";

import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import { useScroll } from "@react-three/drei";
import * as THREE from "three";

// Pre-load so there's no stall
useGLTF.preload("/models/car.glb");

// Body paint material — Lamborghini Arancio Borealis orange
const PAINT = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color("#e08000"),
  metalness: 0.2,
  roughness: 0.1,
  clearcoat: 1.0,
  clearcoatRoughness: 0.03,
  envMapIntensity: 2.5,
  reflectivity: 1.0,
});

const GLASS = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color("#88aacc"),
  metalness: 0.0,
  roughness: 0.05,
  transmission: 0.9,
  opacity: 0.25,
  transparent: true,
});

const DETAIL = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#111111"),
  metalness: 0.8,
  roughness: 0.3,
});

export default function LamborghiniModel() {
  const root = useRef<THREE.Group>(null!);

  // Refs to the four wheel meshes inside the GLB
  const wheels = useRef<THREE.Object3D[]>([]);

  const scroll = useScroll();
  const { scene } = useGLTF("/models/car.glb");
  const aoMap = useTexture("/models/ferrari_ao.png");

  // One-time setup: override materials, collect wheels, apply AO
  useEffect(() => {
    if (!scene) return;

    const wheelNames = ["wheel_fl", "wheel_fr", "wheel_rl", "wheel_rr"];
    wheels.current = [];

    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      const name = child.name.toLowerCase();

      // Apply AO map to all meshes
      child.castShadow = true;
      child.receiveShadow = true;

      if (child.material) {
        const m = child.material as THREE.MeshStandardMaterial;

        // Body / main paint panels
        if (
          name.includes("body") ||
          name.includes("panel") ||
          name.includes("hood") ||
          name.includes("door") ||
          name.includes("fender") ||
          name.includes("trunk") ||
          name.includes("chassis") ||
          name.includes("bumper")
        ) {
          child.material = PAINT;
        }

        // Glass / windshield
        if (
          name.includes("glass") ||
          name.includes("window") ||
          name.includes("windshield") ||
          name.includes("wind")
        ) {
          child.material = GLASS;
        }

        // Dark trim / interior / tires
        if (
          name.includes("interior") ||
          name.includes("tire") ||
          name.includes("seat") ||
          name.includes("steer")
        ) {
          child.material = DETAIL;
        }

        // Apply the AO map
        if (m.aoMap !== undefined) {
          m.aoMap = aoMap;
          m.aoMapIntensity = 1;
        }
      }

      // Collect wheel nodes
      wheelNames.forEach((wName) => {
        if (name.includes(wName) || name === wName) {
          wheels.current.push(child);
        }
      });
    });
  }, [scene, aoMap]);

  useFrame((state, delta) => {
    if (!root.current) return;
    const t = scroll.offset;

    // ── Phase 1: Drive-in (t 0 → 0.38) ────────────────────────────────
    const driveP = Math.min(t / 0.38, 1.0);
    const driveE = 1 - Math.pow(1 - driveP, 3); // ease-out cubic
    root.current.position.z = THREE.MathUtils.lerp(-60, 0, driveE);
    root.current.position.y = THREE.MathUtils.lerp(-0.5, 0, driveE);

    // ── Phase 2: Drift (t 0.38 → 0.78) ────────────────────────────────
    const driftP = THREE.MathUtils.clamp((t - 0.38) / 0.40, 0, 1);
    const driftE = 1 - Math.pow(1 - driftP, 2);

    root.current.rotation.y  = driftE * (Math.PI * 0.58);   // ~105° yaw
    root.current.position.x  = driftE * -4;
    root.current.rotation.z  = driftE * 0.12;               // body roll
    root.current.position.y -= Math.sin(driftP * Math.PI) * 0.15; // suspension dip

    // ── Wheel spin ──────────────────────────────────────────────────────
    const spinRate = driveP > 0.03 ? (driftP > 0.1 ? 50 : 25) : 0;
    wheels.current.forEach((w) => {
      w.rotation.x += spinRate * delta;
    });

    // ── Road vibration while approaching ───────────────────────────────
    if (driveP < 1) {
      state.camera.position.y =
        2.8 + Math.sin(state.clock.elapsedTime * 15) * 0.007 * driveE;
    }
  });

  return (
    <group ref={root} position={[0, 0, -60]} scale={3.5}>
      <primitive object={scene} />

      {/* Headlight glow */}
      <pointLight color="#ffffff" intensity={40} distance={8} position={[0, 0.4, 2.2]} />

      {/* Tail-light glow */}
      <pointLight color="#ff1100" intensity={20} distance={5} position={[0, 0.4, -2.2]} />

      {/* Engine heat undercar */}
      <pointLight color="#ff7700" intensity={12} distance={3} position={[0, -0.1, -0.8]} />
    </group>
  );
}
