import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

type CameraProps = {
  children: React.ReactNode;
  // Subtle zoom: start and end scale (e.g., 1 -> 1.06 for slow zoom in)
  zoomFrom?: number;
  zoomTo?: number;
  // Pan offset in px over the scene duration
  panX?: number;
  panY?: number;
  // Easing
  easing?: (t: number) => number;
};

/**
 * Wraps a scene with subtle Ken Burns-style camera movement
 * (slow zoom + pan) that makes static scenes feel alive.
 */
export const Camera: React.FC<CameraProps> = ({
  children,
  zoomFrom = 1,
  zoomTo = 1.04,
  panX = 0,
  panY = 0,
  easing = Easing.linear,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

  const scale = interpolate(progress, [0, 1], [zoomFrom, zoomTo]);
  const tx = interpolate(progress, [0, 1], [0, panX]);
  const ty = interpolate(progress, [0, 1], [0, panY]);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
          transformOrigin: "center center",
          willChange: "transform",
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
