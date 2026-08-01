import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate, Img } from "remotion";
import { COLORS, FONTS, SHADOWS } from "../constants";
import { Breathing } from "../components/Breathing";

export const Scene1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Cinematic Pan/Scale (Continuous momentum)
  const panScale = interpolate(frame, [0, durationInFrames], [1, 1.2]);
  const opacity = interpolate(frame, [durationInFrames - 60, durationInFrames], [1, 0]); // Fade out for overlap

  // Bridge Animation (Fly to top-left for Scene 2)
  const logoFly = spring({ frame: frame - (durationInFrames - 60), fps, config: { damping: 12 } });
  const logoX = interpolate(logoFly, [0, 1], [0, -400]);
  const logoY = interpolate(logoFly, [0, 1], [0, -300]);
  const logoScale = interpolate(logoFly, [0, 1], [1, 0.4]);

  const entrance = spring({ frame, fps, config: { damping: 10, mass: 0.5, stiffness: 100 } });
  const scale = interpolate(entrance, [0, 1], [0.5, 1]);
  const rotateY = interpolate(entrance, [0, 1], [45, 0]);
  
  const textEntrance = spring({ frame: frame - 20, fps, config: { damping: 12 } });
  const textOpacity = interpolate(textEntrance, [0, 1], [0, 1]);

  return (
    <AbsoluteFill className="items-center justify-center" style={{ opacity }}>
      
      <AbsoluteFill style={{ 
        transform: `scale(${panScale})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          perspective: '1000px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Breathing intensity={10} speed={80}>
            <div style={{
              transform: `scale(${scale * logoScale}) rotateY(${rotateY}deg) translate(${logoX}px, ${logoY}px)`,
              boxShadow: SHADOWS.premium,
              borderRadius: '40px',
              overflow: 'hidden',
              backgroundColor: COLORS.orange,
              width: '280px',
              height: '280px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Img 
                src="/toppa-project-pfp.png" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </Breathing>

          <div style={{
            marginTop: '60px',
            textAlign: 'center',
            opacity: textOpacity,
            transform: `translateY(${(1 - textEntrance) * 20}px)`,
          }}>
            <h1 style={{
              fontFamily: FONTS.main,
              fontWeight: 800,
              fontSize: '110px',
              color: COLORS.slate,
              margin: 0,
              letterSpacing: '-2px',
            }}>
              Toppa
            </h1>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
