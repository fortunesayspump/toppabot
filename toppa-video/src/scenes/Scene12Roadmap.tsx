import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { COLORS, FONTS, SHADOWS } from "../constants";
import { Breathing } from "../components/Breathing";

export const Scene12Roadmap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const panScale = interpolate(frame, [0, durationInFrames], [1, 1.15]);
  const opacity = interpolate(frame, 
    [0, 60, durationInFrames - 60, durationInFrames], 
    [0, 1, 1, 0]
  );
  
  // Bridge In (Reveal from S11 Safe)
  const bridgeIn = spring({ frame, fps, config: { damping: 15 } });
  const entranceScale = interpolate(bridgeIn, [0, 1], [0.1, 1]);

  // Bridge Out (Converge into Outro)
  const bridgeOut = spring({ frame: frame - (durationInFrames - 60), fps, config: { damping: 12 } });

  const milestones = ["V1: Agentic Swaps", "V2: Group Wallets", "V3: Machine APIs", "V4: AGI Payments"];

  return (
    <AbsoluteFill style={{ opacity }}>
      
      <AbsoluteFill style={{ 
        transform: `scale(${panScale * entranceScale})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px', opacity: 1 - bridgeOut }}>
          <h2 style={{ fontFamily: FONTS.main, fontWeight: 800, fontSize: '70px', color: COLORS.slate }}>
            The <span style={{ color: COLORS.orange }}>Future</span>
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', width: '800px' }}>
          {milestones.map((ms, i) => {
            const entrance = spring({ frame: frame - (i * 12), fps, config: { damping: 14 } });
            // Morph to center
            const morphY = interpolate(bridgeOut, [0, 1], [0, -200 + (i * 100)]);
            const morphScale = interpolate(bridgeOut, [0, 1], [1, 0]);

            return (
              <Breathing key={ms} intensity={5} offset={i * 20}>
                <div style={{
                  background: 'white',
                  padding: '30px 40px',
                  borderRadius: '20px',
                  boxShadow: SHADOWS.premium,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '30px',
                  opacity: entrance * (1 - bridgeOut),
                  transform: `translateX(${(1 - entrance) * 50}px) translateY(${morphY}px) scale(${morphScale})`,
                }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: i===0?COLORS.orange:COLORS.bgAlt }} />
                  <span style={{ fontFamily: FONTS.main, fontWeight: 700, fontSize: '28px', color: COLORS.slate }}>{ms}</span>
                </div>
              </Breathing>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
