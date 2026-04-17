/**
 * Freaky Cars - Main Scene (White Background, No Audio)
 * Generated: 2026-04-17 | Antigravity IDE
 *
 * White background + bright daytime lighting.
 * Uses PCFShadowMap (not deprecated).
 */
"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Sky, PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import CarExperience from "./CarExperience";

export default function Scene() {
  return (
    <Canvas
      shadows="percentage"
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
      }}
      style={{ width: "100%", height: "100%" }}
    >
      <PerspectiveCamera makeDefault position={[0, 3.5, 14]} fov={50} near={0.1} far={400} />

      {/* White / bright sky */}
      <color attach="background" args={["#f0eeea"]} />
      <fog attach="fog" args={["#e8e4dc", 80, 220]} />

      {/* Daytime sky dome */}
      <Sky
        distance={450000}
        sunPosition={[100, 20, 100]}
        inclination={0}
        azimuth={0.25}
        turbidity={6}
        rayleigh={0.5}
      />

      {/* Bright daytime sun */}
      <directionalLight
        position={[10, 20, 10]}
        intensity={4.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={150}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-bias={-0.001}
      />
      {/* Soft fill from opposite side */}
      <directionalLight position={[-8, 8, -10]} intensity={1.8} color="#e8f0ff" />
      {/* Ground bounce */}
      <hemisphereLight args={["#ffffff", "#c4a97a", 0.9]} />
      <ambientLight intensity={0.6} />

      <Environment preset="sunset" background={false} />

      <CarExperience />

      <EffectComposer>
        <Bloom intensity={0.4} luminanceThreshold={0.85} luminanceSmoothing={0.6} mipmapBlur />
        <Vignette eskil={false} offset={0.2} darkness={0.35} blendFunction={BlendFunction.NORMAL} />
      </EffectComposer>
    </Canvas>
  );
}
