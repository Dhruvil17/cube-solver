import { WCA_COLORS } from "@/types";

const STICKER = 28;
const GAP = 3;
const FACE = STICKER * 3 + GAP * 2;
const HALF = FACE / 2;

/** Scrambled-looking sticker colors per visible face (U, F, R) */
const SCRAMBLE_U = [
  WCA_COLORS.white,
  WCA_COLORS.red,
  WCA_COLORS.blue,
  WCA_COLORS.orange,
  WCA_COLORS.yellow,
  WCA_COLORS.green,
  WCA_COLORS.white,
  WCA_COLORS.red,
  WCA_COLORS.green,
];

const SCRAMBLE_F = [
  WCA_COLORS.green,
  WCA_COLORS.white,
  WCA_COLORS.yellow,
  WCA_COLORS.blue,
  WCA_COLORS.red,
  WCA_COLORS.orange,
  WCA_COLORS.green,
  WCA_COLORS.white,
  WCA_COLORS.blue,
];

const SCRAMBLE_R = [
  WCA_COLORS.red,
  WCA_COLORS.yellow,
  WCA_COLORS.orange,
  WCA_COLORS.white,
  WCA_COLORS.blue,
  WCA_COLORS.green,
  WCA_COLORS.red,
  WCA_COLORS.orange,
  WCA_COLORS.yellow,
];

function FaceGrid({ colors }: { colors: string[] }) {
  return (
    <div
      className="grid grid-cols-3 gap-[3px] rounded-sm bg-black/40 p-[3px]"
      style={{ width: FACE, height: FACE }}
    >
      {colors.map((color, i) => (
        <div
          key={i}
          className="rounded-[3px] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_2px_4px_rgba(0,0,0,0.35)]"
          style={{
            width: STICKER,
            height: STICKER,
            backgroundColor: color,
          }}
        />
      ))}
    </div>
  );
}

type CubePreviewGraphicProps = {
  size?: "sm" | "lg";
  className?: string;
};

/**
 * Decorative isometric cube — marketing preview only (not the interactive engine).
 * Shows a scrambled, colorful cube so users never see a blank white face.
 */
export function CubePreviewGraphic({
  size = "sm",
  className = "",
}: CubePreviewGraphicProps) {
  const scale = size === "lg" ? 1.35 : 1;

  return (
    <div
      className={`cube-preview-float relative flex items-center justify-center ${className}`}
      aria-hidden
    >
      <div
        className="absolute inset-0 rounded-full bg-cube-accent/10 blur-3xl"
        style={{ transform: "scale(0.85)" }}
      />
      <div
        style={{
          perspective: 900,
          transform: `scale(${scale})`,
        }}
      >
        <div
          className="relative"
          style={{
            width: FACE,
            height: FACE,
            transformStyle: "preserve-3d",
            transform: "rotateX(-28deg) rotateY(-38deg)",
          }}
        >
          <div
            className="absolute left-0 top-0"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(90deg) translateZ(${HALF}px)`,
            }}
          >
            <FaceGrid colors={SCRAMBLE_U} />
          </div>
          <div
            className="absolute left-0 top-0"
            style={{
              transformStyle: "preserve-3d",
              transform: `translateZ(${HALF}px)`,
            }}
          >
            <FaceGrid colors={SCRAMBLE_F} />
          </div>
          <div
            className="absolute left-0 top-0"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateY(90deg) translateZ(${HALF}px)`,
            }}
          >
            <FaceGrid colors={SCRAMBLE_R} />
          </div>
        </div>
      </div>
    </div>
  );
}
