import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

const SUBTITLES = [
  // Scene 1: Intro (0–240)
  { start: 30, end: 225, text: "Meet Toppa — the AI agent that buys real things with crypto." },

  // Scene 2: Omnipresent (210–480)
  { start: 230, end: 370, text: "No app downloads. No seed phrases. Just message on WhatsApp or Telegram." },
  { start: 380, end: 465, text: "A wallet is created the moment you say hello." },

  // Scene 3: Chatting (450–750)
  { start: 470, end: 580, text: "Talk to it in plain language. 'Send $5 airtime to my mom in Nigeria.'" },
  { start: 590, end: 730, text: "Toppa detects the intent, finds the operator, and executes instantly." },

  // Scene 4: Brands (725–1025)
  { start: 745, end: 870, text: "Access 300+ brands across 170+ countries." },
  { start: 880, end: 1005, text: "Airtime, data bundles, utility bills, gift cards — all settled on Celo." },

  // Scene 5: Settlement (995–1265)
  { start: 1015, end: 1245, text: "Sub-second finality. Near-zero fees. Instant on-chain settlement." },

  // Scene 6: Group Wallets (1235–1535)
  { start: 1255, end: 1390, text: "Pool funds in group wallets for shared expenses." },
  { start: 1400, end: 1515, text: "Every member contributes. The treasury grows together." },

  // Scene 7: Poll / Governance (1515–1815)
  { start: 1535, end: 1670, text: "Spending requires a group vote. True democratic governance on-chain." },
  { start: 1680, end: 1795, text: "Majority wins. The purchase executes automatically." },

  // Scene 8: Karma ZK (1790–2090)
  { start: 1810, end: 1940, text: "Karma scores powered by ERC-8004 and Self Protocol ZK verification." },
  { start: 1950, end: 2070, text: "Full compliance — without revealing sensitive personal data." },

  // Scene 9: x402 Protocol (2060–2390)
  { start: 2080, end: 2220, text: "Through x402, other AI agents can pay Toppa on-chain autonomously." },
  { start: 2230, end: 2370, text: "Machine-to-machine micropayments. The agentic economy starts here." },

  // Scene 10: Escrow (2360–2630)
  { start: 2380, end: 2610, text: "Smart escrow holds funds until delivery is verified. Trustless, every time." },

  // Scene 11: Roadmap (2605–2935)
  { start: 2625, end: 2760, text: "Built. Shipped. And we're just getting started." },
  { start: 2770, end: 2915, text: "MiniPay, SDK, fiat ramps, merchant tools, P2P transfers — all next." },

  // Scene 12: Outro (2905–3175)
  { start: 2930, end: 3155, text: "Real transactions. Real utility. Try it live at toppa.cc." },
];

export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const currentSub = SUBTITLES.find((s) => frame >= s.start && frame < s.end);

  if (!currentSub) return null;

  // Smooth fade in/out
  const fadeIn = interpolate(frame, [currentSub.start, currentSub.start + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [currentSub.end - 10, currentSub.end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(fadeIn, fadeOut);

  const slideY = interpolate(fadeIn, [0, 1], [10, 0]);

  return (
    <AbsoluteFill className="justify-end items-center pb-14 pointer-events-none z-50">
      <div
        className="bg-slate-900/80 text-white text-[30px] px-8 py-4 rounded-2xl font-bold tracking-tight text-center max-w-[78%] backdrop-blur-md"
        style={{
          opacity,
          transform: `translateY(${slideY}px)`,
          textShadow: "0px 1px 6px rgba(0,0,0,0.3)",
        }}
      >
        {currentSub.text}
      </div>
    </AbsoluteFill>
  );
};
