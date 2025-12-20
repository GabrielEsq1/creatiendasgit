'use client';

import { useEffect, useRef } from 'react';

interface Props {
  enabled: boolean;
}

export default function SnowOverlay({ enabled }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const mouse = { x: -9999, y: -9999 };
    // Increased flake count for "embobada" effect
    const flakeCount = 250;
    const flakes = new Array(flakeCount).fill(0).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2.5 + 1.5,
      vy: Math.random() * 1.2 + 0.5,
      vx: Math.random() * 1 - 0.5,
      opacity: Math.random() * 0.5 + 0.3
    }));

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchstart', onTouch);
    window.addEventListener('touchmove', onTouch);

    const loop = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      for (const f of flakes) {
        // Interaction logic: Repulsion from mouse
        const dx = f.x - mouse.x;
        const dy = f.y - mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 150) {
          const force = (150 - dist) / 150;
          f.x += dx * force * 0.05;
          f.y += dy * force * 0.05;
        }

        f.y += f.vy;
        f.x += f.vx;

        if (f.y > h) {
          f.y = -10;
          f.x = Math.random() * w;
        }
        if (f.x > w) f.x = 0;
        if (f.x < 0) f.x = w;

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity * 0.4})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('touchmove', onTouch);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 40,
        pointerEvents: 'none',
        background: 'transparent'
      }}
    />
  );
}
