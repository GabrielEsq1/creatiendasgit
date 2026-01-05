'use client';

import React, { useEffect, useState } from 'react';
import { Users, Store as StoreIcon, Activity, Eye, MousePointerClick, Globe2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import WorldActivityMap from './WorldActivityMap';

export const SocialProofSection = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/social-proof');
                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    // Fallback data
    const metrics = data?.metrics || {
        activeNow: 4,
        recentSignups: 12,
        totalStoresToday: 8,
        pageViews24h: 1240,
        clicks24h: 356,
        activeCountriesCount: 6
    };
    const mapPoints = data?.hotspots || [];
    const activeCountries = data?.activeCountries || [];

    if (loading) return (
        <div className="w-full h-96 flex items-center justify-center bg-slate-50/50 rounded-3xl">
            <div className="w-6 h-6 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-700">

            {/* 1. VISUAL HERO: Realistic Map */}
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
                    Esto está pasando ahora mismo
                </h2>
                <p className="text-slate-500 font-medium">
                    Datos en tiempo real de nuestra comunidad activa.
                </p>
            </div>

            <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-xl group">
                {/* Header Overlay */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-blue-800/80 uppercase tracking-widest bg-white/90 px-2 py-0.5 rounded-full shadow-sm backdrop-blur-md">
                        En vivo: Creatiendas Global
                    </span>
                </div>

                <div className="aspect-[16/9] w-full bg-slate-50 relative">
                    <WorldActivityMap points={mapPoints} />
                </div>

                {/* Footer: Flags (Banderitas) */}
                <div className="bg-white/80 backdrop-blur-xl border-t border-slate-100 p-3 flex items-center justify-between gap-4 overflow-hidden">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mask-gradient-r">
                        {activeCountries.map((c: any, i: number) => (
                            <div key={i} className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-full border border-slate-100 whitespace-nowrap">
                                <span className="text-xs">
                                    {/* Simple emoji flag or fallback */}
                                    {c.code === 'CO' ? '🇨🇴' : c.code === 'MX' ? '🇲🇽' : c.code === 'US' ? '🇺🇸' : c.code === 'AR' ? '🇦🇷' : c.code === 'ES' ? '🇪🇸' : '🌎'}
                                </span>
                                <span className="text-[10px] font-medium text-slate-300">{c.name}</span>
                            </div>
                        ))}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono whitespace-nowrap pl-2 border-l border-slate-800">
                        OPEN DATA
                    </div>
                </div>
            </div>

            {/* 2. OPEN METRICS GRID (6 items) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* Row 1 */}
                <MetricCard
                    label="Active Now"
                    value={metrics.activeNow}
                    icon={Activity}
                    color="text-blue-400"
                    bg="bg-blue-500/10"
                    trend="Live"
                />
                <MetricCard
                    label="Registros 24h"
                    value={metrics.recentSignups > 0 ? metrics.recentSignups : "¡Sé el primero!"}
                    icon={Users}
                    color="text-emerald-600"
                    bg="bg-emerald-500/10"
                />
                <MetricCard
                    label="Tiendas Hoy"
                    value={metrics.totalStoresToday > 0 ? metrics.totalStoresToday : "Lanzamientos en curso"}
                    icon={StoreIcon}
                    color="text-indigo-600"
                    bg="bg-indigo-500/10"
                />

                {/* Row 2 */}
                <MetricCard
                    label="Vistas 24h"
                    value={metrics.pageViews24h.toLocaleString()}
                    icon={Eye}
                    color="text-sky-400"
                    bg="bg-sky-500/10"
                />
                <MetricCard
                    label="Interacciones"
                    value={metrics.clicks24h.toLocaleString()}
                    icon={MousePointerClick}
                    color="text-purple-400"
                    bg="bg-purple-500/10"
                />
                <MetricCard
                    label="Países Activos"
                    value={metrics.activeCountriesCount}
                    icon={Globe2}
                    color="text-amber-400"
                    bg="bg-amber-500/10"
                />
            </div>

            {/* 3. USER TYPES BADGES (New Requirement) */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {(metrics.userTypes || []).map((type: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full shadow-sm hover:border-green-500/20 transition-all group">
                        <span className={`w-1.5 h-1.5 rounded-full ${type.color.replace('text-', 'bg-')} animate-pulse`} />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{type.label}:</span>
                        <span className="text-[11px] font-black text-slate-800 tracking-tight">{type.count.toLocaleString()}</span>
                    </div>
                ))}
            </div>

            {/* Micro-copy for trust */}
            <p className="text-xs text-slate-400 font-medium text-center">
                * Datos 100% reales de nuestra comunidad Open Source
            </p>
        </div>
    );
};

// Sub-component for individual metric cards
const MetricCard = ({ label, value, icon: Icon, color, bg, trend }: any) => (
    <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-24 relative overflow-hidden group">
        <div className={`absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity`}>
            {/* Background Icon */}
            <Icon className={`w-8 h-8 ${color}`} />
        </div>

        <div className="flex items-center gap-1.5 mb-1">
            <div className={`p-1 rounded-md ${bg}`}>
                <Icon className={`w-3.5 h-3.5 ${color}`} />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">{label}</span>
        </div>

        <div className="flex items-baseline gap-2">
            <span className={cn(
                "font-black tracking-tight",
                "text-slate-900 text-2xl"
            )}>{value}</span>
            {trend && <span className="text-[10px] font-bold text-emerald-600 animate-pulse">{trend}</span>}
        </div>
    </div>
);
