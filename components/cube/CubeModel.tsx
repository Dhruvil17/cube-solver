"use client";

import { useRef, useEffect, useMemo } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useCubeStore } from "@/stores/cube-store";
import { FaceLetter, MoveLetter, FACE_COLORS, isCubieOnFace } from "@/lib/cube-core";

// Rotation axis/direction for each face
const ROTATION_CONFIGS: Record<MoveLetter, { axis: THREE.Vector3; direction: number }> = {
  U: { axis: new THREE.Vector3(0, 1, 0), direction: -1 },
  D: { axis: new THREE.Vector3(0, 1, 0), direction: 1 },
  R: { axis: new THREE.Vector3(1, 0, 0), direction: -1 },
  L: { axis: new THREE.Vector3(1, 0, 0), direction: 1 },
  F: { axis: new THREE.Vector3(0, 0, 1), direction: -1 },
  B: { axis: new THREE.Vector3(0, 0, 1), direction: 1 },
  M: { axis: new THREE.Vector3(1, 0, 0), direction: 1 },
  E: { axis: new THREE.Vector3(0, 1, 0), direction: 1 },
  S: { axis: new THREE.Vector3(0, 0, 1), direction: -1 },
};

// Easing function for smooth animation snap
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function CubeModel() {
  const {
    cubies,
    animatingMove,
    moveQueue,
    playbackSpeed,
    startAnimatingNext,
    finishAnimatingMove,
    queueMoves,
    setOrbitEnabled,
  } = useCubeStore();

  // Stable ref map: cubieId -> THREE.Group
  // This survives re-renders and position changes
  const meshById = useRef<Map<string, THREE.Group>>(new Map());

  // Animation progress ref (0 → 1)
  const animProgress = useRef(0);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      )
        return;

      const key = e.key.toLowerCase();
      const faceKeys: Record<string, FaceLetter> = {
        u: "U", d: "D", r: "R", l: "L", f: "F", b: "B",
      };

      if (faceKeys[key]) {
        const face = faceKeys[key];
        const isPrime = e.shiftKey;
        queueMoves([`${face}${isPrime ? "'" : ""}`]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [queueMoves]);

  // Drag detection
  const dragStartInfo = useRef<{
    cubieId: string;
    face: FaceLetter;
    cx: number;
    cy: number;
    cz: number;
    point: THREE.Vector3;
  } | null>(null);

  // ─── ANIMATION FRAME LOOP ────────────────────────────────────────────────────
  useFrame((_, delta) => {
    // ── Idle: pull next move from queue ──────────────────────────────────────
    if (!animatingMove) {
      if (moveQueue.length > 0) {
        startAnimatingNext();
      }
      // Nothing else to do — meshes already in correct positions from last finishAnimatingMove
      return;
    }

    // ── Animate ──────────────────────────────────────────────────────────────
    const moveFace = animatingMove[0] as MoveLetter;
    const { axis, direction } = ROTATION_CONFIGS[moveFace];
    const isPrime = animatingMove.includes("'");
    const isDouble = animatingMove.includes("2");

    const angleMultiplier = isPrime ? -1 : isDouble ? 2 : 1;
    const targetAngle = direction * angleMultiplier * (Math.PI / 2);

    const baseDuration = 0.18;
    const duration = (isDouble ? baseDuration * 1.35 : baseDuration) / Math.max(0.1, playbackSpeed);

    animProgress.current = Math.min(1, animProgress.current + delta / duration);
    const eased = easeInOutCubic(animProgress.current);
    const currentAngle = targetAngle * eased;

    // Apply rotation to mesh groups for cubies on this face
    // We use the CURRENT logical state from the store to determine which cubies
    // are on this face (based on their pre-animation logical coords)
    cubies.forEach((cubie) => {
      const mesh = meshById.current.get(cubie.id);
      if (!mesh) return;

      if (isCubieOnFace(cubie, moveFace)) {
        // Orbit around face axis
        const posVector = new THREE.Vector3(cubie.x, cubie.y, cubie.z);
        posVector.applyAxisAngle(axis, currentAngle);
        mesh.position.copy(posVector);

        const quat = new THREE.Quaternion().setFromAxisAngle(axis, currentAngle);
        mesh.setRotationFromQuaternion(quat);
      }
    });

    // Animation complete
    if (animProgress.current >= 1) {
      animProgress.current = 0;
      finishAnimatingMove();
    }
  });

  // ─── SYNC MESH POSITIONS after store update (non-animating cubies) ────────
  // After finishAnimatingMove, cubies array is updated with new logical coords.
  // We reset all mesh positions to match new logical state.
  // This runs as a layout effect when cubies change (i.e., after each move commit).
  useEffect(() => {
    // Only sync when we're NOT mid-animation
    if (animatingMove) return;
    cubies.forEach((cubie) => {
      const mesh = meshById.current.get(cubie.id);
      if (!mesh) return;
      mesh.position.set(cubie.x, cubie.y, cubie.z);
      mesh.rotation.set(0, 0, 0);
    });
  }, [cubies, animatingMove]);

  // ─── POINTER HANDLERS ────────────────────────────────────────────────────────
  const handlePointerDown = (
    e: ThreeEvent<PointerEvent>,
    cubieId: string,
    face: FaceLetter,
    cx: number,
    cy: number,
    cz: number
  ) => {
    e.stopPropagation();
    if (animatingMove) return;
    setOrbitEnabled(false);
    dragStartInfo.current = { cubieId, face, cx, cy, cz, point: e.point.clone() };
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    setOrbitEnabled(true);
    const startInfo = dragStartInfo.current;
    if (!startInfo) return;
    dragStartInfo.current = null;
    if (!e.point) return;

    const displacement = new THREE.Vector3().subVectors(e.point, startInfo.point);
    if (displacement.length() < 0.25) return;

    const { face, cx, cy, cz } = startInfo;
    let detectedMove: string | null = null;

    if (face === "U") {
      if (Math.abs(displacement.x) > Math.abs(displacement.z)) {
        const isRight = displacement.x > 0;
        detectedMove = isRight ? "U'" : "U";
      } else {
        const isFront = displacement.z > 0;
        if (cx > 0) detectedMove = isFront ? "R'" : "R";
        else if (cx < 0) detectedMove = isFront ? "L" : "L'";
        else detectedMove = isFront ? "M" : "M'";
      }
    } else if (face === "D") {
      if (Math.abs(displacement.x) > Math.abs(displacement.z)) {
        const isRight = displacement.x > 0;
        detectedMove = isRight ? "D" : "D'";
      } else {
        const isFront = displacement.z > 0;
        if (cx > 0) detectedMove = isFront ? "R'" : "R";
        else if (cx < 0) detectedMove = isFront ? "L" : "L'";
        else detectedMove = isFront ? "M" : "M'";
      }
    } else if (face === "F") {
      if (Math.abs(displacement.x) > Math.abs(displacement.y)) {
        const isRight = displacement.x > 0;
        if (cy > 0) detectedMove = isRight ? "U'" : "U";
        else if (cy < 0) detectedMove = isRight ? "D" : "D'";
        else detectedMove = isRight ? "E" : "E'";
      } else {
        const isUp = displacement.y > 0;
        if (cx > 0) detectedMove = isUp ? "R" : "R'";
        else if (cx < 0) detectedMove = isUp ? "L'" : "L";
        else detectedMove = isUp ? "M'" : "M";
      }
    } else if (face === "B") {
      if (Math.abs(displacement.x) > Math.abs(displacement.y)) {
        const isRight = displacement.x > 0;
        if (cy > 0) detectedMove = isRight ? "U" : "U'";
        else if (cy < 0) detectedMove = isRight ? "D'" : "D";
        else detectedMove = isRight ? "E'" : "E";
      } else {
        const isUp = displacement.y > 0;
        if (cx > 0) detectedMove = isUp ? "R'" : "R";
        else if (cx < 0) detectedMove = isUp ? "L" : "L'";
        else detectedMove = isUp ? "M" : "M'";
      }
    } else if (face === "R") {
      if (Math.abs(displacement.z) > Math.abs(displacement.y)) {
        const isFront = displacement.z > 0;
        if (cy > 0) detectedMove = isFront ? "U" : "U'";
        else if (cy < 0) detectedMove = isFront ? "D'" : "D";
        else detectedMove = isFront ? "E'" : "E";
      } else {
        const isUp = displacement.y > 0;
        if (cz > 0) detectedMove = isUp ? "F'" : "F";
        else if (cz < 0) detectedMove = isUp ? "B" : "B'";
        else detectedMove = isUp ? "S'" : "S";
      }
    } else if (face === "L") {
      if (Math.abs(displacement.z) > Math.abs(displacement.y)) {
        const isFront = displacement.z > 0;
        if (cy > 0) detectedMove = isFront ? "U'" : "U";
        else if (cy < 0) detectedMove = isFront ? "D" : "D'";
        else detectedMove = isFront ? "E" : "E'";
      } else {
        const isUp = displacement.y > 0;
        if (cz > 0) detectedMove = isUp ? "F" : "F'";
        else if (cz < 0) detectedMove = isUp ? "B'" : "B";
        else detectedMove = isUp ? "S" : "S'";
      }
    }

    if (detectedMove) {
      queueMoves([detectedMove]);
    }
  };


  // ─── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <group onPointerMissed={() => setOrbitEnabled(true)}>
      {cubies.map((cubie) => {
        return (
          <group
            key={cubie.id}
            ref={(el) => {
              if (el) {
                meshById.current.set(cubie.id, el);
              }
            }}
            position={[cubie.x, cubie.y, cubie.z]}
          >
            {/* Core dark plastic body */}
            <RoundedBox args={[0.96, 0.96, 0.96]} radius={0.055} smoothness={6}>
              <meshStandardMaterial color="#090909" roughness={0.35} metalness={0.25} />
            </RoundedBox>

            {/* Sticker panels — raised, vivid, glowing */}
            {(Object.entries(cubie.colors) as [FaceLetter, string | null][]).map(
              ([faceDir, colorCode]) => {
                if (!colorCode) return null;

                const color = FACE_COLORS[colorCode as FaceLetter];
                const W = 0.87;
                const T = 0.024; // slab thickness
                const out = 0.505; // raised above body face

                let pos: [number, number, number] = [0, 0, 0];
                let rot: [number, number, number] = [0, 0, 0];

                if (faceDir === "U") { pos = [0, out, 0]; rot = [Math.PI / 2, 0, 0]; }
                else if (faceDir === "D") { pos = [0, -out, 0]; rot = [-Math.PI / 2, 0, 0]; }
                else if (faceDir === "R") { pos = [out, 0, 0]; rot = [0, Math.PI / 2, 0]; }
                else if (faceDir === "L") { pos = [-out, 0, 0]; rot = [0, -Math.PI / 2, 0]; }
                else if (faceDir === "F") { pos = [0, 0, out]; rot = [0, 0, 0]; }
                else if (faceDir === "B") { pos = [0, 0, -out]; rot = [0, Math.PI, 0]; }

                return (
                  <mesh
                    key={faceDir}
                    position={pos}
                    rotation={rot}
                    onPointerDown={(e) =>
                      handlePointerDown(e, cubie.id, faceDir, cubie.x, cubie.y, cubie.z)
                    }
                    onPointerUp={handlePointerUp}
                  >
                    <boxGeometry args={[W, W, T]} />
                    <meshStandardMaterial
                      color={color}
                      emissive={color}
                      emissiveIntensity={0.2}
                      roughness={0.06}
                      metalness={0.0}
                    />
                  </mesh>
                );
              }
            )}
          </group>
        );
      })}
    </group>
  );
}
