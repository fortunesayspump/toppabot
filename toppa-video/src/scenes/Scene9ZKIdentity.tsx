import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { COLORS, FONTS, SHADOWS } from "../constants";
import { Breathing } from "../components/Breathing";

export const Scene9ZKIdentity: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Cinematic Zoom Out
  const panScale = interpolate(frame, [0, durationInFrames], [1.2, 1]);
  const opacity = interpolate(frame, 
    [0, 60, durationInFrames - 60, durationInFrames], 
    [0, 1, 1, 0]
  );
  
  // Bridge In (Expand from S8 collapse)
  const bridgeIn = spring({ frame, fps, config: { damping: 12 } });
  const shieldScale = interpolate(bridgeIn, [0, 1], [0, 1]);
  const shieldRotate = interpolate(bridgeIn, [0, 1], [-45, 0]);

  const entrance = spring({ frame, fps, config: { damping: 15 } });

  return (
    <AbsoluteFill style={{ opacity }}>
      
      <AbsoluteFill style={{ 
        transform: `scale(${panScale})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Breathing intensity={15} rotateIntensity={2}>
          <div style={{
            width: '400px',
            height: '500px',
            background: COLORS.slate,
            borderRadius: '40px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: SHADOWS.premium,
            transform: `scale(${shieldScale}) rotate(${shieldRotate}deg)`,
          }}>
             {/* Security Shield Icon */}
             <div style={{
               width: '200px',
               height: '240px',
               border: '15px solid white',
               borderRadius: '30px 30px 100px 100px',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               opacity: entrance,
             }}>
                <div style={{ width: '60px', height: '60px', background: COLORS.orange, borderRadius: '50%' }} />
             </div>
          </div>
        </Breathing>

        <div style={{
          marginTop: '60px',
          textAlign: 'center',
          opacity: entrance,
          transform: `translateY(${(1 - entrance) * 40}px)`,
        }}>
          <h2 style={{ fontFamily: FONTS.main, fontWeight: 800, fontSize: '70px', color: COLORS.slate }}>
            ZK <span style={{ color: COLORS.orange }}>Identity</span>
          </h2>
          <p style={{ fontFamily: FONTS.main, fontSize: '30px', color: COLORS.text3 }}>Verify without disclosing.</p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
