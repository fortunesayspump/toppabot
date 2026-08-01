import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

type AnimProps = { className?: string };

// ─── ANIMATED RINGS ────────────────────────────────
// Concentric pulsing rings that expand from center (behind logo, etc.)

export const AnimatedRings: React.FC<AnimProps & {
  color?: string;
  count?: number;
  maxRadius?: number;
  speed?: number;
}> = ({ color = "rgba(255,165,51,0.1)", count = 4, maxRadius = 500, speed = 0.012 }) => {
  const frame = useCurrentFrame();

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {Array.from({ length: count }, (_, i) => {
        const phase = (frame * speed + i / count) % 1;
        const radius = phase * maxRadius;
        const opacity = interpolate(phase, [0, 0.2, 0.7, 1], [0, 0.5, 0.2, 0]);

        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: radius * 2,
              height: radius * 2,
              border: `1.5px solid ${color}`,
              opacity,
            }}
          />
        );
      })}
    </div>
  );
};

// ─── FLOWING DOTS ──────────────────────────────────
// Particles that drift across the screen

export const FlowingDots: React.FC<AnimProps & {
  count?: number;
  color?: string;
  direction?: "left" | "right" | "up";
}> = ({ count = 20, color = "rgba(255,165,51,0.08)", direction = "right" }) => {
  const frame = useCurrentFrame();

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: count }, (_, i) => {
        const seed = i * 137.5;
        const baseX = seed % 100;
        const baseY = (seed * 2.3) % 100;
        const size = 3 + (i % 4) * 2;
        const spd = 0.2 + (i % 5) * 0.12;

        let x = baseX;
        let y = baseY;

        if (direction === "right") {
          x = (baseX + frame * spd * 0.08) % 110 - 5;
          y = baseY + Math.sin(frame * 0.02 + i) * 4;
        } else if (direction === "left") {
          x = ((baseX - frame * spd * 0.08) % 110 + 110) % 110 - 5;
          y = baseY + Math.sin(frame * 0.02 + i) * 4;
        } else {
          x = baseX + Math.sin(frame * 0.015 + i) * 3;
          y = ((baseY - frame * spd * 0.08) % 110 + 110) % 110 - 5;
        }

        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{ width: size, height: size, backgroundColor: color, left: `${x}%`, top: `${y}%` }}
          />
        );
      })}
    </div>
  );
};

// ─── GRID DOTS ─────────────────────────────────────
// Pulsing dot matrix — great for tech / dark scenes

export const GridDots: React.FC<AnimProps & {
  rows?: number;
  cols?: number;
  color?: string;
  gap?: number;
}> = ({ rows = 8, cols = 12, color = "rgba(255,165,51,0.06)", gap = 55 }) => {
  const frame = useCurrentFrame();

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {Array.from({ length: rows * cols }, (_, idx) => {
        const row = Math.floor(idx / cols);
        const col = idx % cols;
        const cx = (col - cols / 2) * gap;
        const cy = (row - rows / 2) * gap;
        const dist = Math.sqrt(cx * cx + cy * cy);
        const wave = Math.sin(frame * 0.03 - dist * 0.005);
        const size = 3 + wave * 1.5;

        return (
          <div
            key={idx}
            className="absolute rounded-full"
            style={{
              width: Math.max(2, size),
              height: Math.max(2, size),
              backgroundColor: color,
              left: `calc(50% + ${cx}px)`,
              top: `calc(50% + ${cy}px)`,
              opacity: 0.2 + wave * 0.15,
            }}
          />
        );
      })}
    </div>
  );
};

// ─── CONFETTI BURST ────────────────────────────────
// Code-based confetti explosion (no Lottie needed)

export const Confetti: React.FC<{
  startFrame?: number;
  count?: number;
  spread?: number;
  colors?: string[];
}> = ({
  startFrame = 0,
  count = 40,
  spread = 250,
  colors = ["#FFA533", "#E8901A", "#16A34A", "#3B82F6", "#F43F5E", "#8B5CF6", "#FBBF24"],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame) return null;
  const t = frame - startFrame;

  const burst = spring({ frame: t, fps, config: { damping: 25, mass: 0.4 } });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + i * 0.7;
        const velocity = spread * (0.5 + (i % 5) * 0.12);
        const rotSpeed = (i % 2 === 0 ? 1 : -1) * (4 + (i % 5));

        const x = Math.cos(angle) * velocity * burst * (t * 0.012);
        const y = Math.sin(angle) * velocity * burst * (t * 0.012) + 0.35 * t * t * 0.015;

        const opacity = interpolate(t, [0, 10, 50, 75], [0, 1, 0.8, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const size = 5 + (i % 4) * 3;
        const isCircle = i % 3 === 0;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "45%",
              width: isCircle ? size : size * 0.35,
              height: isCircle ? size : size * 1.2,
              backgroundColor: colors[i % colors.length],
              borderRadius: isCircle ? "50%" : 2,
              transform: `translate(${x}px, ${y}px) rotate(${t * rotSpeed}deg)`,
              opacity,
            }}
          />
        );
      })}
    </div>
  );
};

// ─── STROKE REVEAL ─────────────────────────────────
// SVG path that draws itself

export const StrokeReveal: React.FC<{
  d: string;
  color?: string;
  strokeWidth?: number;
  delay?: number;
  duration?: number;
  width?: number;
  height?: number;
}> = ({ d, color = "#FFA533", strokeWidth = 2, delay = 0, duration = 40, width = 200, height = 200 }) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const len = 1000;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="pointer-events-none">
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - progress)}
      />
    </svg>
  );
};

// ─── SCAN LINE ─────────────────────────────────────
// Horizontal scanning line effect

export const ScanLine: React.FC<{
  color?: string;
  speed?: number;
  glowSize?: number;
}> = ({ color = "#FFA533", speed = 0.008, glowSize = 30 }) => {
  const frame = useCurrentFrame();

  const y = (frame * speed * 100) % 120 - 10;
  const opacity = interpolate(y, [-10, 0, 100, 110], [0, 0.6, 0.6, 0]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute left-0 w-full"
        style={{
          height: 2,
          top: `${y}%`,
          backgroundColor: color,
          boxShadow: `0 0 ${glowSize}px ${glowSize / 2}px ${color}40`,
          opacity,
        }}
      />
    </div>
  );
};

// ─── DATA STREAM ───────────────────────────────────
// Falling binary/hex characters like The Matrix (for tech scenes)

export const DataStream: React.FC<{
  columns?: number;
  color?: string;
}> = ({ columns = 15, color = "rgba(255,165,51,0.12)" }) => {
  const frame = useCurrentFrame();
  const chars = "0123456789ABCDEF";

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden font-mono text-[10px]" style={{ color }}>
      {Array.from({ length: columns }, (_, col) => {
        const x = (col / columns) * 100;
        const speed = 0.6 + (col % 4) * 0.3;
        const offset = col * 47;

        return Array.from({ length: 12 }, (_, row) => {
          const baseY = (row * 9 + frame * speed + offset) % 130 - 15;
          const charIdx = Math.floor((frame * 0.3 + row * 7 + col * 13) % chars.length);
          const opacity = interpolate(baseY, [-15, 0, 90, 110], [0, 0.8, 0.8, 0]);

          return (
            <div
              key={`${col}-${row}`}
              className="absolute font-bold"
              style={{ left: `${x}%`, top: `${baseY}%`, opacity }}
            >
              {chars[charIdx]}
            </div>
          );
        });
      })}
    </div>
  );
};
