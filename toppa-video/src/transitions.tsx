import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";

// ─── ZOOM PUNCH ─────────────────────────────────────────
// Outgoing scene SNAPS back with scale + blur, incoming PUNCHES forward

type ZoomPunchProps = Record<string, never>;

const ZoomPunchComponent: React.FC<TransitionPresentationComponentProps<ZoomPunchProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
}) => {
  const isEntering = presentationDirection === "entering";
  const p = presentationProgress;

  if (!isEntering) {
    const scale = interpolate(p, [0, 1], [1, 0.4], { easing: Easing.bezier(0.76, 0, 0.24, 1) });
    const opacity = interpolate(p, [0.3, 0.8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const blur = interpolate(p, [0, 1], [0, 12]);
    return (
      <AbsoluteFill style={{ transform: `scale(${scale})`, opacity, filter: `blur(${blur}px)` }}>
        {children}
      </AbsoluteFill>
    );
  }

  const scale = interpolate(p, [0, 0.6, 1], [1.8, 0.97, 1], { easing: Easing.bezier(0.22, 1, 0.36, 1) });
  const opacity = interpolate(p, [0, 0.15], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})`, opacity }}>
      {children}
    </AbsoluteFill>
  );
};

export const zoomPunch = (): TransitionPresentation<ZoomPunchProps> => ({
  component: ZoomPunchComponent,
  props: {},
});


// ─── DOLLY ZOOM ─────────────────────────────────────────
// Camera pushes forward (scale up) while scene recedes (translateZ)

type DollyZoomProps = { direction?: "in" | "out" };

const DollyZoomComponent: React.FC<TransitionPresentationComponentProps<DollyZoomProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const dir = passedProps.direction ?? "in";
  const isEntering = presentationDirection === "entering";
  const p = presentationProgress;

  if (dir === "in") {
    if (!isEntering) {
      const scale = interpolate(p, [0, 1], [1, 2.5], { easing: Easing.bezier(0.45, 0, 0.55, 1) });
      const opacity = interpolate(p, [0.4, 0.9], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return (
        <AbsoluteFill style={{ perspective: 800 }}>
          <AbsoluteFill style={{ transform: `scale(${scale})`, opacity, transformOrigin: "center center" }}>
            {children}
          </AbsoluteFill>
        </AbsoluteFill>
      );
    }
    const scale = interpolate(p, [0, 1], [0.3, 1], { easing: Easing.bezier(0.16, 1, 0.3, 1) });
    const opacity = interpolate(p, [0, 0.2], [0, 1], { extrapolateRight: "clamp" });
    return (
      <AbsoluteFill style={{ transform: `scale(${scale})`, opacity }}>
        {children}
      </AbsoluteFill>
    );
  }

  // "out" direction — reverse
  if (!isEntering) {
    const scale = interpolate(p, [0, 1], [1, 0.3], { easing: Easing.bezier(0.45, 0, 0.55, 1) });
    const opacity = interpolate(p, [0.5, 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
      <AbsoluteFill style={{ transform: `scale(${scale})`, opacity }}>
        {children}
      </AbsoluteFill>
    );
  }
  const scale = interpolate(p, [0, 1], [2.5, 1], { easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const opacity = interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ perspective: 800 }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, opacity, transformOrigin: "center center" }}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const dollyZoom = (props: DollyZoomProps = {}): TransitionPresentation<DollyZoomProps> => ({
  component: DollyZoomComponent,
  props,
});


// ─── 3D CUBE FLIP ───────────────────────────────────────
// True 3D cube rotation with perspective

type CubeFlipProps = { direction?: "left" | "right" | "up" | "down" };

const CubeFlipComponent: React.FC<TransitionPresentationComponentProps<CubeFlipProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const dir = passedProps.direction ?? "left";
  const isEntering = presentationDirection === "entering";
  const p = presentationProgress;

  const isHorizontal = dir === "left" || dir === "right";
  const sign = (dir === "left" || dir === "up") ? -1 : 1;

  const exitAngle = sign * 90;
  const enterAngle = -sign * 90;

  const angle = isEntering
    ? interpolate(p, [0, 1], [enterAngle, 0], { easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) })
    : interpolate(p, [0, 1], [0, exitAngle], { easing: Easing.bezier(0.55, 0.06, 0.68, 0.19) });

  const translateZ = -180;
  const rotateAxis = isHorizontal ? "rotateY" : "rotateX";

  const opacity = isEntering
    ? interpolate(p, [0, 0.5], [0.2, 1], { extrapolateRight: "clamp" })
    : interpolate(p, [0.5, 1], [1, 0.2], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ perspective: 1200, perspectiveOrigin: "50% 50%" }}>
      <AbsoluteFill
        style={{
          transform: `translateZ(${translateZ}px) ${rotateAxis}(${angle}deg)`,
          transformOrigin: "center center",
          backfaceVisibility: "hidden",
          opacity,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const cubeFlip = (props: CubeFlipProps = {}): TransitionPresentation<CubeFlipProps> => ({
  component: CubeFlipComponent,
  props,
});


// ─── DIAGONAL REVEAL ────────────────────────────────────
// Dark panel sweeps diagonally, revealing the next scene

type DiagonalRevealProps = { color?: string };

const DiagonalRevealComponent: React.FC<TransitionPresentationComponentProps<DiagonalRevealProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const isEntering = presentationDirection === "entering";
  const p = presentationProgress;
  const color = passedProps.color ?? "#0F172A";

  if (!isEntering) {
    // Exiting scene fades under the wipe
    const opacity = interpolate(p, [0, 0.5], [1, 0], { extrapolateRight: "clamp" });
    return (
      <AbsoluteFill style={{ opacity }}>
        {children}
      </AbsoluteFill>
    );
  }

  // The diagonal wipe mask using clip-path
  const progress = interpolate(p, [0, 1], [-20, 120], { easing: Easing.bezier(0.76, 0, 0.24, 1) });

  return (
    <AbsoluteFill>
      {/* Dark panel sweeping across */}
      <AbsoluteFill
        style={{
          backgroundColor: color,
          clipPath: `polygon(${progress - 15}% 0%, ${progress + 15}% 0%, ${progress}% 100%, ${progress - 30}% 100%)`,
          zIndex: 10,
        }}
      >
        {/* Accent line */}
        <div style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: "linear-gradient(to bottom, #FFA533, #E8901A)",
          boxShadow: "0 0 20px rgba(255,165,51,0.6)",
        }} />
      </AbsoluteFill>
      {/* Entering scene — revealed from left, following the dark panel */}
      <AbsoluteFill style={{
        clipPath: `polygon(0% 0%, ${progress}% 0%, ${progress - 15}% 100%, 0% 100%)`,
        opacity: interpolate(p, [0.1, 0.35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const diagonalReveal = (props: DiagonalRevealProps = {}): TransitionPresentation<DiagonalRevealProps> => ({
  component: DiagonalRevealComponent,
  props,
});


// ─── CAMERA PAN ─────────────────────────────────────────
// Scene pans out in one direction, new scene pans in from opposite — with parallax depth

type CameraPanProps = { direction?: "left" | "right" | "up" | "down" };

const CameraPanComponent: React.FC<TransitionPresentationComponentProps<CameraPanProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const dir = passedProps.direction ?? "left";
  const isEntering = presentationDirection === "entering";
  const p = presentationProgress;

  const ease = Easing.bezier(0.25, 0.46, 0.45, 0.94);

  let translateX = 0;
  let translateY = 0;

  const isHorizontal = dir === "left" || dir === "right";
  const sign = (dir === "left" || dir === "up") ? -1 : 1;

  if (isEntering) {
    const offset = interpolate(p, [0, 1], [-sign * 110, 0], { easing: ease });
    if (isHorizontal) translateX = offset; else translateY = offset;
  } else {
    const offset = interpolate(p, [0, 1], [0, sign * 110], { easing: ease });
    if (isHorizontal) translateX = offset; else translateY = offset;
  }

  const scale = isEntering
    ? interpolate(p, [0, 0.5, 1], [0.95, 0.97, 1])
    : interpolate(p, [0, 0.5, 1], [1, 0.97, 0.95]);

  return (
    <AbsoluteFill style={{
      transform: `translate(${translateX}%, ${translateY}%) scale(${scale})`,
      willChange: "transform",
    }}>
      {children}
    </AbsoluteFill>
  );
};

export const cameraPan = (props: CameraPanProps = {}): TransitionPresentation<CameraPanProps> => ({
  component: CameraPanComponent,
  props,
});


// ─── GLITCH SLAM ────────────────────────────────────────
// Quick glitch + RGB offset + shake

type GlitchSlamProps = Record<string, never>;

const GlitchSlamComponent: React.FC<TransitionPresentationComponentProps<GlitchSlamProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
}) => {
  const isEntering = presentationDirection === "entering";
  const p = presentationProgress;

  if (!isEntering) {
    // Shake and glitch out
    const shakeX = p > 0.1 && p < 0.7 ? Math.sin(p * 80) * interpolate(p, [0, 0.5], [0, 15]) : 0;
    const skewX = p > 0.2 && p < 0.6 ? Math.sin(p * 60) * 3 : 0;
    const opacity = interpolate(p, [0.5, 0.9], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const scale = interpolate(p, [0.7, 1], [1, 0.95], { extrapolateLeft: "clamp" });
    return (
      <AbsoluteFill style={{
        transform: `translateX(${shakeX}px) skewX(${skewX}deg) scale(${scale})`,
        opacity,
      }}>
        {children}
      </AbsoluteFill>
    );
  }

  // Slam in with slight overshoot
  const scale = interpolate(p, [0, 0.4, 0.7, 1], [1.15, 1.02, 0.99, 1], { easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const opacity = interpolate(p, [0, 0.15], [0, 1], { extrapolateRight: "clamp" });
  const shakeX = p > 0.3 && p < 0.7 ? Math.sin(p * 60) * interpolate(p, [0.3, 0.7], [8, 0]) : 0;
  return (
    <AbsoluteFill style={{
      transform: `translateX(${shakeX}px) scale(${scale})`,
      opacity,
    }}>
      {children}
    </AbsoluteFill>
  );
};

export const glitchSlam = (): TransitionPresentation<GlitchSlamProps> => ({
  component: GlitchSlamComponent,
  props: {},
});


// ─── PUSH ZOOM ──────────────────────────────────────────
// Current scene pushes back like a card, new scene slides in over it

type PushZoomProps = { direction?: "from-left" | "from-right" | "from-bottom" };

const PushZoomComponent: React.FC<TransitionPresentationComponentProps<PushZoomProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const dir = passedProps.direction ?? "from-bottom";
  const isEntering = presentationDirection === "entering";
  const p = presentationProgress;

  if (!isEntering) {
    const scale = interpolate(p, [0, 1], [1, 0.9], { easing: Easing.bezier(0.45, 0, 0.55, 1) });
    const opacity = interpolate(p, [0.5, 1], [1, 0], { extrapolateLeft: "clamp" });
    const blur = interpolate(p, [0.3, 1], [0, 3], { extrapolateLeft: "clamp" });
    return (
      <AbsoluteFill style={{ transform: `scale(${scale})`, opacity, filter: `blur(${blur}px)`, borderRadius: 16, overflow: "hidden" }}>
        {children}
      </AbsoluteFill>
    );
  }

  let translateX = 0;
  let translateY = 0;
  const ease = Easing.bezier(0.16, 1, 0.3, 1);

  switch (dir) {
    case "from-left": translateX = interpolate(p, [0, 1], [-105, 0], { easing: ease }); break;
    case "from-right": translateX = interpolate(p, [0, 1], [105, 0], { easing: ease }); break;
    case "from-bottom": translateY = interpolate(p, [0, 1], [105, 0], { easing: ease }); break;
  }

  return (
    <AbsoluteFill style={{
      transform: `translate(${translateX}%, ${translateY}%)`,
      boxShadow: "-20px 0 60px rgba(0,0,0,0.15)",
    }}>
      {children}
    </AbsoluteFill>
  );
};

export const pushZoom = (props: PushZoomProps = {}): TransitionPresentation<PushZoomProps> => ({
  component: PushZoomComponent,
  props,
});


// ─── TILT 3D ────────────────────────────────────────────
// Lighter perspective rotation with depth

type Tilt3DProps = { direction?: "left" | "right" | "up" | "down" };

const Tilt3DComponent: React.FC<TransitionPresentationComponentProps<Tilt3DProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const dir = passedProps.direction ?? "left";
  const isEntering = presentationDirection === "entering";
  const p = presentationProgress;

  const isHorizontal = dir === "left" || dir === "right";
  const sign = (dir === "left" || dir === "up") ? -1 : 1;

  const rotateAxis = isHorizontal ? "rotateY" : "rotateX";
  const angle = isEntering
    ? interpolate(p, [0, 1], [sign * 35, 0], { easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) })
    : interpolate(p, [0, 1], [0, -sign * 35], { easing: Easing.bezier(0.55, 0.06, 0.68, 0.19) });

  const opacity = isEntering
    ? interpolate(p, [0, 0.25], [0, 1], { extrapolateRight: "clamp" })
    : interpolate(p, [0.7, 1], [1, 0], { extrapolateLeft: "clamp" });

  const scale = isEntering
    ? interpolate(p, [0, 1], [0.85, 1])
    : interpolate(p, [0, 1], [1, 0.85]);

  return (
    <AbsoluteFill style={{ perspective: 1000, perspectiveOrigin: "50% 50%" }}>
      <AbsoluteFill style={{
        transform: `${rotateAxis}(${angle}deg) scale(${scale})`,
        transformOrigin: "center center",
        backfaceVisibility: "hidden",
        opacity,
      }}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const tilt3d = (props: Tilt3DProps = {}): TransitionPresentation<Tilt3DProps> => ({
  component: Tilt3DComponent,
  props,
});


// ─── ZOOM (simple) ──────────────────────────────────────
// Kept for backward compat

type ZoomProps = { direction?: "in" | "out" };

const ZoomComponent: React.FC<TransitionPresentationComponentProps<ZoomProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const dir = passedProps.direction ?? "in";
  const isEntering = presentationDirection === "entering";
  const p = presentationProgress;
  const ease = Easing.bezier(0.16, 1, 0.3, 1);

  if (dir === "in") {
    if (isEntering) {
      const scale = interpolate(p, [0, 1], [0.5, 1], { easing: ease });
      const opacity = interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
      return <AbsoluteFill style={{ transform: `scale(${scale})`, opacity }}>{children}</AbsoluteFill>;
    }
    const scale = interpolate(p, [0, 1], [1, 1.6], { easing: Easing.bezier(0.45, 0, 0.55, 1) });
    const opacity = interpolate(p, [0.3, 0.8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const blur = interpolate(p, [0.3, 1], [0, 8], { extrapolateLeft: "clamp" });
    return <AbsoluteFill style={{ transform: `scale(${scale})`, opacity, filter: `blur(${blur}px)` }}>{children}</AbsoluteFill>;
  }

  // Out
  if (isEntering) {
    const scale = interpolate(p, [0, 1], [1.6, 1], { easing: ease });
    const opacity = interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
    return <AbsoluteFill style={{ transform: `scale(${scale})`, opacity }}>{children}</AbsoluteFill>;
  }
  const scale = interpolate(p, [0, 1], [1, 0.5], { easing: Easing.bezier(0.45, 0, 0.55, 1) });
  const opacity = interpolate(p, [0.3, 0.8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ transform: `scale(${scale})`, opacity }}>{children}</AbsoluteFill>;
};

export const zoom = (props: ZoomProps = {}): TransitionPresentation<ZoomProps> => ({
  component: ZoomComponent,
  props,
});
