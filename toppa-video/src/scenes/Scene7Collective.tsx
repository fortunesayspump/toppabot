import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { COLORS, FONTS, SHADOWS } from "../constants";
import { Breathing } from "../components/Breathing";

export const Scene7Collective: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const panX = interpolate(frame, [0, durationInFrames], [0, -60]);
  const opacity = interpolate(frame, 
    [0, 60, durationInFrames - 60, durationInFrames], 
    [0, 1, 1, 0]
  );
  
  // Bridge In (Unfold from S6)
  const bridgeIn = spring({ frame, fps, config: { damping: 15 } });
  const entranceY = interpolate(bridgeIn, [0, 1], [-200, 0]);
  const entranceScaleY = interpolate(bridgeIn, [0, 1], [2, 1]);

  const entrance = spring({ frame, fps, config: { damping: 12 } });

  const votes = [
    { label: "Treasury Allocation", pct: 78 },
    { label: "Community Grant", pct: 92 },
    { label: "Security Audit", pct: 64 },
  ];

  return (
    <AbsoluteFill style={{ opacity }}>
      
      <AbsoluteFill style={{ 
        transform: `translateX(${panX}px) translateY(${entranceY}px) scaleY(${entranceScaleY})`, 
        display: 'flex', 
        width: '115%' 
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
          padding: '0 10%',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '60px', opacity: entrance }}>
            <h2 style={{ fontFamily: FONTS.main, fontWeight: 800, fontSize: '70px', color: COLORS.slate }}>
              Collective <span style={{ color: COLORS.orange }}>Treasury</span>
            </h2>
          </div>

          <div style={{ width: '1000px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {votes.map((vote, i) => {
              const rowEntrance = spring({ frame: frame - (i * 15), fps, config: { damping: 14 } });
              return (
                <Breathing key={vote.label} intensity={10} offset={i * 20}>
                  <div style={{
                    background: 'white',
                    padding: '35px 50px',
                    borderRadius: '25px',
                    boxShadow: SHADOWS.premium,
                    transform: `scale(${rowEntrance})`,
                    opacity: rowEntrance,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <span style={{ fontFamily: FONTS.main, fontWeight: 800, fontSize: '28px', color: COLORS.slate }}>{vote.label}</span>
                      <span style={{ fontFamily: FONTS.main, fontWeight: 800, fontSize: '28px', color: COLORS.orange }}>{vote.pct}%</span>
                    </div>
                    <div style={{ height: '16px', background: COLORS.bgAlt, borderRadius: '8px', overflow: 'hidden' }}>
                      <div style={{ 
                        height: '100%', 
                        background: COLORS.orange, 
                        width: `${vote.pct}%`,
                        transform: `translateX(${(1 - rowEntrance) * -100}%)`,
                      }} />
                    </div>
                  </div>
                </Breathing>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
