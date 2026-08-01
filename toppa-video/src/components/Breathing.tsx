import React from "react";
import { useCurrentFrame } from "remotion";

interface BreathingProps {
  children: React.ReactNode;
  offset?: number;
  intensity?: number;
  speed?: number;
  rotateIntensity?: number;
}

export const Breathing: React.FC<BreathingProps> = ({ 
  children, 
  offset = 0, 
  intensity = 15, 
  speed = 60,
  rotateIntensity = 0.5
}) => {
  const frame = useCurrentFrame();
  
  const y = Math.sin((frame + offset) / speed) * intensity;
  const rotate = Math.cos((frame + offset) / (speed * 1.5)) * rotateIntensity;

  return (
    <div style={{ transform: `translateY(${y}px) rotate(${rotate}deg)` }}>
      {children}
    </div>
  );
};
