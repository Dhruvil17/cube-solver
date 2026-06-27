"use client";

import { useRef, useEffect, useMemo, useCallback } from "react";
import { useFrame, ThreeEvent, useThree } from "@react-three/fiber";
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

type FaceGesture = {
  tangentA: THREE.Vector3;
  tangentB: THREE.Vector3;
};

const FACE_GESTURES: Record<FaceLetter, FaceGesture> = {
  U: { tangentA: new THREE.Vector3(1, 0, 0), tangentB: new THREE.Vector3(0, 0, 1) },
  D: { tangentA: new THREE.Vector3(1, 0, 0), tangentB: new THREE.Vector3(0, 0, 1) },
  F: { tangentA: new THREE.Vector3(1, 0, 0), tangentB: new THREE.Vector3(0, 1, 0) },
  B: { tangentA: new THREE.Vector3(1, 0, 0), tangentB: new THREE.Vector3(0, 1, 0) },
  R: { tangentA: new THREE.Vector3(0, 0, 1), tangentB: new THREE.Vector3(0, 1, 0) },
  L: { tangentA: new THREE.Vector3(0, 0, 1), tangentB: new THREE.Vector3(0, 1, 0) },
};

const SWIPE_THRESHOLD_PX = 24;

const CUBIE_SIZE = 0.98;
const PANEL_SIZE = 0.98;
const PANEL_RADIUS = 0.10;

// Easing function for smooth animation snap
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function worldDirToScreenDir(
  dir: THREE.Vector3,
  originWorld: THREE.Vector3,
  camera: THREE.Camera,
  width: number,
  height: number
): THREE.Vector2 {
  const a = originWorld.clone().project(camera);
  const b = originWorld.clone().add(dir).project(camera);

  const ax = (a.x * 0.5 + 0.5) * width;
  const ay = (-a.y * 0.5 + 0.5) * height;
  const bx = (b.x * 0.5 + 0.5) * width;
  const by = (-b.y * 0.5 + 0.5) * height;

  return new THREE.Vector2(bx - ax, by - ay);
}

function makeStickerShape(col: number, row: number): THREE.Shape {
  const w = PANEL_SIZE;
  const h = PANEL_SIZE;
  const r = PANEL_RADIUS;
  const x = -w / 2;
  const y = -h / 2;

  const inwardPlusX  = col === 0 || col === 1;
  const inwardMinusX = col === 2 || col === 1;
  const inwardPlusY  = row === 0 || row === 1;
  const inwardMinusY = row === 2 || row === 1;

  const rBL = inwardMinusX && inwardMinusY ? r : 0;
  const rBR = inwardPlusX  && inwardMinusY ? r : 0;
  const rTR = inwardPlusX  && inwardPlusY  ? r : 0;
  const rTL = inwardMinusX && inwardPlusY  ? r : 0;

  const shape = new THREE.Shape();

  shape.moveTo(x + rBL, y);
  shape.lineTo(x + w - rBR, y);
  if (rBR > 0) shape.absarc(x + w - rBR, y + rBR, rBR, -Math.PI / 2, 0, false);
  else shape.lineTo(x + w, y);
  shape.lineTo(x + w, y + h - rTR);
  if (rTR > 0) shape.absarc(x + w - rTR, y + h - rTR, rTR, 0, Math.PI / 2, false);
  else shape.lineTo(x + w, y + h);
  shape.lineTo(x + rTL, y + h);
  if (rTL > 0) shape.absarc(x + rTL, y + h - rTL, rTL, Math.PI / 2, Math.PI, false);
  else shape.lineTo(x, y + h);
  shape.lineTo(x, y + rBL);
  if (rBL > 0) shape.absarc(x + rBL, y + rBL, rBL, Math.PI, Math.PI * 1.5, false);
  else shape.lineTo(x, y);

  return shape;
}

function getStickerGrid(
  faceDir: FaceLetter,
  cx: number,
  cy: number,
  cz: number
): [number, number] {
  switch (faceDir) {
    // U: shapeX=+worldX (inward+X when cx<0 → col=cx+1), shapeY=+worldZ (inward+Y when cz<0 → row=cz+1)
    case "U": return [cx + 1, cz + 1];
    // D: shapeX=+worldX (col=cx+1), shapeY=−worldZ (inward+Y when cz>0 → row=2−(cz+1))
    case "D": return [cx + 1, 2 - (cz + 1)];
    // F: shapeX=+worldX (col=cx+1), shapeY=+worldY (inward+Y when cy<0 → row=cy+1)
    case "F": return [cx + 1, cy + 1];
    // B: shapeX=−worldX (inward+X when cx>0 → col=2−(cx+1)), shapeY=+worldY (row=cy+1)
    case "B": return [2 - (cx + 1), cy + 1];
    // R: shapeX=−worldZ (inward+X when cz>0 → col=2−(cz+1)), shapeY=+worldY (row=cy+1)
    case "R": return [2 - (cz + 1), cy + 1];
    // L: shapeX=+worldZ (inward+X when cz<0 → col=cz+1), shapeY=+worldY (row=cy+1)
    case "L": return [cz + 1, cy + 1];
    default:  return [1, 1];
  }
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

  const makeStickerShapeCb = useCallback(makeStickerShape, []);

  const stickerShapes = useMemo(() => {
    const shapes: Record<string, THREE.Shape> = {};
    for (let col = 0; col < 3; col++) {
      for (let row = 0; row < 3; row++) {
        shapes[`${col},${row}`] = makeStickerShapeCb(col, row);
      }
    }
    return shapes;
  }, [makeStickerShapeCb]);

  const { controls, camera, size } = useThree() as {
    controls: any;
    camera: THREE.Camera;
    size: { width: number; height: number };
  };

  // Stable ref map: cubieId -> THREE.Group
  const meshById = useRef<Map<string, THREE.Group>>(new Map());

  // Animation progress ref (0 → 1)
  const animProgress = useRef(0);

  // Reused quaternion for the active animation
  const animQuat = useRef(new THREE.Quaternion());

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
        const mv = `${face}${isPrime ? "'" : ""}`;
        queueMoves([mv]);
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
    screenX: number;
    screenY: number;
    worldOrigin: THREE.Vector3;
  } | null>(null);

  const livePointer = useRef<{ x: number; y: number } | null>(null);

  const releaseDrag = () => {
    if (dragStartInfo.current) {
      dragStartInfo.current = null;
      if (controls) {
        controls.enabled = true;
      }
      setOrbitEnabled(true);
    }
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      livePointer.current = { x: e.clientX, y: e.clientY };
    };
    const handleRelease = () => {
      livePointer.current = null;
      releaseDrag();
    };
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handleRelease);
    window.addEventListener("pointercancel", handleRelease);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handleRelease);
      window.removeEventListener("pointercancel", handleRelease);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setOrbitEnabled, controls]);

  // ─── ANIMATION FRAME LOOP ────────────────────────────────────────────────────
  useFrame((state, delta) => {
    // ── Real-time Drag / Swipe detection ──
    const startInfo = dragStartInfo.current;
    if (startInfo && !animatingMove && livePointer.current) {
      const curX = livePointer.current.x;
      const curY = livePointer.current.y;

      const screenDX = curX - startInfo.screenX;
      const screenDY = curY - startInfo.screenY;
      const screenDist = Math.hypot(screenDX, screenDY);

      if (screenDist >= SWIPE_THRESHOLD_PX) {
        const { face, cx, cy, cz, worldOrigin } = startInfo;
        const gesture = FACE_GESTURES[face];

        const screenA = worldDirToScreenDir(gesture.tangentA, worldOrigin, camera, size.width, size.height);
        const screenB = worldDirToScreenDir(gesture.tangentB, worldOrigin, camera, size.width, size.height);

        const drag = new THREE.Vector2(screenDX, screenDY);

        const dotA = screenA.lengthSq() > 0 ? drag.dot(screenA.clone().normalize()) : 0;
        const dotB = screenB.lengthSq() > 0 ? drag.dot(screenB.clone().normalize()) : 0;

        const alongA = Math.abs(dotA) >= Math.abs(dotB);
        const signPositive = alongA ? dotA > 0 : dotB > 0;

        let detectedMove: string | null = null;

        if (face === "U") {
          if (alongA) {
            detectedMove = signPositive ? "U'" : "U";
          } else {
            const isFront = signPositive;
            if (cx > 0) detectedMove = isFront ? "R'" : "R";
            else if (cx < 0) detectedMove = isFront ? "L" : "L'";
            else detectedMove = isFront ? "M" : "M'";
          }
        } else if (face === "D") {
          if (alongA) {
            detectedMove = signPositive ? "D" : "D'";
          } else {
            const isFront = signPositive;
            if (cx > 0) detectedMove = isFront ? "R'" : "R";
            else if (cx < 0) detectedMove = isFront ? "L" : "L'";
            else detectedMove = isFront ? "M" : "M'";
          }
        } else if (face === "F") {
          if (alongA) {
            const isRight = signPositive;
            if (cy > 0) detectedMove = isRight ? "U'" : "U";
            else if (cy < 0) detectedMove = isRight ? "D" : "D'";
            else detectedMove = isRight ? "E" : "E'";
          } else {
            const isUp = signPositive;
            if (cx > 0) detectedMove = isUp ? "R" : "R'";
            else if (cx < 0) detectedMove = isUp ? "L'" : "L";
            else detectedMove = isUp ? "M'" : "M";
          }
        } else if (face === "B") {
          if (alongA) {
            const isRight = signPositive;
            if (cy > 0) detectedMove = isRight ? "U" : "U'";
            else if (cy < 0) detectedMove = isRight ? "D'" : "D";
            else detectedMove = isRight ? "E'" : "E";
          } else {
            const isUp = signPositive;
            if (cx > 0) detectedMove = isUp ? "R'" : "R";
            else if (cx < 0) detectedMove = isUp ? "L" : "L'";
            else detectedMove = isUp ? "M" : "M'";
          }
        } else if (face === "R") {
          if (alongA) {
            const isFront = signPositive;
            if (cy > 0) detectedMove = isFront ? "U" : "U'";
            else if (cy < 0) detectedMove = isFront ? "D'" : "D";
            else detectedMove = isFront ? "E'" : "E";
          } else {
            const isUp = signPositive;
            if (cz > 0) detectedMove = isUp ? "F'" : "F";
            else if (cz < 0) detectedMove = isUp ? "B" : "B'";
            else detectedMove = isUp ? "S'" : "S";
          }
        } else if (face === "L") {
          if (alongA) {
            const isFront = signPositive;
            if (cy > 0) detectedMove = isFront ? "U'" : "U";
            else if (cy < 0) detectedMove = isFront ? "D" : "D'";
            else detectedMove = isFront ? "E" : "E'";
          } else {
            const isUp = signPositive;
            if (cz > 0) detectedMove = isUp ? "F" : "F'";
            else if (cz < 0) detectedMove = isUp ? "B'" : "B";
            else detectedMove = isUp ? "S" : "S'";
          }
        }

        if (detectedMove) {
          queueMoves([detectedMove]);
          releaseDrag();
        }
      }
    }

    // ── Idle: pull next move from queue ──────────────────────────────────────
    if (!animatingMove) {
      if (moveQueue.length > 0) {
        startAnimatingNext();
      }
      return;
    }

    // ── Animate ──────────────────────────────────────────────────────────────
    const moveFace = animatingMove[0] as MoveLetter;
    const { axis, direction } = ROTATION_CONFIGS[moveFace];
    const isPrime = animatingMove.includes("'");
    const isDouble = animatingMove.includes("2");

    if (animProgress.current === 0) {
      const movingCubieIds = cubies.filter((c) => isCubieOnFace(c, moveFace)).map((c) => c.id);
    }

    const angleMultiplier = isPrime ? -1 : isDouble ? 2 : 1;
    const targetAngle = direction * angleMultiplier * (Math.PI / 2);

    const baseDuration = 0.18;
    const duration = (isDouble ? baseDuration * 1.35 : baseDuration) / Math.max(0.1, playbackSpeed);

    animProgress.current = Math.min(1, animProgress.current + delta / duration);
    const eased = easeInOutCubic(animProgress.current);
    const currentAngle = targetAngle * eased;

    animQuat.current.setFromAxisAngle(axis, currentAngle);

    cubies.forEach((cubie) => {
      const mesh = meshById.current.get(cubie.id);
      if (!mesh) return;

      if (isCubieOnFace(cubie, moveFace)) {
        const posVector = new THREE.Vector3(cubie.x, cubie.y, cubie.z);
        posVector.applyAxisAngle(axis, currentAngle);
        mesh.position.copy(posVector);
        mesh.setRotationFromQuaternion(animQuat.current);
      }
    });

    if (animProgress.current >= 1) {
      animProgress.current = 0;
      finishAnimatingMove();
    }
  });

  // ─── SYNC MESH POSITIONS after store update ───────────────────────────────
  useEffect(() => {
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
    if (animatingMove) {
      return;
    }
    if (controls) {
      controls.enabled = false;
    }
    setOrbitEnabled(false);
    livePointer.current = { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY };
    dragStartInfo.current = {
      cubieId,
      face,
      cx,
      cy,
      cz,
      screenX: e.nativeEvent.clientX,
      screenY: e.nativeEvent.clientY,
      worldOrigin: e.point.clone(),
    };
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
            <mesh>
              <boxGeometry args={[CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.55} metalness={0.05} />
            </mesh>

            {(Object.entries(cubie.colors) as [FaceLetter, string | null][]).map(
              ([faceDir, colorCode]) => {
                if (!colorCode) return null;

                const color = FACE_COLORS[colorCode as FaceLetter];

                const panelOut = CUBIE_SIZE / 2 + 0.002;

                let pos: [number, number, number] = [0, 0, 0];
                let rot: [number, number, number] = [0, 0, 0];

                if (faceDir === "U") { pos = [0, panelOut, 0]; rot = [Math.PI / 2, 0, 0]; }
                else if (faceDir === "D") { pos = [0, -panelOut, 0]; rot = [-Math.PI / 2, 0, 0]; }
                else if (faceDir === "R") { pos = [panelOut, 0, 0]; rot = [0, Math.PI / 2, 0]; }
                else if (faceDir === "L") { pos = [-panelOut, 0, 0]; rot = [0, -Math.PI / 2, 0]; }
                else if (faceDir === "F") { pos = [0, 0, panelOut]; rot = [0, 0, 0]; }
                else if (faceDir === "B") { pos = [0, 0, -panelOut]; rot = [0, Math.PI, 0]; }

                const [col, row] = getStickerGrid(faceDir, cubie.x, cubie.y, cubie.z);
                const stickerShape = stickerShapes[`${col},${row}`];

                return (
                  <group key={faceDir} position={pos} rotation={rot}>
                    <mesh>
                      <shapeGeometry args={[stickerShape]} />
                      <meshToonMaterial color={color} side={THREE.DoubleSide} />
                    </mesh>
                    <mesh
                      position={[0, 0, 0.001]}
                      onPointerDown={(e) =>
                        handlePointerDown(e, cubie.id, faceDir, cubie.x, cubie.y, cubie.z)
                      }
                    >
                      <planeGeometry args={[1, 1]} />
                      <meshBasicMaterial visible={false} side={2} />
                    </mesh>
                  </group>
                );
              }
            )}
          </group>
        );
      })}
    </group>
  );
}