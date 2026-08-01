import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { COLORS, FONTS } from "../constants";

export const Scene8InstantSettle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Cinematic Zoom In
  const panScale = interpolate(frame, [0, durationInFrames], [1, 1.2]);
  const opacity = interpolate(frame, 
    [0, 60, durationInFrames - 60, durationInFrames], 
    [0, 1, 1, 0]
  );
  
  // Bridge In (Stretching bars from S7)
  const bridgeIn = spring({ frame, fps, config: { damping: 15 } });
  const barScaleY = interpolate(bridgeIn, [0, 1], [4, 1]);
  const barOpacity = interpolate(bridgeIn, [0, 0.5], [0, 0.1]);

  // Bridge Out (Collapse into S9)
  const bridgeOut = spring({ frame: frame - (durationInFrames - 60), fps, config: { damping: 12 } });
  const collapseScale = interpolate(bridgeOut, [0, 1], [1, 0]);
  const collapseRotate = interpolate(bridgeOut, [0, 1], [0, 45]);

  const words = ["ASSET-AGNOSTIC", "ZERO GAS", "INSTANT", "SECURE"];

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Background Bars Bridge */}
      <AbsoluteFill style={{ opacity: barOpacity }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', height: '100%', width: '100%', transform: `scaleY(${barScaleY})` }}>
          {[1,2,3].map(i => <div key={i} style={{ height: '33%', width: '100%', background: 'white' }} />)}
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ 
        transform: `scale(${panScale * collapseScale}) rotate(${collapseRotate}deg)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          alignItems: 'center',
        }}>
          {words.map((word, i) => {
            const entrance = spring({ frame: frame - (i * 15), fps, config: { damping: 12, mass: 0.5 } });
            const s = interpolate(entrance, [0, 1], [4, 1]);
            const o = interpolate(entrance, [0, 1], [0, 1]);
            const b = interpolate(entrance, [0, 1], [20, 0]);

            return (
              <div key={word} style={{
                fontFamily: FONTS.main,
                fontWeight: 900,
                fontSize: '120px',
                color: i % 2 === 0 ? 'white' : COLORS.orange,
                opacity: o,
                transform: `scale(${s})`,
                filter: `blur(${b}px)`,
                lineHeight: 0.8,
                letterSpacing: '-5px',
              }}>
                {word}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
