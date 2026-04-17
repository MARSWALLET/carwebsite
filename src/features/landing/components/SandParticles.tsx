/**
 * Freaky Cars - Sand Particle System
 * Generated: 2026-04-17 | Antigravity IDE
 *
 * Coordinate fix: car parks at Z~0 (world), rear axle at ~Z=-1.52*2.5 = -3.8.
 * Drift slides car to X=-4. Particles spawn from rear tyre world positions.
 * Per-particle fade-out via custom GLSL.
 */
"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScroll } from "@react-three/drei";

const COUNT = 2400;

const vert = /* glsl */ `
  attribute float alpha;
  attribute float sz;
  varying float vA;
  void main() {
    vA = alpha;
    vec4 mv = modelViewMatrix * vec4(position,1.0);
    gl_PointSize = sz * (280.0 / -mv.z);
    gl_Position  = projectionMatrix * mv;
  }
`;

const frag = /* glsl */ `
  varying float vA;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if (d > 0.5) discard;
    vec3 sand = vec3(0.74, 0.68, 0.48);
    gl_FragColor = vec4(sand, vA * (1.0 - d * 1.8));
  }
`;

export default function SandParticles() {
  const ref = useRef<THREE.Points>(null!);
  const scroll = useScroll();

  const { pos, vel, alpha, sz, life, maxLife, geo, mat } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const vel = new Float32Array(COUNT * 3);
    const alpha = new Float32Array(COUNT);
    const sz = new Float32Array(COUNT);
    const life = new Float32Array(COUNT);
    const maxLife = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      pos[i * 3 + 1] = -500; // hide below ground
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("alpha", new THREE.BufferAttribute(alpha, 1));
    geo.setAttribute("sz", new THREE.BufferAttribute(sz, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    return { pos, vel, alpha, sz, life, maxLife, geo, mat };
  }, []);

  useFrame((_, dt) => {
    const offset = scroll.offset;
    const isDrifting = offset > 0.42 && offset < 0.82;

    // Mirror car world position (car scale 2.5, rear axle at model z=-1.52)
    const driveP = Math.min(offset / 0.38, 1.0);
    const driveE = 1 - Math.pow(1 - driveP, 3);
    const carZ = THREE.MathUtils.lerp(-60, 0, driveE);
    const driftP = THREE.MathUtils.clamp((offset - 0.38) / 0.40, 0, 1);
    const driftE = 1 - Math.pow(1 - driftP, 2);
    const carX = driftE * -4;

    // Rear axle in world space (model z=-1.52 * scale 2.5 = z offset ~-3.8)
    const rearZ = carZ - 3.8;

    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const alphaAttr = geo.attributes.alpha as THREE.BufferAttribute;
    const szAttr = geo.attributes.sz as THREE.BufferAttribute;

    for (let i = 0; i < COUNT; i++) {
      if (life[i] <= 0) {
        if (isDrifting && Math.random() < 0.45) {
          const tire = Math.random() < 0.5 ? -1 : 1;
          pos[i * 3]     = carX + tire * 2.6 + (Math.random() - 0.5) * 1.2;
          pos[i * 3 + 1] = 0.15 + Math.random() * 0.25;
          pos[i * 3 + 2] = rearZ + (Math.random() - 0.5) * 0.8;

          vel[i * 3]     = (Math.random() - 0.45) * 14;
          vel[i * 3 + 1] = Math.random() * 9 + 3;
          vel[i * 3 + 2] = -(Math.random() * 14 + 5);

          const l = 0.7 + Math.random() * 1.5;
          life[i] = l;
          maxLife[i] = l;
          alpha[i] = 0.9;
          sz[i] = 1.5 + Math.random() * 3.0;
        } else {
          pos[i * 3 + 1] = -500;
          alpha[i] = 0;
        }
      } else {
        life[i] -= dt;
        vel[i * 3]     *= 0.96;
        vel[i * 3 + 1] -= 14 * dt;
        vel[i * 3 + 2] *= 0.96;

        pos[i * 3]     += vel[i * 3] * dt;
        pos[i * 3 + 1]  = Math.max(0, pos[i * 3 + 1] + vel[i * 3 + 1] * dt);
        pos[i * 3 + 2] += vel[i * 3 + 2] * dt;

        // Fade: stay bright for 60% of life, then fade to 0
        const r = life[i] / maxLife[i];
        alpha[i] = r < 0.4 ? (r / 0.4) * 0.9 : 0.9;

        if (life[i] <= 0) {
          pos[i * 3 + 1] = -500;
          alpha[i] = 0;
          life[i] = 0;
        }
      }

      posAttr.setXYZ(i, pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
      alphaAttr.setX(i, alpha[i]);
      szAttr.setX(i, sz[i]);
    }

    posAttr.needsUpdate = true;
    alphaAttr.needsUpdate = true;
    szAttr.needsUpdate = true;
  });

  return <points ref={ref} geometry={geo} material={mat} frustumCulled={false} />;
}
