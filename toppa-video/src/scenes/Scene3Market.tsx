import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate, Img } from "remotion";
import { COLORS, FONTS, SHADOWS } from "../constants";
import { Breathing } from "../components/Breathing";

const BRANDS = [
  "Amazon", "MTN", "Netflix", "Airtel", "Steam", "Vodafone", "Spotify", "Safaricom",
  "Apple", "Google Play", "DStv", "Xbox", "PlayStation", "Discord", "Nike", "Uber"
];

export const Scene3Market: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Cinematic Zoom In
  const panScale = interpolate(frame, [0, durationInFrames], [1, 1.1]);
  const opacity = interpolate(frame, 
    [0, 60, durationInFrames - 60, durationInFrames], 
    [0, 1, 1, 0]
  );

  const entrance = spring({ frame, fps, config: { damping: 16 } });
  const tilt = interpolate(entrance, [0, 1], [30, 0]);
  const contentOpacity = interpolate(frame, [0, 20], [0, 1]);

  // Bridge Animation (Implode into Scene 4 center)
  const implode = spring({ frame: frame - (durationInFrames - 60), fps, config: { damping: 10 } });
  const implodeScale = interpolate(implode, [0, 1], [1, 0]);
  const implodeGap = interpolate(implode, [0, 1], [30, -100]);

  // Bridge from S2 (WhatsApp card expanding)
  const bridgeIn = spring({ frame, fps, config: { damping: 12 } });
  const bridgeZ = interpolate(bridgeIn, [0, 1], [-1000, 0]);
  const bridgeOpacity = interpolate(bridgeIn, [0, 0.5], [0, 1]);

  return (
    <AbsoluteFill className="overflow-hidden" style={{ opacity }}>
      {/* Exploding Card Transition */}
      {frame < 60 && (
         <div style={{
           position: 'absolute',
           inset: 0,
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           zIndex: 10,
           opacity: 1 - bridgeIn,
           transform: `translateZ(${1000 * bridgeIn}px)`,
         }}>
           <div style={{ width: '320px', height: '420px', background: 'white', borderRadius: '30px', boxShadow: SHADOWS.premium, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" style={{ width: '120px' }} />
           </div>
         </div>
      )}
      
      <AbsoluteFill style={{ 
        transform: `scale(${panScale})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '60px',
          opacity: entrance,
          transform: `translateY(${(1 - entrance) * -40}px)`,
        }}>
          <h2 style={{ fontFamily: FONTS.main, fontWeight: 800, fontSize: '70px', color: COLORS.slate }}>
            Global <span style={{ color: COLORS.orange }}>Connectivity</span>
          </h2>
        </div>

        <Breathing intensity={20} speed={100}>
          <div style={{
            perspective: '1500px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: `${implodeGap}px`,
            width: '1200px',
            transform: `rotateX(15deg) rotateY(${tilt}deg) scale(${(0.8 + entrance * 0.2) * implodeScale})`,
            opacity: contentOpacity,
          }}>
            {BRANDS.map((brand, i) => {
              const itemEntrance = spring({ frame: frame - (i * 2), fps, config: { damping: 14 } });
              return (
                <div key={brand} style={{
                  background: 'white',
                  padding: '25px',
                  borderRadius: '24px',
                  boxShadow: SHADOWS.premium,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  transform: `translateY(${(1 - itemEntrance) * 100}px) scale(${itemEntrance})`,
                }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: COLORS.bgAlt, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Img 
                      src={`https://www.google.com/s2/favicons?domain=${brand.toLowerCase()}.com&sz=128`} 
                      style={{ width: '32px' }} 
                    />
                  </div>
                  <span style={{ fontFamily: FONTS.main, fontWeight: 700, fontSize: '22px' }}>{brand}</span>
                </div>
              );
            })}
          </div>
        </Breathing>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
