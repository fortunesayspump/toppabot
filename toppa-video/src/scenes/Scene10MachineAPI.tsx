import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { COLORS, FONTS, SHADOWS } from "../constants";
import { Breathing } from "../components/Breathing";

export const Scene10MachineAPI: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const panScale = interpolate(frame, [0, durationInFrames], [1, 1.08]);
  const opacity = interpolate(frame, 
    [0, 60, durationInFrames - 60, durationInFrames], 
    [0, 1, 1, 0]
  );
  
  // Bridge In (Unfold from S9 Shield)
  const bridgeIn = spring({ frame, fps, config: { damping: 15 } });
  const entranceRotate = interpolate(bridgeIn, [0, 1], [45, 0]);
  const entranceScale = interpolate(bridgeIn, [0, 1], [0.5, 1]);

  const entrance = spring({ frame, fps, config: { damping: 15 } });

  // Bridge Out (Slide into S11 Escrow)
  const bridgeOut = spring({ frame: frame - (durationInFrames - 60), fps, config: { damping: 12 } });
  const exitX = interpolate(bridgeOut, [0, 1], [0, 800]);

  const commands = [
    "> connecting to celo-mainnet...",
    "> status: healthy",
    "> paying 0.05 USDC to api.inference.ai",
    "> payment confirmed. tx: 0x93a...",
  ];

  return (
    <AbsoluteFill style={{ opacity }}>
      
      <AbsoluteFill style={{ 
        transform: `scale(${panScale * entranceScale}) rotateY(${entranceRotate}deg) translateX(${exitX}px)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '50px', opacity: entrance }}>
          <h2 style={{ fontFamily: FONTS.main, fontWeight: 800, fontSize: '70px', color: 'white' }}>
            The Machine <span style={{ color: COLORS.orange }}>Economy</span>
          </h2>
        </div>

        <Breathing intensity={12} speed={100}>
          <div style={{
            width: '1100px',
            height: '550px',
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(30px)',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: SHADOWS.premium,
            padding: '40px',
            transform: `rotateX(10deg)`,
          }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '25px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
            </div>
            <div style={{ fontFamily: 'Courier New, monospace', fontSize: '26px', color: '#a5b4fc', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {commands.map((cmd, i) => {
                const cmdEntrance = spring({ frame: frame - (i * 10) - 40, fps, config: { damping: 10 } });
                return <div key={cmd} style={{ opacity: cmdEntrance }}>{cmd}</div>
              })}
              <div style={{ width: '16px', height: '32px', background: COLORS.orange, display: frame % 30 < 15 ? 'block' : 'none' }} />
            </div>
          </div>
        </Breathing>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
