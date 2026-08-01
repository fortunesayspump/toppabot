import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate, Img } from "remotion";
import { COLORS, FONTS, SHADOWS } from "../constants";
import { Breathing } from "../components/Breathing";

export const Scene2Everywhere: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Cinematic Slow Lateral Drift
  const panX = interpolate(frame, [0, durationInFrames], [0, -40]);
  const opacity = interpolate(frame, 
    [0, 60, durationInFrames - 60, durationInFrames], 
    [0, 1, 1, 0]
  );

  const entrance = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
  const icon1 = spring({ frame: frame - 10, fps, config: { damping: 10 } });
  const icon2 = spring({ frame: frame - 25, fps, config: { damping: 10 } });

  // Bridge Animation (Icon 2 flies forward for Scene 3)
  const bridgeOut = spring({ frame: frame - (durationInFrames - 60), fps, config: { damping: 12 } });
  const bridgeZ = interpolate(bridgeOut, [0, 1], [0, 1000]);
  const bridgeOpacity = interpolate(bridgeOut, [0, 0.5], [1, 0]);

  // Logo bridge from S1
  const logoEntrance = interpolate(frame, [0, 60], [1, 0]);
  const logoX = interpolate(frame, [0, 60], [-400, -500]);
  const logoY = interpolate(frame, [0, 60], [-300, -400]);

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Bridge Logo from S1 */}
      {frame < 60 && (
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '280px',
          height: '280px',
          background: COLORS.orange,
          borderRadius: '40px',
          transform: `translate(-50%, -50%) translate(${logoX}px, ${logoY}px) scale(0.4)`,
          opacity: logoEntrance,
        }}>
          <Img src="/toppa-project-pfp.png" style={{ width: '100%', height: '100%', borderRadius: '40px' }} />
        </div>
      )}

      <AbsoluteFill style={{ transform: `translateX(${panX}px)`, display: 'flex', width: '110%' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          height: '100%',
          width: '100%',
          padding: '0 10%',
          alignItems: 'center',
        }}>
          {/* Left: Text */}
          <div style={{ flex: 1, paddingRight: '5%' }}>
            <div style={{
              opacity: entrance,
              transform: `translateX(${(1 - entrance) * -50}px)`,
            }}>
              <h2 style={{
                fontFamily: FONTS.main,
                fontWeight: 800,
                fontSize: '80px',
                color: COLORS.slate,
                lineHeight: 1.1,
              }}>
                Access<br/>
                <span style={{ color: COLORS.orange }}>Everywhere</span>
              </h2>
            </div>
          </div>

          {/* Right: Floating Icons with 3D depth */}
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            justifyContent: 'center', 
            perspective: '1200px',
            position: 'relative'
          }}>
            {/* Telegram Card */}
            <Breathing intensity={15} rotateIntensity={1}>
              <div style={{
                position: 'absolute',
                left: '0',
                top: '-200px',
                width: '320px',
                height: '420px',
                background: 'white',
                borderRadius: '30px',
                boxShadow: SHADOWS.premium,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${icon1}) rotateY(-20deg) rotateX(10deg) translateZ(50px)`,
              }}>
                <Img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" style={{ width: '120px' }} />
                <span style={{ fontFamily: FONTS.main, fontWeight: 700, marginTop: '20px', fontSize: '24px' }}>Telegram</span>
              </div>
            </Breathing>

            {/* WhatsApp Card */}
            <Breathing intensity={20} offset={30} rotateIntensity={1.5}>
              <div style={{
                position: 'absolute',
                right: '0',
                bottom: '-200px',
                width: '320px',
                height: '420px',
                background: 'white',
                borderRadius: '30px',
                boxShadow: SHADOWS.premium,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${icon2}) rotateY(15deg) rotateX(-5deg) translateZ(${120 + bridgeZ}px)`,
                opacity: bridgeOpacity,
              }}>
                <Img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" style={{ width: '120px' }} />
                <span style={{ fontFamily: FONTS.main, fontWeight: 700, marginTop: '20px', fontSize: '24px' }}>WhatsApp</span>
              </div>
            </Breathing>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
