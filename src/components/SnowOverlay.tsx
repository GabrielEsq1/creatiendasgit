'use client';

import React from 'react';

interface Props {
    enabled: boolean;
}

export default function SnowOverlay({ enabled }: Props) {
    if (!enabled) return null;

    return (
        <>
            <style jsx global>{`
        .snow-layer {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 50;
          overflow: hidden;
        }

        .snow-layer i {
          position: absolute;
          top: -20px;
          width: 10px;
          height: 10px;
          background: radial-gradient(circle at 30% 30%, #ffffff, #e5e7eb);
          border-radius: 50%;
          opacity: 0.8;
          animation: snow-fall linear infinite;
          filter: blur(1px);
        }

        /* Natural variation for flakes */
        .snow-layer i:nth-child(1) { left: 5%;  animation-duration: 9s;  animation-delay: 0s; transform: scale(0.8); }
        .snow-layer i:nth-child(2) { left: 15%; animation-duration: 12s; animation-delay: -2s; transform: scale(1); }
        .snow-layer i:nth-child(3) { left: 25%; animation-duration: 8s;  animation-delay: -5s; transform: scale(0.6); }
        .snow-layer i:nth-child(4) { left: 35%; animation-duration: 11s; animation-delay: -1s; transform: scale(1.1); }
        .snow-layer i:nth-child(5) { left: 45%; animation-duration: 10s; animation-delay: -3s; transform: scale(0.7); }
        .snow-layer i:nth-child(6) { left: 55%; animation-duration: 13s; animation-delay: -7s; transform: scale(0.9); }
        .snow-layer i:nth-child(7) { left: 65%; animation-duration: 15s; animation-delay: -4s; transform: scale(1.2); }
        .snow-layer i:nth-child(8) { left: 75%; animation-duration: 9s;  animation-delay: -2s; transform: scale(0.5); }
        .snow-layer i:nth-child(9) { left: 85%; animation-duration: 11s; animation-delay: -6s; transform: scale(1); }
        .snow-layer i:nth-child(10) { left: 95%; animation-duration: 14s; animation-delay: -1s; transform: scale(0.8); }
        .snow-layer i:nth-child(11) { left: 10%;  animation-duration: 10s; animation-delay: -8s; transform: scale(0.7); }
        .snow-layer i:nth-child(12) { left: 30%;  animation-duration: 11s; animation-delay: -3s; transform: scale(0.9); }

        @keyframes snow-fall {
          from {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          to {
            transform: translateY(110vh) translateX(30px) rotate(360deg);
          }
        }
      `}</style>
            <div className="snow-layer" aria-hidden="true">
                {Array.from({ length: 12 }).map((_, i) => (
                    <i key={i}></i>
                ))}
            </div>
        </>
    );
}
