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
        const flakes = new Array(100).fill(0).map(() => ({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 2 + 1,
            vy: Math.random() * 0.8 + 0.4,
        }));

        const onResize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };

        const onMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        window.addEventListener('resize', onResize);
        window.addEventListener('mousemove', onMove);

        const loop = () => {
            ctx.clearRect(0, 0, w, h);

            for (const f of flakes) {
                const dx = f.x - mouse.x;
                const dy = f.y - mouse.y;
                const dist = Math.hypot(dx, dy);

                if (dist < 120) {
                    f.x += dx * 0.02;
                    f.y += dy * 0.02;
                }

                f.y += f.vy;
                if (f.y > h) f.y = -10;

                ctx.beginPath();
                ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,0.75)';
                ctx.fill();
            }

            rafRef.current = requestAnimationFrame(loop);
        };

        loop();

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('resize', onResize);
            window.removeEventListener('mousemove', onMove);
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
            }}
        />
    );
}
