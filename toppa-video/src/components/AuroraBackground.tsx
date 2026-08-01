import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../constants";

export const AuroraBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Faster drift for "Motion Design" feel
  const drift = (offset: number, speed = 40, range = 80) => {
    return Math.sin((frame + offset) / speed) * range;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgAlt, overflow: 'hidden' }}>
      {/* Background Blobs */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '800px',
          height: '800px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.orange} 0%, transparent 70%)`,
          filter: 'blur(150px)',
          opacity: 0.2,
          transform: `translate(${drift(0, 50, 100)}px, ${drift(100, 70, 120)}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          left: '-10%',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.slate} 0%, transparent 70%)`,
          filter: 'blur(120px)',
          opacity: 0.12,
          transform: `translate(${drift(200, 60, 100)}px, ${drift(300, 80, 120)}px)`,
        }}
      />

      {/* Cinematic Grain Overlay (Very subtle) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.03,
        backgroundImage: `url("https://www.transparenttextures.com/patterns/p6.png")`,
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};
