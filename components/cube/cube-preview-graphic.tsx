const STICKER = 28;
const GAP = 1.2;
const FACE = STICKER * 3 + GAP * 2;
const HALF = FACE / 2;

const COLORS = {
  white: '#FFFFFF',
  yellow: '#FFD500',
  red: '#B71234',
  orange: '#FF5800',
  green: '#009B48',
  blue: '#0046AD',
};

/** Scrambled-looking sticker colors per visible face (U, F, R) */
const SCRAMBLE_U = [
  COLORS.white,
  COLORS.red,
  COLORS.blue,
  COLORS.orange,
  COLORS.yellow,
  COLORS.green,
  COLORS.white,
  COLORS.red,
  COLORS.green,
];

const SCRAMBLE_F = [
  COLORS.green,
  COLORS.white,
  COLORS.yellow,
  COLORS.blue,
  COLORS.red,
  COLORS.orange,
  COLORS.green,
  COLORS.white,
  COLORS.blue,
];

const SCRAMBLE_R = [
  COLORS.red,
  COLORS.yellow,
  COLORS.orange,
  COLORS.white,
  COLORS.blue,
  COLORS.green,
  COLORS.red,
  COLORS.orange,
  COLORS.yellow,
];

function getStickerBorderRadius(i: number): string {
  const r = "1.5px";
  if (i === 0) return `0px 0px ${r} 0px`;
  if (i === 2) return `0px 0px 0px ${r}`;
  if (i === 4) return r;
  if (i === 6) return `0px ${r} 0px 0px`;
  if (i === 8) return `${r} 0px 0px 0px`;
  return "0px";
}

function FaceGrid({ colors }: { colors: string[] }) {
  return (
    <div
      className="grid grid-cols-3 bg-[#1a1a1a]"
      style={{
        width: FACE,
        height: FACE,
        gap: GAP,
        padding: GAP,
      }}
    >
      {colors.map((color, i) => (
        <div
          key={i}
          style={{
            width: STICKER,
            height: STICKER,
            backgroundColor: color,
            borderRadius: getStickerBorderRadius(i),
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
