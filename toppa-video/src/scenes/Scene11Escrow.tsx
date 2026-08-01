import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { COLORS, FONTS, SHADOWS } from "../constants";
import { Breathing } from "../components/Breathing";

export const Scene11Escrow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const panScale = interpolate(frame, [0, durationInFrames], [1, 1.1]);
  const opacity = interpolate(frame, 
    [0, 60, durationInFrames - 60, durationInFrames], 
    [0, 1, 1, 0]
  );
  
  // Bridge In (Slide in from S10)
  const bridgeIn = spring({ frame, fps, config: { damping: 15 } });
  const entranceX = interpolate(bridgeIn, [0, 1], [-800, 0]);

  const entrance = spring({ frame, fps, config: { damping: 12, mass: 0.8 } });

  // Bridge Out (Safe Open into S12)
  const bridgeOut = spring({ frame: frame - (durationInFrames - 60), fps, config: { damping: 12 } });
  const safeOpen = interpolate(bridgeOut, [0, 1], [0, 90]);

  return (
    <AbsoluteFill style={{ opacity }}>
      
      <AbsoluteFill style={{ 
        transform: `scale(${panScale}) translateX(${entranceX}px)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px', opacity: entrance }}>
          <h2 style={{ fontFamily: FONTS.main, fontWeight: 800, fontSize: '70px', color: COLORS.slate }}>
            Trustless <span style={{ color: COLORS.orange }}>Escrow</span>
          </h2>
        </div>

        <Breathing intensity={10} speed={80}>
          <div style={{
            width: '500px',
            height: '500px',
            background: COLORS.slate,
            borderRadius: '40px',
            boxShadow: SHADOWS.premium,
            position: 'relative',
            perspective: '2000px',
          }}>
            {/* Safe Door Bridge */}
            <div style={{
              position: 'absolute',
              inset: '20px',
              background: '#334155',
              borderRadius: '20px',
              border: '6px solid rgba(255,255,255,0.1)',
              transformOrigin: 'left',
              transform: `rotateY(-${safeOpen}deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}>
               <div style={{ width: '120px', height: '120px', border: '10px solid rgba(255,255,255,0.2)', borderRadius: '50%' }} />
            </div>

            {/* Contents (revealed when door opens) */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 5,
            }}>
               <div style={{ fontFamily: FONTS.main, fontWeight: 800, color: COLORS.orange, fontSize: '40px' }}>SECURED</div>
            </div>
          </div>
        </Breathing>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
