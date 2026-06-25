"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { CubeModel } from "@/components/cube/CubeModel";
import { useCubeStore } from "@/stores/cube-store";

export function CubeScene() {
  const { isOrbitEnabled } = useCubeStore();

  return (
    <div className="h-full w-full relative cube-canvas">
      <Canvas
        camera={{ position: [4.4, 3.85, 6.05], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, toneMapping: 3 /* ACESFilmic */ }}
        shadows
      >
        <color attach="background" args={["#0f1115"]} />

        {/* Key light — bright white from upper-left front */}
        <directionalLight
          position={[6, 8, 6]}
          intensity={3.5}
          color="#ffffff"
          castShadow
        />

        {/* Fill light — soft warm from the right */}
        <directionalLight
          position={[-5, 4, 3]}
          intensity={1.8}
          color="#ffe4b5"
        />

        {/* Back rim light — blue-indigo to separate cube from background */}
        <directionalLight
          position={[0, -4, -8]}
          intensity={1.2}
          color="#818cf8"
        />

        {/* Ambient base — prevents pure black shadows */}
        <ambientLight intensity={0.35} />

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
