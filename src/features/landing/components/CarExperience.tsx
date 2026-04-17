/**
 * Freaky Cars - CarExperience (No Audio, White Theme)
 * Generated: 2026-04-17 | Antigravity IDE
 *
 * Combines ScrollControls, car model, road, and sand particles.
 * All audio removed. White-friendly scene.
 */
"use client";

import React from "react";
import { ScrollControls } from "@react-three/drei";
import LamborghiniModel from "./LamborghiniModel";
import SandParticles from "./SandParticles";
import AmericanRoad from "./AmericanRoad";

function DriftScene() {
  return (
    <>
      <LamborghiniModel />
      <SandParticles />
    </>
  );
}

export default function CarExperience() {
  return (
    <group>
      {/* Road lives outside scroll so it stays fixed */}
      <AmericanRoad />

      {/* ScrollControls gives useScroll() context to children */}
      <ScrollControls pages={5} damping={0.15}>
        <DriftScene />
      </ScrollControls>
    </group>
  );
}
