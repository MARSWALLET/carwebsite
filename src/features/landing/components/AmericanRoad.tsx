/**
 * Freaky Cars - American Road Environment
 * Generated: 2026-04-17 | Antigravity IDE
 *
 * Procedural road: long straight highway with asphalt texture,
 * white/yellow markings, sandy desert shoulders — Route 66 vibes.
 */
"use client";

import React, { useMemo } from "react";
import * as THREE from "three";

// ─── Build road texture via Canvas API ────────────────────────────────────────

function makeRoadTexture(): THREE.CanvasTexture {
  const W = 512;
  const H = 4096;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Asphalt base
  ctx.fillStyle = "#252525";
  ctx.fillRect(0, 0, W, H);

  // Subtle noise for asphalt grain
  for (let i = 0; i < 40000; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    const b = Math.floor(Math.random() * 30 + 20);
    ctx.fillStyle = `rgba(${b},${b},${b},0.4)`;
    ctx.fillRect(x, y, 1, 1);
  }

  // White solid edge lines (left & right)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(18, 0, 10, H);
  ctx.fillRect(W - 28, 0, 10, H);

  // Yellow dashed center line
  ctx.fillStyle = "#f5c518";
  const dashH = 140;
  const gapH = 60;
  for (let y = 0; y < H; y += dashH + gapH) {
    ctx.fillRect(W / 2 - 6, y, 12, dashH);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 8); // tile along length
  return tex;
}

function makeGroundTexture(): THREE.CanvasTexture {
  const W = 512;
  const H = 512;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#c4a97a";
  ctx.fillRect(0, 0, W, H);

  // Sand variation
  for (let i = 0; i < 20000; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    const b = Math.floor(Math.random() * 40 - 20);
    const r = 196 + b;
    const g = 169 + b;
    const bl = 122 + b;
    ctx.fillStyle = `rgba(${r},${g},${bl},0.3)`;
    ctx.fillRect(x, y, 2, 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(20, 80);
  return tex;
}

// ─── Road Component ───────────────────────────────────────────────────────────

export default function AmericanRoad() {
  const roadTex = useMemo(() => makeRoadTexture(), []);
  const groundTex = useMemo(() => makeGroundTexture(), []);

  return (
    <group>
      {/* === ASPHALT ROAD === */}
      {/* Road extends from Z=-150 to Z=+20 (Z+ = behind camera, Z- = in front) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, -65]}
        receiveShadow
      >
        {/* width=10, length=200, Z centered at -65 → spans -165 to +35 */}
        <planeGeometry args={[10, 200, 1, 1]} />
        <meshStandardMaterial
          map={roadTex}
          roughness={0.8}
          metalness={0.0}
          color="#dddddd"   // slight brightening for white-theme scene
        />
      </mesh>

      {/* === ROAD CURBS (low concrete edges) === */}
      {[-5.3, 5.3].map((x, i) => (
        <mesh key={i} position={[x, 0.06, -65]} receiveShadow castShadow>
          <boxGeometry args={[0.25, 0.12, 200]} />
          <meshStandardMaterial color="#cccccc" roughness={0.9} />
        </mesh>
      ))}

      {/* === DESERT GROUND (left & right shoulder) === */}
      {[-50, 50].map((x, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[x, -0.005, -65]}
          receiveShadow
        >
          <planeGeometry args={[80, 200, 1, 1]} />
          <meshStandardMaterial
            map={groundTex}
            roughness={0.95}
            color="#e8d5a8"
          />
        </mesh>
      ))}

      {/* === HORIZON GROUND (far background) === */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -250]} receiveShadow>
        <planeGeometry args={[400, 200, 1, 1]} />
        <meshStandardMaterial color="#e8d5a8" roughness={1} />
      </mesh>

      {/* === ROAD LIGHT POLES (American highway style) === */}
      {[-80, -50, -20, 10].map((z, i) => (
        <group key={i} position={[6.5, 0, z]}>
          {/* Pole */}
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.08, 5, 8]} />
            <meshStandardMaterial color="#aaa" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Arm */}
          <mesh position={[-0.8, 2.35, 0]} rotation={[0, 0, Math.PI * 0.05]}>
            <cylinderGeometry args={[0.05, 0.05, 1.8, 8]} />
            <meshStandardMaterial color="#aaa" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Lamp head */}
          <mesh position={[-1.5, 2.5, 0]}>
            <boxGeometry args={[0.5, 0.15, 0.3]} />
            <meshStandardMaterial color="#ddd" roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Mirror poles on left */}
      {[-80, -50, -20, 10].map((z, i) => (
        <group key={i} position={[-6.5, 0, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.08, 5, 8]} />
            <meshStandardMaterial color="#aaa" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0.8, 2.35, 0]} rotation={[0, 0, -Math.PI * 0.05]}>
            <cylinderGeometry args={[0.05, 0.05, 1.8, 8]} />
            <meshStandardMaterial color="#aaa" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[1.5, 2.5, 0]}>
            <boxGeometry args={[0.5, 0.15, 0.3]} />
            <meshStandardMaterial color="#ddd" roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
