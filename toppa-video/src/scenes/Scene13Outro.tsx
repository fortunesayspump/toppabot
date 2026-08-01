import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate, Img } from "remotion";
import { COLORS, FONTS, SHADOWS } from "../constants";
import { Breathing } from "../components/Breathing";

export const Scene13Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const panScale = interpolate(frame, [0, durationInFrames], [1, 1.1]);
  const opacity = interpolate(frame, [0, 60], [0, 1]); // No fade out for outro
  
  // Bridge In (Explode from S12 convergence)
  const bridgeIn = spring({ frame, fps, config: { damping: 12 } });
  const entranceScale = interpolate(bridgeIn, [0, 1], [0, 1]);
  const entranceRotate = interpolate(bridgeIn, [0, 1], [45, 0]);

  const entrance = spring({ frame: frame - 20, fps, config: { damping: 10 } });
  
  return (
    <AbsoluteFill className="items-center justify-center" style={{ opacity }}>
      
      <AbsoluteFill style={{ 
        transform: `scale(${panScale})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Breathing intensity={15} speed={60}>
          <div style={{
            width: '240px',
            height: '240px',
            borderRadius: '40px',
            overflow: 'hidden',
            boxShadow: SHADOWS.premium,
            transform: `scale(${entranceScale}) rotate(${entranceRotate}deg)`,
            backgroundColor: COLORS.orange,
          }}>
             <Img src="/toppa-project-pfp.png" style={{ width: '100%' }} />
          </div>
        </Breathing>

        <h1 style={{ 
          fontFamily: FONTS.main, 
          fontWeight: 800, 
          fontSize: '90px', 
          color: COLORS.slate, 
          marginTop: '40px', 
          opacity: entrance,
          transform: `scale(${entrance})`,
        }}>
          Toppa
        </h1>

        <div style={{
          marginTop: '40px',
          background: COLORS.slate,
          padding: '25px 60px',
          borderRadius: '50px',
          boxShadow: SHADOWS.premium,
          opacity: entrance,
          transform: `translateY(${(1 - entrance) * 50}px)`,
        }}>
          <span style={{ fontFamily: FONTS.main, fontWeight: 800, fontSize: '32px', color: 'white' }}>
            Try Toppa Now
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
