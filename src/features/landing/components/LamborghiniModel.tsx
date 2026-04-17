/**
 * Freaky Cars - Lamborghini Model (White Theme, No Audio)
 * Generated: 2026-04-17 | Antigravity IDE
 *
 * Loads Ferrari GLB as supercar base. Applies Lamborghini orange paint.
 * Scroll-driven: drives in along road from Z=-60 to Z=0, then drifts.
 *
 * Camera: [0, 3.5, 14] facing -Z.
 * Car starts at Z=-60, arrives at Z=0. Road runs along Z axis.
 */
"use client";

import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture, useScroll } from "@react-three/drei";
import * as THREE from "three";

useGLTF.preload("/models/car.glb");

const PAINT = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color("#e08000"),
  metalness: 0.15,
  roughness: 0.08,
  clearcoat: 1.0,
  clearcoatRoughness: 0.02,
  envMapIntensity: 3.0,
});

const GLASS = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color("#aac8ee"),
  metalness: 0.0,
  roughness: 0.04,
  transmission: 0.92,
  opacity: 0.2,
  transparent: true,
});

const DARK = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#181818"),
  metalness: 0.7,
  roughness: 0.3,
});

export default function LamborghiniModel() {
  const root = useRef<THREE.Group>(null!);
  const wheels = useRef<THREE.Object3D[]>([]);
  const scroll = useScroll();
  const { scene } = useGLTF("/models/car.glb");
  const aoMap = useTexture("/models/ferrari_ao.png");

  useEffect(() => {
    if (!scene) return;
    wheels.current = [];
    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const n = child.name.toLowerCase();
      child.castShadow = true;
      child.receiveShadow = true;

      if (n.includes("body") || n.includes("hood") || n.includes("door") ||
          n.includes("fender") || n.includes("trunk") || n.includes("bumper") ||
          n.includes("chassis") || n.includes("panel")) {
        child.material = PAINT;
      } else if (n.includes("glass") || n.includes("wind") || n.includes("window")) {
        child.material = GLASS;
      } else if (n.includes("interior") || n.includes("seat") || n.includes("tire") ||
                 n.includes("steer")) {
        child.material = DARK;
      }

      const m = child.material as THREE.MeshStandardMaterial;
      if (m && "aoMap" in m) {
        m.aoMap = aoMap;
        m.aoMapIntensity = 0.8;
      }

      if (n.includes("wheel_fl") || n.includes("wheel_fr") ||
          n.includes("wheel_rl") || n.includes("wheel_rr")) {
        wheels.current.push(child);
      }
    });
  }, [scene, aoMap]);

  useFrame((state, delta) => {
    if (!root.current) return;
    const t = scroll.offset;

    // Phase 1 — Drive in along the road (t: 0 → 0.38)
    const driveP = Math.min(t / 0.38, 1.0);
    const driveE = 1 - Math.pow(1 - driveP, 3);
    root.current.position.z = THREE.MathUtils.lerp(-60, 0, driveE);
    root.current.position.y = 0;
    root.current.position.x = 0;
    root.current.rotation.set(0, 0, 0);

    // Phase 2 — Drift (t: 0.38 → 0.78)
    const driftP = THREE.MathUtils.clamp((t - 0.38) / 0.40, 0, 1);
    const driftE = 1 - Math.pow(1 - driftP, 2);

    root.current.rotation.y = driftE * (Math.PI * 0.58);
    root.current.position.x = driftE * -4;
    root.current.rotation.z = driftE * 0.1;
    root.current.position.y = -Math.sin(driftP * Math.PI) * 0.12;

    // Wheel spin
    const spin = driveP > 0.03 ? (driftP > 0.1 ? 50 : 25) : 0;
    wheels.current.forEach((w) => { w.rotation.x += spin * delta; });

    // Camera shake on approach
    if (driveP < 1) {
      state.camera.position.y = 3.5 + Math.sin(state.clock.elapsedTime * 14) * 0.006 * driveE;
    }
  });

  return (
    <group ref={root} position={[0, 0, -60]} scale={3.5} rotation={[0, Math.PI, 0]}>
      <primitive object={scene} />
      <pointLight color="#ffe8aa" intensity={20} distance={8} position={[0, 0.5, 2]} />
      <pointLight color="#ff2200" intensity={10} distance={5} position={[0, 0.4, -2]} />
    </group>
  );
}
