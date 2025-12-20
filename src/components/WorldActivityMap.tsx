"use client";

import { useEffect, useState } from 'react';

type ActivityPoint = {
    lat: number;
    lng: number;
    intensity?: number;
};

// Simplified World Map Path (Commonly used low-res SVG path for performance)
const WorldMapPath = "M157.06,89.58l0.82-1.63L161,86.5l2.45-1.42l3.27-1.42l3.06,1.02l2.45,2.44v1.83h-1.63 l-1.64,1.83l-1.02,2.04l-2.04,1.22h-2.04L157.06,89.58z M181.56,91.82l2.04-1.22l2.25,1.22l1.02,2.85l-1.43,1.43l-3.27,0.2l-2.04-1.42 L181.56,91.82z M45.8,127.42l4.9,2.45l7.96,2.04l3.68,1.22l2.04-1.63L65,129.05l-1.02-3.87l-2.86-0.82l-2.86-1.84l-2.65,1.84 l-4.08-1.22l-5.72,4.28H45.8z M943.41,30.3l-2.65,1.22L939.73,30l-1.02,2.25l-2.65,1.02l-1.02,3.47l-1.43,2.04l-2.45,1.43 l-1.84,2.86l0.2,2.45l0.41,2.04l4.08,4.08l1.43,1.22l1.83-0.2l2.04-2.86l2.04-4.28l1.43-1.43h2.65l6.33-6.53l-0.82-2.04 l-3.06-2.65L943.41,30.3z M865.25,249.26l-3.27-1.02l-5.1,0.61l-4.49,1.02l-2.86,2.04l-0.82,2.25l-0.41,3.47l4.08,2.45l4.08,1.22 l-0.2,2.24l-3.06,1.43l-3.27,0.82l-5.1,1.02l-1.84,1.43l-0.41,2.45l2.45,3.67l3.88,1.43l3.27,0.41l3.06-1.43l1.84-2.24l-0.2-2.85 l1.02-2.24l4.69-2.04l3.27-1.83l1.84-2.04l-0.61-4.08l-2.65-4.49L865.25,249.26z M337.81,146.8l3.47-3.06l3.67-4.28l2.25-3.06 l2.65-3.67l3.06-2.04l-1.02-2.65l-2.65-1.43l-3.27,1.83l-2.86,2.24L337.81,146.8z M628.29,48.66l1.22,4.08l2.25,4.08l2.45,1.22 l2.24-0.61l-0.2-3.67l-2.04-3.67l-2.86-3.87L628.29,48.66z M771.77,101.5l1.02,2.86l2.04,1.43l2.86,2.45l-0.2,4.49l-1.02,1.22 l-3.06,1.02l-1.63,2.24l-0.41,2.04l0.41,2.25l-1.43,2.86l-1.22,2.45l-1.84-0.2l-1.43-1.63l-1.22-3.06l1.63-3.67l0.61-3.67 l2.65-2.25l2.45-3.67l4.29-3.06L771.77,101.5z M475.98,247.22l0.82-3.67l-0.41-3.47l-1.84-1.22l-4.49,2.86l-2.86,1.22l-3.47,1.63 l-4.29,2.04l-3.67,2.86l-0.82,2.45l2.86,0.61l3.47,0.2l2.65-0.82l2.45-2.45L475.98,247.22z M526.19,252.32l2.24-4.29l0.82-3.47 l-1.84-2.24l-3.88-0.61l-4.49-0.82l-3.67,1.84l-2.86,1.22l-3.06,3.06l-1.02,3.47l1.02,1.84l4.29,0.2l5.51-1.43L526.19,252.32z M654.41,211.91l4.49-1.22L663.8,212l1.63,2.86l-0.82,2.24l-2.45,2.45l-4.08,0.2l-3.67-2.65l-2.24-2.86L654.41,211.91z M155.63,83.05l1.63,0.61l2.04-1.22l2.65-1.43l0.41-2.45l-0.82-2.04l-1.43-3.06l-2.04-2.86l-2.25-0.82l-2.65,2.65l-0.82,3.27 l-1.43,2.24L155.63,83.05z M186.46,15.75l2.04-2.04l-0.41-3.06l-3.27-1.43l-3.06,1.43l-2.65,3.06l0.2,2.86l1.22,1.84l2.86,0.41 L186.46,15.75z M671.97,94.97l2.86-1.63l4.29-0.61l3.27,1.02l0.2,3.06l-2.04,1.84l-3.06,2.24l-3.67-0.41l-2.04-2.24L671.97,94.97z M127.06,183.13l3.67-1.02l4.49,1.43l-0.82,4.69l-3.67,2.24l-3.06,0.82l-1.84-1.22l-0.41-2.04L127.06,183.13z M606.04,152.92 l-1.22,2.24l0.41,4.49l2.86,1.63l3.67-0.41l2.24-2.65l0.41-2.24l-1.22-3.47l-3.27-1.63L606.04,152.92z";

export default function WorldActivityMap({ points = [] }: { points?: ActivityPoint[] }) {
    // We use a predefined path for the world map and overlay points
    // Coordinates need to be mapped from lat/lng to the SVG coordinate system
    // The SVG path above is approx 1009 x 665
    const width = 1009;
    const height = 450; // Cropped vertically for better fit

    return (
        <div className="w-full h-full bg-black relative overflow-hidden flex items-center justify-center">
            {/* Background Map Grid Pattern (Subtle & Dark) */}
            <div
                className="absolute inset-0 opacity-[0.15] bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-center bg-no-repeat bg-contain"
                style={{ filter: 'invert(1) brightness(0.8)' }}
            />

            {/* Radial glow to give depth */}
            <div className="absolute inset-0 bg-gradient-radial from-blue-500/5 to-transparent pointer-events-none" />

            {/* Activity Points Overlay */}
            {points.map((point, i) => {
                const x = (point.lng + 180) * (100 / 360);
                const y = (90 - point.lat) * (100 / 180);

                return (
                    <div
                        key={i}
                        className="absolute w-4 h-4 -ml-2 -mt-2"
                        style={{ left: `${x}%`, top: `${y}%` }}
                    >
                        {/* Dynamic Glowing Pulse */}
                        <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-40 animate-ping" style={{ animationDelay: `${i * 0.4}s`, animationDuration: '3s' }} />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white shadow-[0_0_15px_rgba(255,255,255,0.9),0_0_5px_rgba(74,222,128,0.8)]" />
                    </div>
                );
            })}
        </div>
    );
    );
}
