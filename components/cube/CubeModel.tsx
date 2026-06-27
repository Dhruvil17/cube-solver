"use client";

import { useRef, useEffect } from "react";
import { useFrame, ThreeEvent, useThree } from "@react-three/fiber";
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

// For each face, the two in-plane "tangent" directions we care about,
// expressed as world-space unit vectors, plus the move each tangent
// produces when swiped in its positive / negative direction.
// This replaces the old hardcoded world-axis comparisons (displacement.x/y/z)
// which broke once the camera was orbited away from the default angle.
//
// tangentA / tangentB are just two perpendicular in-plane axes for the face.
// "posMove" / "negMove" describe what happens when the drag lands mostly along
// that tangent, in its positive or negative world direction. The actual
// left/right/up/down decision is made in screen space (see useFrame below);
// these are only used to figure out, for the *current* camera, which way
// each world tangent currently projects on screen.
type FaceGesture = {
  tangentA: THREE.Vector3; // e.g. world X for U/D faces
  tangentB: THREE.Vector3; // e.g. world Z for U/D faces
};

const FACE_GESTURES: Record<FaceLetter, FaceGesture> = {
  U: { tangentA: new THREE.Vector3(1, 0, 0), tangentB: new THREE.Vector3(0, 0, 1) },
  D: { tangentA: new THREE.Vector3(1, 0, 0), tangentB: new THREE.Vector3(0, 0, 1) },
  F: { tangentA: new THREE.Vector3(1, 0, 0), tangentB: new THREE.Vector3(0, 1, 0) },
  B: { tangentA: new THREE.Vector3(1, 0, 0), tangentB: new THREE.Vector3(0, 1, 0) },
  R: { tangentA: new THREE.Vector3(0, 0, 1), tangentB: new THREE.Vector3(0, 1, 0) },
  L: { tangentA: new THREE.Vector3(0, 0, 1), tangentB: new THREE.Vector3(0, 1, 0) },
};

// Minimum swipe distance in CSS pixels before we commit to a move.
// Replaces the old hardcoded 0.35 world-unit threshold, which scaled
// incorrectly with zoom (felt different depending on how far the camera
// had been dollied in/out).
const SWIPE_THRESHOLD_PX = 24;

// Easing function for smooth animation snap
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Projects a world-space direction vector to a 2D screen-space direction
// (in pixels, unnormalized) for the given camera + canvas size.
// We do this by projecting two points (origin and origin+dir) and taking
// the difference, rather than trying to transform the direction directly,
// so it correctly accounts for perspective projection.
function worldDirToScreenDir(
  dir: THREE.Vector3,
  originWorld: THREE.Vector3,
  camera: THREE.Camera,
  width: number,
  height: number
): THREE.Vector2 {
  const a = originWorld.clone().project(camera);
  const b = originWorld.clone().add(dir).project(camera);

  // NDC (-1..1) -> pixel space. Y is flipped because screen Y grows downward.
  const ax = (a.x * 0.5 + 0.5) * width;
  const ay = (-a.y * 0.5 + 0.5) * height;
  const bx = (b.x * 0.5 + 0.5) * width;
  const by = (-b.y * 0.5 + 0.5) * height;

  return new THREE.Vector2(bx - ax, by - ay);
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

  const { controls, camera, size } = useThree() as {
    controls: any;
    camera: THREE.Camera;
    size: { width: number; height: number };
  };

  // Stable ref map: cubieId -> THREE.Group
  // This survives re-renders and position changes
  const meshById = useRef<Map<string, THREE.Group>>(new Map());

  // Animation progress ref (0 → 1)
  const animProgress = useRef(0);

  // Reused quaternion for the active animation, rebuilt only when the
  // target angle changes (once per frame, not once per cubie).
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
    // Screen-space pixel coords where the drag started
    screenX: number;
    screenY: number;
    // World position of the cubie at drag start — used as the projection
    // origin for the face tangents, so the screen-space directions are
    // computed at the right point in the scene (matters under perspective).
    worldOrigin: THREE.Vector3;
  } | null>(null);

  // Live current pointer position in CSS pixels, updated directly from the
  // native pointermove event. We deliberately do NOT use R3F's state.pointer
  // here — that value is only refreshed by R3F's own internal pointer
  // handling on its render cycle, and was observed going stale/lagging
  // during fast or short drags, which made every swipe resolve to the same
  // screenDX regardless of the actual gesture. Tracking it ourselves from
  // the raw browser event removes that indirection entirely.
  const livePointer = useRef<{ x: number; y: number } | null>(null);

  // Releases the drag state and restores orbit controls. Shared by
  // pointerup AND pointercancel so we never get stuck with orbit disabled.
  const releaseDrag = () => {
    if (dragStartInfo.current) {
      dragStartInfo.current = null;
      if (controls) {
        controls.enabled = true;
      }
      setOrbitEnabled(true);
    }
  };

  // Global pointerup/pointercancel listeners to safely clean up drag start info.
  // pointercancel matters on touch devices: an interrupted gesture (OS
  // swipe-back, incoming multi-touch, app switch) fires pointercancel, not
  // pointerup. Without handling it, orbit stays disabled until another tap.
  //
  // Also tracks a native pointermove listener so we have an always-fresh
  // raw pointer position to diff against, instead of relying on R3F's
  // internally-throttled state.pointer (see livePointer comment above).
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
    // ── Real-time Drag / Swipe detection (camera-relative, screen-space) ──
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

        // Project both in-plane world tangents into current screen space.
        // Recomputed every time a drag resolves, so this is correct for
        // whatever angle the camera is currently at — including tilted,
        // bottom, or corner views.
        const screenA = worldDirToScreenDir(gesture.tangentA, worldOrigin, camera, size.width, size.height);
        const screenB = worldDirToScreenDir(gesture.tangentB, worldOrigin, camera, size.width, size.height);

        const drag = new THREE.Vector2(screenDX, screenDY);

        // Dot the drag against each (normalized) screen tangent to find
        // which world axis the user's swipe is actually most aligned with
        // on screen right now, and in which sign along that axis.
        const dotA = screenA.lengthSq() > 0 ? drag.dot(screenA.clone().normalize()) : 0;
        const dotB = screenB.lengthSq() > 0 ? drag.dot(screenB.clone().normalize()) : 0;

        const alongA = Math.abs(dotA) >= Math.abs(dotB);
        // signPositive: true means the drag moved in the *positive* world
        // direction of the dominant tangent (tangentA or tangentB).
        const signPositive = alongA ? dotA > 0 : dotB > 0;

        let detectedMove: string | null = null;

        if (face === "U") {
          if (alongA) {
            // tangentA = world +X. Swiping along +X on an up-facing layer
            // turns U the same way the old code intended.
            detectedMove = signPositive ? "U'" : "U";
          } else {
            // tangentB = world +Z.
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
          // TEMP DEBUG — remove after diagnosing the swipe issue.
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
      // Nothing else to do — meshes already in correct positions from last finishAnimatingMove
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

    // Built once per frame (not once per cubie) since it's identical for
    // every cubie on this face during this animation step.
    animQuat.current.setFromAxisAngle(axis, currentAngle);

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
        mesh.setRotationFromQuaternion(animQuat.current);
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
                  <group key={faceDir}>
                    {/* Colored sticker */}
                    <mesh
                      position={pos}
                      rotation={rot}
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
                    {/* Invisible full-face hit plane — covers entire cubie face including black gaps */}
                    <mesh
                      position={pos}
                      rotation={rot}
                      onPointerDown={(e) =>
                        handlePointerDown(e, cubie.id, faceDir, cubie.x, cubie.y, cubie.z)
                      }
                    >
                      <planeGeometry args={[0.98, 0.98]} />
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