export interface Cubie {
  id: string;
  x: number; // -1, 0, 1
  y: number; // -1, 0, 1
  z: number; // -1, 0, 1
  colors: {
    U: string | null;
    D: string | null;
    R: string | null;
    L: string | null;
    F: string | null;
    B: string | null;
  };
}

export type FaceLetter = 'U' | 'D' | 'R' | 'L' | 'F' | 'B';
export type MoveLetter = FaceLetter | 'M' | 'E' | 'S';

// Vivid WCA-accurate sticker colors
export const FACE_COLORS: Record<FaceLetter, string> = {
  U: '#f4f4f4', // Near-white (slightly warm)
  D: '#ffd500', // Vivid WCA Yellow
  R: '#e8271a', // WCA Red
  L: '#ff6b1a', // WCA Orange
  F: '#0eaa4e', // WCA Green
  B: '#1c5cdb', // WCA Blue
};


// Create a new solved Rubik's Cube state (27 cubies)
export function createSolvedState(): Cubie[] {
  const state: Cubie[] = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const id = `cubie_${x}_${y}_${z}`;
        state.push({
          id,
          x,
          y,
          z,
          colors: {
            U: y === 1 ? 'U' : null,
            D: y === -1 ? 'D' : null,
            R: x === 1 ? 'R' : null,
            L: x === -1 ? 'L' : null,
            F: z === 1 ? 'F' : null,
            B: z === -1 ? 'B' : null,
          },
        });
      }
    }
  }
  return state;
}

// Check if the current state is fully solved
export function isSolvedState(state: Cubie[]): boolean {
  for (const cubie of state) {
    if (cubie.y === 1 && cubie.colors.U !== 'U') return false;
    if (cubie.y === -1 && cubie.colors.D !== 'D') return false;
    if (cubie.x === 1 && cubie.colors.R !== 'R') return false;
    if (cubie.x === -1 && cubie.colors.L !== 'L') return false;
    if (cubie.z === 1 && cubie.colors.F !== 'F') return false;
    if (cubie.z === -1 && cubie.colors.B !== 'B') return false;
  }
  return true;
}

// Check if the current state is visually solved (each face is monochromatic in any orientation)
export function isVisuallySolved(state: Cubie[]): boolean {
  const faces: FaceLetter[] = ['U', 'D', 'R', 'L', 'F', 'B'];
  for (const face of faces) {
    let faceColor: string | null = null;
    for (const cubie of state) {
      if (isCubieOnFace(cubie, face)) {
        const color = cubie.colors[face];
        if (color === null) return false; // Outer facelet must have a color
        if (faceColor === null) {
          faceColor = color;
        } else if (color !== faceColor) {
          return false; // Different colors on the same face
        }
      }
    }
  }
  return true;
}

// 54-facelet mapping array matching cubejs (U, R, F, D, L, B in order, reading-order per face)
export const FACELET_MAPPING: { x: number; y: number; z: number; face: FaceLetter }[] = [
  // U Face (y = 1)
  { x: -1, y: 1, z: -1, face: 'U' }, // U0
  { x:  0, y: 1, z: -1, face: 'U' }, // U1
  { x:  1, y: 1, z: -1, face: 'U' }, // U2
  { x: -1, y: 1, z:  0, face: 'U' }, // U3
  { x:  0, y: 1, z:  0, face: 'U' }, // U4
  { x:  1, y: 1, z:  0, face: 'U' }, // U5
  { x: -1, y: 1, z:  1, face: 'U' }, // U6
  { x:  0, y: 1, z:  1, face: 'U' }, // U7
  { x:  1, y: 1, z:  1, face: 'U' }, // U8

  // R Face (x = 1)
  { x:  1, y: 1, z:  1, face: 'R' }, // R0
  { x:  1, y: 1, z:  0, face: 'R' }, // R1
  { x:  1, y: 1, z: -1, face: 'R' }, // R2
  { x:  1, y:  0, z:  1, face: 'R' }, // R3
  { x:  1, y:  0, z:  0, face: 'R' }, // R4
  { x:  1, y:  0, z: -1, face: 'R' }, // R5
  { x:  1, y: -1, z:  1, face: 'R' }, // R6
  { x:  1, y: -1, z:  0, face: 'R' }, // R7
  { x:  1, y: -1, z: -1, face: 'R' }, // R8

  // F Face (z = 1)
  { x: -1, y: 1, z:  1, face: 'F' }, // F0
  { x:  0, y: 1, z:  1, face: 'F' }, // F1
  { x:  1, y: 1, z:  1, face: 'F' }, // F2
  { x: -1, y:  0, z:  1, face: 'F' }, // F3
  { x:  0, y:  0, z:  1, face: 'F' }, // F4
  { x:  1, y:  0, z:  1, face: 'F' }, // F5
  { x: -1, y: -1, z:  1, face: 'F' }, // F6
  { x:  0, y: -1, z:  1, face: 'F' }, // F7
  { x:  1, y: -1, z:  1, face: 'F' }, // F8

  // D Face (y = -1)
  { x: -1, y: -1, z:  1, face: 'D' }, // D0
  { x:  0, y: -1, z:  1, face: 'D' }, // D1
  { x:  1, y: -1, z:  1, face: 'D' }, // D2
  { x: -1, y: -1, z:  0, face: 'D' }, // D3
  { x:  0, y: -1, z:  0, face: 'D' }, // D4
  { x:  1, y: -1, z:  0, face: 'D' }, // D5
  { x: -1, y: -1, z: -1, face: 'D' }, // D6
  { x:  0, y: -1, z: -1, face: 'D' }, // D7
  { x:  1, y: -1, z: -1, face: 'D' }, // D8

  // L Face (x = -1)
  { x: -1, y: 1, z: -1, face: 'L' }, // L0
  { x: -1, y: 1, z:  0, face: 'L' }, // L1
  { x: -1, y: 1, z:  1, face: 'L' }, // L2
  { x: -1, y:  0, z: -1, face: 'L' }, // L3
  { x: -1, y:  0, z:  0, face: 'L' }, // L4
  { x: -1, y:  0, z:  1, face: 'L' }, // L5
  { x: -1, y: -1, z: -1, face: 'L' }, // L6
  { x: -1, y: -1, z:  0, face: 'L' }, // L7
  { x: -1, y: -1, z:  1, face: 'L' }, // L8

  // B Face (z = -1)
  { x:  1, y: 1, z: -1, face: 'B' }, // B0
  { x:  0, y: 1, z: -1, face: 'B' }, // B1
  { x: -1, y: 1, z: -1, face: 'B' }, // B2
  { x:  1, y:  0, z: -1, face: 'B' }, // B3
  { x:  0, y:  0, z: -1, face: 'B' }, // B4
  { x: -1, y:  0, z: -1, face: 'B' }, // B5
  { x:  1, y: -1, z: -1, face: 'B' }, // B6
  { x:  0, y: -1, z: -1, face: 'B' }, // B7
  { x: -1, y: -1, z: -1, face: 'B' }, // B8
];

// Convert standard 27-cubie state into the 54-facelet string representation required by cubejs
export function toFaceletString(state: Cubie[]): string {
  let faceletStr = '';
  for (const mapping of FACELET_MAPPING) {
    const cubie = state.find((c) => c.x === mapping.x && c.y === mapping.y && c.z === mapping.z);
    if (!cubie) {
      faceletStr += 'U'; // Safe fallback
      continue;
    }
    const colorCode = cubie.colors[mapping.face];
    faceletStr += colorCode || mapping.face; // Fallback to neutral default face
  }
  return faceletStr;
}

// Single step of position/color rotation for clockwise face turns
function rotateCubieCW(cubie: Cubie, face: MoveLetter): Cubie {
  const rotated = { ...cubie, colors: { ...cubie.colors } };

  if (face === 'U') {
    // Position: (x, y, z) -> (-z, y, x)
    rotated.x = -cubie.z;
    rotated.z = cubie.x;
    // Colors: R <- B, F <- R, L <- F, B <- L
    rotated.colors.R = cubie.colors.B;
    rotated.colors.F = cubie.colors.R;
    rotated.colors.L = cubie.colors.F;
    rotated.colors.B = cubie.colors.L;
  } else if (face === 'D') {
    // Position: (x, y, z) -> (z, y, -x)
    rotated.x = cubie.z;
    rotated.z = -cubie.x;
    // Colors: R <- F, B <- R, L <- B, F <- L
    rotated.colors.R = cubie.colors.F;
    rotated.colors.B = cubie.colors.R;
    rotated.colors.L = cubie.colors.B;
    rotated.colors.F = cubie.colors.L;
  } else if (face === 'R') {
    // Position: (x, y, z) -> (x, z, -y)
    rotated.y = cubie.z;
    rotated.z = -cubie.y;
    // Colors: B <- U, D <- B, F <- D, U <- F
    rotated.colors.B = cubie.colors.U;
    rotated.colors.D = cubie.colors.B;
    rotated.colors.F = cubie.colors.D;
    rotated.colors.U = cubie.colors.F;
  } else if (face === 'L') {
    // Position: (x, y, z) -> (x, -z, y)
    rotated.y = -cubie.z;
    rotated.z = cubie.y;
    // Colors: F <- U, D <- F, B <- D, U <- B
    rotated.colors.F = cubie.colors.U;
    rotated.colors.D = cubie.colors.F;
    rotated.colors.B = cubie.colors.D;
    rotated.colors.U = cubie.colors.B;
  } else if (face === 'F') {
    // Position: (x, y, z) -> (y, -x, z)
    rotated.x = cubie.y;
    rotated.y = -cubie.x;
    // Colors: R <- U, D <- R, L <- D, U <- L
    rotated.colors.R = cubie.colors.U;
    rotated.colors.D = cubie.colors.R;
    rotated.colors.L = cubie.colors.D;
    rotated.colors.U = cubie.colors.L;
  } else if (face === 'B') {
    // Position: (x, y, z) -> (-y, x, z)
    rotated.x = -cubie.y;
    rotated.y = cubie.x;
    // Colors: L <- U, D <- L, R <- D, U <- R
    rotated.colors.L = cubie.colors.U;
    rotated.colors.D = cubie.colors.L;
    rotated.colors.R = cubie.colors.D;
    rotated.colors.U = cubie.colors.R;
  } else if (face === 'M') {
    // Behaves like L (x = 0 slice)
    rotated.y = -cubie.z;
    rotated.z = cubie.y;
    rotated.colors.F = cubie.colors.U;
    rotated.colors.D = cubie.colors.F;
    rotated.colors.B = cubie.colors.D;
    rotated.colors.U = cubie.colors.B;
  } else if (face === 'E') {
    // Behaves like D (y = 0 slice)
    rotated.x = cubie.z;
    rotated.z = -cubie.x;
    rotated.colors.R = cubie.colors.F;
    rotated.colors.B = cubie.colors.R;
    rotated.colors.L = cubie.colors.B;
    rotated.colors.F = cubie.colors.L;
  } else if (face === 'S') {
    // Behaves like F (z = 0 slice)
    rotated.x = cubie.y;
    rotated.y = -cubie.x;
    rotated.colors.R = cubie.colors.U;
    rotated.colors.D = cubie.colors.R;
    rotated.colors.L = cubie.colors.D;
    rotated.colors.U = cubie.colors.L;
  }

  return rotated;
}

// Helper to check if a cubie is affected by a move on a given face
export function isCubieOnFace(cubie: Cubie, face: MoveLetter): boolean {
  if (face === 'U') return cubie.y === 1;
  if (face === 'D') return cubie.y === -1;
  if (face === 'R') return cubie.x === 1;
  if (face === 'L') return cubie.x === -1;
  if (face === 'F') return cubie.z === 1;
  if (face === 'B') return cubie.z === -1;
  if (face === 'M') return cubie.x === 0;
  if (face === 'E') return cubie.y === 0;
  if (face === 'S') return cubie.z === 0;
  return false;
}

// Core function to update state based on a notation move e.g. "R", "U'", "F2"
export function applyMove(state: Cubie[], moveStr: string): Cubie[] {
  const cleanMove = moveStr.trim();
  if (!cleanMove) return state;

  const face = cleanMove[0] as MoveLetter;
  const isPrime = cleanMove.includes("'");
  const isDouble = cleanMove.includes('2');

  let iterations = 1;
  if (isPrime) iterations = 3; // 3 CW turns = 1 CCW turn
  else if (isDouble) iterations = 2; // 2 CW turns = double turn

  let currentState = [...state];

  for (let i = 0; i < iterations; i++) {
    currentState = currentState.map((cubie) => {
      if (isCubieOnFace(cubie, face)) {
        return rotateCubieCW(cubie, face);
      }
      return cubie;
    });
  }

  return currentState;
}


// Generate a random 20-move WCA scramble sequence, avoiding consecutive repeats on same face
export function generateScramble(): string[] {
  const faces: FaceLetter[] = ['U', 'D', 'R', 'L', 'F', 'B'];
  const modifiers = ['', "'", '2'];
  const scramble: string[] = [];

  let lastFace: FaceLetter | null = null;
  let secondLastFace: FaceLetter | null = null;

  for (let i = 0; i < 20; i++) {
    let chosenFace: FaceLetter;
    do {
      chosenFace = faces[Math.floor(Math.random() * faces.length)];
    } while (
      chosenFace === lastFace ||
      (secondLastFace && chosenFace === secondLastFace && areOppositeFaces(chosenFace, lastFace!))
    );

    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    scramble.push(`${chosenFace}${modifier}`);

    secondLastFace = lastFace;
    lastFace = chosenFace;
  }

  return scramble;
}

function areOppositeFaces(f1: FaceLetter, f2: FaceLetter): boolean {
  return (
    (f1 === 'U' && f2 === 'D') ||
    (f1 === 'D' && f2 === 'U') ||
    (f1 === 'R' && f2 === 'L') ||
    (f1 === 'L' && f2 === 'R') ||
    (f1 === 'F' && f2 === 'B') ||
    (f1 === 'B' && f2 === 'F')
  );
}

// Parse notation list strings like "R U R' U'" into list of clean moves
export function parseNotation(notation: string): string[] {
  return notation
    .split(/\s+/)
    .map((m) => m.trim())
    .filter((m) => m.length > 0);
}
