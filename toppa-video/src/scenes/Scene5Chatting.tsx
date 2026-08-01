import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate, Img } from "remotion";
import { COLORS, FONTS, SHADOWS } from "../constants";
import { Breathing } from "../components/Breathing";

export const Scene5Chatting: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const panX = interpolate(frame, [0, durationInFrames], [0, -30]);
  const opacity = interpolate(frame, 
    [0, 60, durationInFrames - 60, durationInFrames], 
    [0, 1, 1, 0]
  );
  
  // Bridge In (Phone finishes stack from S4)
  const bridgeIn = spring({ frame, fps, config: { damping: 12 } });
  const phoneZ = interpolate(bridgeIn, [0, 1], [-500, 0]);
  const entranceScale = interpolate(bridgeIn, [0, 1], [0.5, 1]);
  const phoneEntrance = spring({ frame, fps, config: { damping: 12, mass: 1.2 } });
  
  const msg1 = spring({ frame: frame - 40, fps, config: { damping: 14 } });
  const msg2 = spring({ frame: frame - 100, fps, config: { damping: 14 } });
  const msg3 = spring({ frame: frame - 160, fps, config: { damping: 14 } });

  // Bridge Out (Zoom into screen for S6)
  const bridgeOut = spring({ frame: frame - (durationInFrames - 60), fps, config: { damping: 12, stiffness: 200 } });
  const zoomThrough = interpolate(bridgeOut, [0, 1], [1, 5]);
  const contentOpacity = interpolate(bridgeOut, [0, 0.4], [1, 0]);

  return (
    <AbsoluteFill style={{ opacity }}>
      
      <AbsoluteFill style={{ 
        transform: `translateX(${panX}px) scale(${zoomThrough})`, 
        display: 'flex', 
        width: '110%',
        opacity: contentOpacity 
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          padding: '0 8%',
          alignItems: 'center',
          height: '100%',
          width: '100%',
          transform: `scale(${entranceScale}) translateZ(${phoneZ}px)`,
        }}>
          {/* Left: Phone UI */}
          <div style={{ flex: 1.2, perspective: '2000px', display: 'flex', justifyContent: 'center' }}>
            <Breathing intensity={12} speed={90}>
              <div style={{
                width: '450px',
                height: '800px',
                background: '#F1F5F9',
                borderRadius: '60px',
                border: `12px solid ${COLORS.slate}`,
                boxShadow: SHADOWS.premium,
                padding: '40px 30px',
                position: 'relative',
                transform: `rotateY(20deg) rotateX(5deg) scale(${phoneEntrance})`,
                overflow: 'hidden',
              }}>
                <div style={{ height: '60px', borderBottom: `2px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: COLORS.orange }} />
                  <span style={{ fontFamily: FONTS.main, fontWeight: 700, color: COLORS.slate }}>Toppa Agent</span>
                </div>

                <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
                  <div style={{ 
                    alignSelf: 'flex-end', 
                    background: COLORS.slate, 
                    color: 'white', 
                    padding: '20px 25px', 
                    borderRadius: '25px 25px 4px 25px',
                    fontFamily: FONTS.main,
                    fontSize: '22px',
                    opacity: msg1,
                    transform: `translateY(${(1 - msg1) * 30}px)`,
                  }}>
                    Buy $10 Netflix voucher
                  </div>

                  <div style={{ 
                    alignSelf: 'flex-start', 
                    background: 'white', 
                    padding: '20px 25px', 
                    borderRadius: '25px 25px 25px 4px',
                    fontFamily: FONTS.main,
                    color: COLORS.slate,
                    fontSize: '22px',
                    opacity: msg2,
                    transform: `translateY(${(1 - msg2) * 30}px)`,
                  }}>
                    Processing... ⚡️
                  </div>

                  <div style={{ 
                    alignSelf: 'flex-start', 
                    background: COLORS.orangeLight, 
                    border: `2px solid ${COLORS.orange}`,
                    padding: '25px', 
                    borderRadius: '25px',
                    fontFamily: FONTS.main,
                    color: COLORS.orangeDark,
                    fontSize: '22px',
                    opacity: msg3,
                    transform: `scale(${msg3})`,
                  }}>
                    SUCCESS! Code Sent.
                  </div>
                </div>
              </div>
            </Breathing>
          </div>

          <div style={{ flex: 1, paddingLeft: '5%' }}>
            <div style={{ opacity: phoneEntrance }}>
              <h2 style={{ fontFamily: FONTS.main, fontWeight: 800, fontSize: '70px', color: COLORS.slate }}>
                Talk<br/><span style={{ color: COLORS.orange }}>to Pay</span>
              </h2>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
