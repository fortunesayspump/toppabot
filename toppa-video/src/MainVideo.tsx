import { AbsoluteFill, Sequence, OffthreadVideo, Audio, Img, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONTS, SHADOWS } from "./constants";
import { AuroraBackground } from "./components/AuroraBackground";
import { Breathing } from "./components/Breathing";

/*
  VIDEO STRUCTURE (10,770 frames @ 60fps ≈ 2:59):
  ─────────────────────────────────────────────────
  1. Animated Intro                     →   300f  (5s)
  2. Recording Part 1  (0–95s @ 2x)     → 2850f  (~47s)
  3. Animated Transition 1              →   240f  (4s)
  4. Recording Part 2  (95–180s @ 2x)   → 2550f  (~42s)
  5. Animated Transition 2              →   240f  (4s)
  6. Recording Part 3  (180–283s @ 2x)  → 3090f  (~51s)
  7–10. Feature Scenes (×4)             → 1440f  (24s)
  11. Animated Outro                    →   300f  (5s)
*/

const DEMO_VIDEO = staticFile("demo.mov");
const BGM = staticFile("bgm.mp3");

// ─── Abstract Geometric Background (orbiting shapes, glowing orbs, grid) ───
const GeometricBG: React.FC = () => {
  const frame = useCurrentFrame();

  // Orbiting rings
  const rings = [
    { size: 300, x: 12, y: 20, speed: 0.006, opacity: 0.06 },
    { size: 200, x: 80, y: 70, speed: 0.008, opacity: 0.05 },
    { size: 350, x: 85, y: 15, speed: 0.005, opacity: 0.04 },
    { size: 180, x: 10, y: 75, speed: 0.007, opacity: 0.06 },
  ];

  // Glowing orbs
  const orbs = [
    { size: 120, x: 8, y: 30, speed: 0.015, color: COLORS.orange },
    { size: 80, x: 88, y: 45, speed: 0.012, color: '#6366F1' },
    { size: 100, x: 75, y: 80, speed: 0.01, color: COLORS.orange },
    { size: 60, x: 15, y: 60, speed: 0.018, color: '#6366F1' },
    { size: 90, x: 50, y: 10, speed: 0.014, color: COLORS.orange },
  ];

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}>
      {/* Orbiting rings */}
      {rings.map((ring, i) => (
        <div key={`ring-${i}`} style={{
          position: 'absolute',
          left: `${ring.x}%`,
          top: `${ring.y}%`,
          width: `${ring.size}px`,
          height: `${ring.size}px`,
          borderRadius: '50%',
          border: `2px solid ${COLORS.slate}`,
          opacity: ring.opacity,
          transform: `rotate(${frame * ring.speed * 60}deg) translateX(${Math.sin(frame * ring.speed) * 20}px)`,
        }} />
      ))}

      {/* Glowing orbs */}
      {orbs.map((orb, i) => {
        const floatY = Math.sin(frame * orb.speed + i * 2) * 15;
        const floatX = Math.cos(frame * orb.speed * 0.7 + i) * 10;
        return (
          <div key={`orb-${i}`} style={{
            position: 'absolute',
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${orb.color}18 0%, transparent 70%)`,
            filter: 'blur(20px)',
            transform: `translate(${floatX}px, ${floatY}px)`,
          }} />
        );
      })}

      {/* Grid dots */}
      {Array.from({ length: 8 }).map((_, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const pulseOpacity = 0.04 + Math.sin(frame * 0.03 + i * 1.2) * 0.02;
        return (
          <div key={`dot-${i}`} style={{
            position: 'absolute',
            left: `${15 + col * 22}%`,
            top: `${25 + row * 50}%`,
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: COLORS.slate,
            opacity: pulseOpacity,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ─── Floating Dots (subtle particle layer) ───
const FloatingDots: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}>
      {Array.from({ length: 12 }).map((_, i) => {
        const x = ((i * 137.5) % 100);
        const baseY = ((i * 73.1) % 100);
        const speed = 0.3 + (i % 5) * 0.1;
        const size = 6 + (i % 4) * 4;
        const y = (baseY + frame * speed * 0.08) % 110 - 5;
        const opacity = 0.06 + Math.sin(frame * 0.02 + i) * 0.03;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${x}%`,
            top: `${y}%`,
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            background: COLORS.orange,
            opacity,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ─── Animated Intro ───
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 10, mass: 0.5, stiffness: 100 } });
  const scale = interpolate(entrance, [0, 1], [0.5, 1]);
  const rotateY = interpolate(entrance, [0, 1], [45, 0]);
  const textEntrance = spring({ frame: frame - 20, fps, config: { damping: 12 } });
  const tagEntrance = spring({ frame: frame - 45, fps, config: { damping: 14 } });

  // Exit zoom
  const exit = spring({ frame: frame - 240, fps, config: { damping: 8, stiffness: 200 } });
  const exitScale = interpolate(exit, [0, 1], [1, 5]);
  const exitOpacity = interpolate(exit, [0, 0.3], [1, 0]);

  return (
    <AbsoluteFill style={{ transform: `scale(${exitScale})`, opacity: exitOpacity, background: 'white' }}>
      <AuroraBackground />
      <FloatingDots />

      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
        <div style={{ perspective: '1000px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Breathing intensity={10} speed={80}>
            <div style={{
              transform: `scale(${scale}) rotateY(${rotateY}deg)`,
              boxShadow: SHADOWS.premium,
              borderRadius: '40px',
              overflow: 'hidden',
              backgroundColor: COLORS.orange,
              width: '280px',
              height: '280px',
              border: `10px solid ${COLORS.orange}`,
            }}>
              <Img src={staticFile("toppa-project-pfp.png")} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </Breathing>

          <div style={{
            marginTop: '60px',
            textAlign: 'center',
            opacity: interpolate(textEntrance, [0, 1], [0, 1]),
            transform: `translateY(${(1 - textEntrance) * 20}px)`,
          }}>
            <h1 style={{ fontFamily: FONTS.main, fontWeight: 800, fontSize: '110px', color: COLORS.slate, margin: 0, letterSpacing: '-2px' }}>
              Toppa
            </h1>
          </div>

          <div style={{
            marginTop: '15px',
            opacity: interpolate(tagEntrance, [0, 1], [0, 1]),
            transform: `translateY(${(1 - tagEntrance) * 20}px)`,
          }}>
            <div style={{ padding: '12px 35px', borderRadius: '50px', background: 'rgba(15,23,42,0.05)', border: `1px solid ${COLORS.border}` }}>
              <span style={{ fontFamily: FONTS.main, fontWeight: 600, fontSize: '26px', color: COLORS.text3, letterSpacing: '2px', textTransform: 'uppercase' as const }}>
                Your AI Payment Agent
              </span>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Animated Transition ───
const TransitionScene: React.FC<{ title: string; subtitle: string; icon: string }> = ({ title, subtitle, icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 12, mass: 0.5 } });
  const textScale = interpolate(entrance, [0, 1], [3, 1]);
  const textBlur = interpolate(entrance, [0, 1], [15, 0]);
  const textOpacity = interpolate(entrance, [0, 1], [0, 1]);
  const iconEntrance = spring({ frame: frame - 10, fps, config: { damping: 10 } });
  const subtitleEntrance = spring({ frame: frame - 30, fps, config: { damping: 14 } });

  const exit = spring({ frame: frame - 180, fps, config: { damping: 8, stiffness: 200 } });
  const exitScale = interpolate(exit, [0, 1], [1, 5]);
  const exitOpacity = interpolate(exit, [0, 0.3], [1, 0]);

  return (
    <AbsoluteFill style={{ transform: `scale(${exitScale})`, opacity: exitOpacity, background: 'white' }}>
      <AuroraBackground />
      <FloatingDots />

      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '80px',
            marginBottom: '25px',
            opacity: interpolate(iconEntrance, [0, 1], [0, 1]),
            transform: `scale(${iconEntrance}) rotate(${(1 - iconEntrance) * 180}deg)`,
          }}>
            {icon}
          </div>

          <h2 style={{
            fontFamily: FONTS.main, fontWeight: 900, fontSize: '110px', color: COLORS.slate,
            transform: `scale(${textScale})`, filter: `blur(${textBlur}px)`, opacity: textOpacity,
            lineHeight: 1, letterSpacing: '-3px', margin: 0,
          }}>
            {title.split(' ').map((word, wi) => (
              <span key={wi} style={{ color: wi === 1 ? COLORS.orange : COLORS.slate }}>
                {word}{wi < title.split(' ').length - 1 ? ' ' : ''}
              </span>
            ))}
          </h2>

          <div style={{ marginTop: '30px', opacity: interpolate(subtitleEntrance, [0, 1], [0, 1]), transform: `translateY(${(1 - subtitleEntrance) * 25}px)` }}>
            <div style={{ display: 'inline-block', padding: '14px 40px', borderRadius: '50px', background: 'rgba(15,23,42,0.05)', border: `1px solid ${COLORS.border}` }}>
              <span style={{ fontFamily: FONTS.main, fontWeight: 600, fontSize: '28px', color: COLORS.text3 }}>{subtitle}</span>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Feature Scene (detailed ending slides) ───
const FeatureScene: React.FC<{
  title: string;
  icon: string;
  description: string;
  details: string[];
}> = ({ title, icon, description, details }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 12, mass: 0.5 } });
  const titleScale = interpolate(entrance, [0, 1], [2, 1]);
  const titleBlur = interpolate(entrance, [0, 1], [10, 0]);
  const descEntrance = spring({ frame: frame - 25, fps, config: { damping: 14 } });

  const exit = spring({ frame: frame - 300, fps, config: { damping: 8, stiffness: 200 } });
  const exitScale = interpolate(exit, [0, 1], [1, 5]);
  const exitOpacity = interpolate(exit, [0, 0.3], [1, 0]);

  return (
    <AbsoluteFill style={{ transform: `scale(${exitScale})`, opacity: exitOpacity, background: 'white' }}>
      <AuroraBackground />
      <GeometricBG />
      <FloatingDots />

      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
        <div style={{ textAlign: 'center', maxWidth: '1200px', padding: '0 60px' }}>
          {/* Icon */}
          <div style={{
            fontSize: '90px',
            marginBottom: '20px',
            opacity: interpolate(entrance, [0, 1], [0, 1]),
            transform: `scale(${entrance}) rotate(${(1 - entrance) * 120}deg)`,
          }}>
            {icon}
          </div>

          {/* Title */}
          <h2 style={{
            fontFamily: FONTS.main, fontWeight: 900, fontSize: '90px', color: COLORS.slate,
            transform: `scale(${titleScale})`, filter: `blur(${titleBlur}px)`,
            opacity: interpolate(entrance, [0, 1], [0, 1]),
            lineHeight: 1, letterSpacing: '-2px', margin: 0,
          }}>
            {title.split(' ').map((word, wi) => (
              <span key={wi} style={{ color: wi >= 1 ? COLORS.orange : COLORS.slate }}>
                {word}{wi < title.split(' ').length - 1 ? ' ' : ''}
              </span>
            ))}
          </h2>

          {/* Description */}
          <p style={{
            fontFamily: FONTS.main, fontSize: '32px', color: COLORS.text3,
            marginTop: '25px', lineHeight: 1.5,
            opacity: interpolate(descEntrance, [0, 1], [0, 1]),
            transform: `translateY(${(1 - descEntrance) * 20}px)`,
          }}>
            {description}
          </p>

          {/* Detail bullets */}
          <div style={{ display: 'flex', gap: '30px', marginTop: '40px', justifyContent: 'center' }}>
            {details.map((detail, di) => {
              const detailEntrance = spring({ frame: frame - 40 - (di * 12), fps, config: { damping: 14 } });
              return (
                <div key={di} style={{
                  padding: '18px 30px',
                  borderRadius: '20px',
                  background: 'rgba(15,23,42,0.04)',
                  border: `1px solid ${COLORS.border}`,
                  opacity: interpolate(detailEntrance, [0, 1], [0, 1]),
                  transform: `translateY(${(1 - detailEntrance) * 15}px)`,
                }}>
                  <span style={{ fontFamily: FONTS.main, fontWeight: 600, fontSize: '22px', color: COLORS.slate }}>
                    {detail}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Animated Outro ───
const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 12 } });
  const logoScale = interpolate(entrance, [0, 1], [0, 1]);
  const logoRotate = interpolate(entrance, [0, 1], [30, 0]);
  const textEntrance = spring({ frame: frame - 25, fps, config: { damping: 10 } });
  const ctaEntrance = spring({ frame: frame - 60, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ background: 'white' }}>
      <AuroraBackground />
      <FloatingDots />

      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Breathing intensity={15} speed={60}>
            <div style={{
              width: '240px', height: '240px', borderRadius: '40px', overflow: 'hidden',
              boxShadow: SHADOWS.premium, transform: `scale(${logoScale}) rotate(${logoRotate}deg)`,
              backgroundColor: COLORS.orange, border: `8px solid ${COLORS.orange}`,
            }}>
              <Img src={staticFile("toppa-project-pfp.png")} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </Breathing>

          <h1 style={{ fontFamily: FONTS.main, fontWeight: 800, fontSize: '90px', color: COLORS.slate, marginTop: '40px', opacity: textEntrance, transform: `scale(${textEntrance})` }}>
            Toppa
          </h1>

          <div style={{ marginTop: '40px', opacity: ctaEntrance, transform: `translateY(${(1 - ctaEntrance) * 40}px)` }}>
            <div style={{ background: COLORS.slate, padding: '25px 60px', borderRadius: '50px', boxShadow: SHADOWS.premium }}>
              <span style={{ fontFamily: FONTS.main, fontWeight: 800, fontSize: '32px', color: 'white' }}>Try Toppa Now</span>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Recording Segment (Laptop mockup on white Aurora bg) ───
const RecordingSegment: React.FC<{ startFrom: number; durationInFrames: number }> = ({ startFrom, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entranceOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const exitOpacity = interpolate(frame, [durationInFrames - 30, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });

  // Subtle continuous tilt
  const tiltX = Math.sin(frame * 0.005) * 1.5;
  const tiltY = Math.cos(frame * 0.004) * 1;

  // Laptop entrance
  const laptopEntrance = spring({ frame, fps, config: { damping: 14, mass: 1 } });
  const laptopScale = interpolate(laptopEntrance, [0, 1], [0.85, 1]);

  return (
    <AbsoluteFill style={{
      background: 'white',
      opacity: Math.min(entranceOpacity, exitOpacity),
    }}>
      {/* White Aurora BG + floating tags */}
      <AuroraBackground />
      <GeometricBG />
      <FloatingDots />

      {/* Centered laptop device frame */}
      <AbsoluteFill style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
        perspective: '2500px',
      }}>
        <div style={{
          transform: `scale(${laptopScale}) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {/* Screen / Lid */}
          <div style={{
            width: '1400px',
            background: '#1E293B',
            borderRadius: '16px 16px 0 0',
            padding: '12px 12px 0 12px',
            boxShadow: `0 -5px 40px rgba(15,23,42,0.15), ${SHADOWS.premium}`,
            position: 'relative',
          }}>
            {/* Webcam dot */}
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#475569',
              margin: '0 auto 8px auto',
            }} />

            {/* Screen bezel */}
            <div style={{
              width: '100%',
              aspectRatio: '16 / 10',
              borderRadius: '6px 6px 0 0',
              overflow: 'hidden',
              background: '#000',
            }}>
              <OffthreadVideo
                src={DEMO_VIDEO}
                startFrom={startFrom}
                playbackRate={2}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>
          </div>

          {/* Bottom chin / keyboard base */}
          <div style={{
            width: '1540px',
            height: '16px',
            background: 'linear-gradient(to bottom, #CBD5E1, #94A3B8)',
            borderRadius: '0 0 8px 8px',
            boxShadow: '0 4px 20px rgba(15,23,42,0.1)',
          }}>
            {/* Trackpad notch hint */}
            <div style={{
              width: '200px',
              height: '4px',
              background: 'rgba(0,0,0,0.08)',
              borderRadius: '0 0 4px 4px',
              margin: '0 auto',
            }} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Main Composition ───
export const MainVideo: React.FC = () => {
  // Frame layout @ 2x speed:
  // Intro:      0 – 299       (300f)
  // Rec 1:      300 – 3149    (2850f, 0–95s @ 2x)
  // Trans 1:    3150 – 3389   (240f)
  // Rec 2:      3390 – 5939   (2550f, 95–180s @ 2x)
  // Trans 2:    5940 – 6179   (240f)
  // Rec 3:      6180 – 9269   (3090f, 180–283s @ 2x)
  // Feature 1:  9270 – 9509   (240f) "170+ Countries"
  // Feature 2:  9510 – 9749   (240f) "Zero Gas"
  // Feature 3:  9750 – 9989   (240f) "ZK Identity"
  // Feature 4:  9990 – 10229  (240f) "Machine Economy"
  // Outro:      10230 – 10529 (300f)
  // TOTAL: 10530 frames (~175s / ~2:55)

  return (
    <AbsoluteFill style={{ backgroundColor: 'white' }}>
      {/* 🎵 Background Music (looped to cover full video) */}
      <Audio src={BGM} volume={0.25} loop />

      {/* 1. Animated Intro (0–299) */}
      <Sequence from={0} durationInFrames={300}>
        <IntroScene />
      </Sequence>

      {/* 2. Recording Part 1: 0–95s @ 2x (300–3149) */}
      <Sequence from={300} durationInFrames={2850}>
        <RecordingSegment startFrom={0} durationInFrames={2850} />
      </Sequence>

      {/* 3. Animated Transition 1 (3150–3389) */}
      <Sequence from={3150} durationInFrames={240}>
        <TransitionScene title="Talk to Pay" subtitle="Airtime • Data • Gift Cards • Bills" icon="⚡" />
      </Sequence>

      {/* 4. Recording Part 2: 95–180s @ 2x (3390–5939) */}
      {/* startFrom = 95s * 60fps = 5700 source frames */}
      <Sequence from={3390} durationInFrames={2550}>
        <RecordingSegment startFrom={5700} durationInFrames={2550} />
      </Sequence>

      {/* 5. Animated Transition 2 (5940–6179) */}
      <Sequence from={5940} durationInFrames={240}>
        <TransitionScene title="Group Wallets" subtitle="Pool funds • Vote • Spend together" icon="👥" />
      </Sequence>

      {/* 6. Recording Part 3: 180–283s @ 2x (6180–9269) */}
      {/* startFrom = 180s * 60fps = 10800 source frames */}
      <Sequence from={6180} durationInFrames={3090}>
        <RecordingSegment startFrom={10800} durationInFrames={3090} />
      </Sequence>

      {/* ── Feature Endings (360f = 6s each) ── */}

      {/* 7. Feature: Global Reach (9270–9629) */}
      <Sequence from={9270} durationInFrames={360}>
        <FeatureScene
          title="170+ Countries"
          icon="🌍"
          description="Buy airtime, data bundles, pay bills, and send gift cards to anyone, anywhere."
          details={["500+ Mobile Operators", "10,000+ Gift Cards", "Instant Delivery"]}
        />
      </Sequence>

      {/* 8. Feature: Zero Gas (9630–9989) */}
      <Sequence from={9630} durationInFrames={360}>
        <FeatureScene
          title="Zero Gas Fees"
          icon="⛽"
          description="Pay for everything in cUSD. Celo's fee abstraction means you never think about gas."
          details={["Pay with Stablecoins", "No ETH Needed", "Sub-cent Transactions"]}
        />
      </Sequence>

      {/* 9. Feature: Trustless Escrow (9990–10349) */}
      <Sequence from={9990} durationInFrames={360}>
        <FeatureScene
          title="AI Escrow"
          icon="🔒"
          description="Smart contract escrow for agent-to-agent payments. Funds release on verified task completion."
          details={["On-chain Verification", "Automated Disputes", "Multi-party Support"]}
        />
      </Sequence>

      {/* 10. Feature: Machine Economy (10350–10709) */}
      <Sequence from={10350} durationInFrames={360}>
        <FeatureScene
          title="Machine Economy"
          icon="🤖"
          description="AI agents paying AI agents. HTTP 402 native payments for the autonomous web."
          details={["x402 Protocol", "Agent-to-Agent", "Pay-per-Use APIs"]}
        />
      </Sequence>

      {/* 11. Animated Outro (10710–11009) */}
      <Sequence from={10710} durationInFrames={300}>
        <OutroScene />
      </Sequence>

      {/* Cinematic Film Grain */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.03,
        backgroundImage: `url("https://www.transparenttextures.com/patterns/p6.png")`,
        pointerEvents: 'none',
        zIndex: 100,
      }} />
    </AbsoluteFill>
  );
};
