import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { COLORS, FONTS, SHADOWS } from "../constants";
import { Breathing } from "../components/Breathing";

export const Scene6GroupWallets: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const panY = interpolate(frame, [0, durationInFrames], [0, -40]);
  const opacity = interpolate(frame, 
    [0, 60, durationInFrames - 60, durationInFrames], 
    [0, 1, 1, 0]
  );
  
  // Bridge In (Zooming through phone from S5)
  const bridgeIn = spring({ frame, fps, config: { damping: 15 } });
  const entranceZoom = interpolate(bridgeIn, [0, 1], [0.1, 1]);
  const entranceOpacity = interpolate(bridgeIn, [0, 0.4], [0, 1]);

  const entrance = spring({ frame, fps, config: { damping: 15 } });

  // Bridge Out (Unfold into bars for S7)
  const bridgeOut = spring({ frame: frame - (durationInFrames - 60), fps, config: { damping: 12 } });
  const foldY = interpolate(bridgeOut, [0, 1], [0, -200]);
  const foldScaleY = interpolate(bridgeOut, [0, 1], [1, 2]);

  return (
    <AbsoluteFill style={{ opacity }}>
      
      <AbsoluteFill style={{ 
        transform: `translateY(${panY + foldY}px) scaleY(${foldScaleY}) scaleX(${entranceZoom})`, 
        display: 'flex', 
        height: '110%',
        opacity: entranceOpacity
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '50px', opacity: entrance * (1 - bridgeOut) }}>
            <h2 style={{ fontFamily: FONTS.main, fontWeight: 800, fontSize: '70px', color: COLORS.slate }}>
              Unity in <span style={{ color: COLORS.orange }}>Capital</span>
            </h2>
          </div>

          <Breathing intensity={15} speed={85}>
            <div style={{
              width: '900px',
              background: 'white',
              borderRadius: '40px',
              boxShadow: SHADOWS.premium,
              padding: '60px',
              perspective: '1500px',
              transform: `rotateX(10deg) scale(${0.9 + entrance * 0.1})`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${COLORS.border}`, paddingBottom: '30px' }}>
                <div style={{ opacity: 1 - bridgeOut }}>
                  <div style={{ fontFamily: FONTS.main, fontWeight: 600, color: COLORS.text3, fontSize: '20px' }}>Group Balance</div>
                  <div style={{ fontFamily: FONTS.main, fontWeight: 800, color: COLORS.slate, fontSize: '56px' }}>$4,280.50</div>
                </div>
                <div style={{ display: 'flex' }}>
                   {[1,2,3].map(i => <div key={i} style={{ width: '70px', height: '70px', borderRadius: '50%', background: COLORS.orange, border: '4px solid white', marginLeft: i===1?0:-20 }} />)}
                </div>
              </div>
              <div style={{ marginTop: '40px', display: 'flex', gap: '30px' }}>
                <div style={{ flex: 1, padding: '25px', borderRadius: '20px', background: COLORS.bgAlt }}>
                  <div style={{ fontFamily: FONTS.main, fontWeight: 800, fontSize: '32px', color: COLORS.slate }}>3 Pending</div>
                </div>
              </div>
            </div>
          </Breathing>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
