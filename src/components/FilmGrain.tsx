const NOISE_BACKGROUND =
  "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')";

interface FilmGrainProps {
  blendMode: "overlay" | "multiply";
  zIndex: number;
}

export default function FilmGrain({ blendMode, zIndex }: FilmGrainProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex,
        pointerEvents: "none",
        opacity: 0.035,
        mixBlendMode: blendMode,
        backgroundImage: NOISE_BACKGROUND,
        backgroundSize: "160px 160px",
      }}
    />
  );
}
