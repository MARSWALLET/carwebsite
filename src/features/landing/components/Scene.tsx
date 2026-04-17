/**
 * Freaky Cars - Canvas Scene
 * Generated: 2026-04-17 | Antigravity IDE
 */
"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import CarExperience from "./CarExperience";

export default function Scene() {
  return (
    <Canvas
      shadows="percentage"           // THREE.PCFShadowMap — not deprecated
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.4,
      }}
      style={{ width: "100%", height: "100%" }}
    >
      {/* Camera: Z=14, looking toward -Z. Car arrives at Z=0 so it faces us. */}
      <PerspectiveCamera makeDefault position={[0, 3.5, 14]} fov={50} near={0.1} far={400} />

      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#050505", 50, 150]} />

      {/* Lighting */}
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[6, 14, 10]}
        intensity={5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={120}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.001}
      />
      {/* Orange rim light from behind */}
      <directionalLight position={[-8, 5, -14]} intensity={3.5} color="#ff6600" />
      {/* Cool blue fill */}
      <directionalLight position={[12, 3, -6]} intensity={1.2} color="#2244ff" />
      {/* Ground bounce */}
      <hemisphereLight args={["#111", "#441400", 0.7]} />

      <Environment preset="night" background={false} />

      <CarExperience />

      <EffectComposer>
        <Bloom intensity={2.2} luminanceThreshold={0.45} luminanceSmoothing={0.75} mipmapBlur />
        <ChromaticAberration
          offset={[0.001, 0.001]}
          blendFunction={BlendFunction.NORMAL}
          radialModulation={false}
          modulationOffset={0}
        />
        <Vignette eskil={false} offset={0.3} darkness={0.8} blendFunction={BlendFunction.NORMAL} />
      </EffectComposer>
    </Canvas>
  );
}
