"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { CubeModel } from "@/components/cube/CubeModel";
import { useCubeStore } from "@/stores/cube-store";

export function CubeScene() {
  const { isOrbitEnabled } = useCubeStore();

  return (
    <div className="h-full w-full relative cube-canvas">
      <Canvas
        camera={{ position: [4.71, 4.12, 6.47], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        shadows={{ type: THREE.PCFShadowMap }}
      >
        <color attach="background" args={["#0f1115"]} />

        <directionalLight
          position={[6, 8, 6]}
          intensity={1.4}
          color="#ffffff"
          castShadow
        />

        <directionalLight
          position={[-5, 4, 3]}
          intensity={0.7}
          color="#ffe4b5"
        />

        <directionalLight
          position={[0, -4, -8]}
          intensity={0.5}
          color="#818cf8"
        />

        <directionalLight
          position={[-2, -7, -2]}
          intensity={0.9}
          color="#ffffff"
        />
        <ambientLight intensity={0.55} />

        {/* 3D Rubik's Cube Model */}
        <CubeModel />

        {/* Camera Controls */}
        <OrbitControls
          enableDamping
          dampingFactor={0.06}
          enableZoom={true}
          enablePan={false}
          minDistance={4}
          maxDistance={9}
          enabled={isOrbitEnabled}
          makeDefault
        />
      </Canvas>
    </div>
  );
}