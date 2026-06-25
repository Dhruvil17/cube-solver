/** WCA standard face colors (hex) — used by the 3D cube in Phase 1 */
export const WCA_COLORS = {
  white: "#ffffff",
  yellow: "#ffd500",
  green: "#009b48",
  blue: "#0046ad",
  red: "#b71234",
  orange: "#ff5800",
} as const;

export type FaceColor = keyof typeof WCA_COLORS;

/** Standard cube move faces */
export type MoveFace = "U" | "D" | "L" | "R" | "F" | "B";

export interface CubeMove {
  face: MoveFace;
  prime: boolean;
  double: boolean;
}
