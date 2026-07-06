"use client";

import { Heart, Sparkles, Star } from "lucide-react";

const decorations = [
  { Icon: Heart, top: "8%", left: "5%", size: 20, delay: "0s", color: "text-pink-soft fill-pink-soft" },
  { Icon: Star, top: "15%", right: "8%", size: 16, delay: "0.5s", color: "text-lavender-deep fill-lavender-deep" },
  { Icon: Sparkles, top: "35%", left: "3%", size: 18, delay: "1s", color: "text-peach" },
  { Icon: Heart, top: "55%", right: "4%", size: 14, delay: "1.5s", color: "text-pink-deep fill-pink-deep/60" },
  { Icon: Star, top: "72%", left: "7%", size: 12, delay: "0.8s", color: "text-mint fill-mint" },
  { Icon: Heart, top: "85%", right: "10%", size: 22, delay: "0.3s", color: "text-lavender fill-lavender" },
  { Icon: Sparkles, top: "25%", right: "15%", size: 14, delay: "1.2s", color: "text-pink-soft" },
  { Icon: Star, top: "45%", left: "12%", size: 10, delay: "0.6s", color: "text-peach fill-peach/70" },
];

export function FloatingDecorations() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-br from-lavender/30 via-background to-peach/20" />

      {decorations.map(({ Icon, top, left, right, size, delay, color }, i) => (
        <Icon
          key={i}
          className={`absolute animate-float opacity-40 ${color}`}
          style={{
            top,
            left,
            right,
            width: size,
            height: size,
            animationDelay: delay,
          }}
        />
      ))}

      {/* Soft blobs */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-pink-soft/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-lavender/25 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mint/15 blur-3xl" />
    </div>
  );
}
