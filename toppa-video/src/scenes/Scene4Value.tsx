import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { COLORS, FONTS, SHADOWS } from "../constants";
import { Breathing } from "../components/Breathing";

export const Scene4Value: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const panScale = interpolate(frame, [0, durationInFrames], [1, 1.15]);
  const opacity = interpolate(frame, 
    [0, 60, durationInFrames - 60, durationInFrames], 
    [0, 1, 1, 0]
  );
  const entrance = spring({ frame, fps, config: { damping: 10, mass: 0.5 } });
  
  // Bridge Out (Stack into phone shape for S5)
  const bridgeOut = spring({ frame: frame - (durationInFrames - 60), fps, config: { damping: 12 } });
  const stackTranslateY = interpolate(bridgeOut, [0, 1], [0, 200]);
  const stackScale = interpolate(bridgeOut, [0, 1], [1, 0.5]);

  
  const chips = [
    { label: "METHOD: POST", color: COLORS.slate },
    { label: "STATUS: 402 PAYMENT REQUIRED", color: COLORS.orange },
    { label: "CURRENCY: USDC", color: COLORS.slate },
    { label: "CHAIN: CELO", color: COLORS.orange },
  ];

  return (
    <AbsoluteFill style={{ opacity }}>
      
      <AbsoluteFill style={{ 
        transform: `scale(${panScale})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          position: 'absolute',
          top: '12%',
          textAlign: 'center',
          opacity: entrance,
        }}>
          <h2 style={{ fontFamily: FONTS.main, fontWeight: 800, fontSize: '60px', color: COLORS.slate }}>
            Instant <span style={{ color: COLORS.orange }}>Settlement</span>
          </h2>
        </div>

        <div style={{
          width: '80%',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          perspective: '1000px',
          transform: `translateY(${stackTranslateY}px) scale(${stackScale})`,
        }}>
          {chips.map((chip, i) => {
            const rowEntrance = spring({ frame: frame - (i * 10), fps, config: { damping: 12 } });
            return (
              <Breathing key={chip.label} intensity={8} offset={i * 20} speed={70}>
                <div style={{
                  background: chip.color,
                  padding: '30px 50px',
                  borderRadius: '20px',
                  boxShadow: SHADOWS.premium,
                  opacity: rowEntrance,
                  transform: `translateX(${(1 - rowEntrance) * 100}px) rotateY(-5deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <span style={{ 
                    fontFamily: FONTS.main, 
                    fontWeight: 800, 
                    fontSize: '32px', 
                    color: 'white',
                    letterSpacing: '2px'
                  }}>
                    {chip.label}
                  </span>
                </div>
              </Breathing>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
