"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import VideoModal from '../VideoModal';

export default function HeroEN() {
    const [showVideo, setShowVideo] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <section className="relative pt-32 pb-24 px-4 md:px-8 lg:px-16 overflow-hidden bg-white">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-green-500/10 rounded-full blur-3xl opacity-30" />
            <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl opacity-30" />

            <div className="max-w-7xl mx-auto text-center relative z-10">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100 text-green-700 text-xs sm:text-sm font-black uppercase tracking-widest mb-8 animate-fade-in">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    The future of selling is here
                </div>

                {/* Main Headline */}
                <div className="relative mb-16">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8 leading-[1.1] text-slate-900">
                        Create an online store just by filling out a <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 underline decoration-green-500/30 decoration-8 underline-offset-8">form.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
                        0% commissions · No credit card · All automatic. <br className="hidden md:block" />
                        The first month is on us. Join thousands of entrepreneurs today.
                    </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-24 px-4">
                    <Link
                        href="/en/auth/register"
                        className="group relative inline-flex min-h-[48px] sm:min-h-[56px] md:h-16 w-full sm:w-auto items-center justify-center rounded-xl sm:rounded-2xl bg-green-600 px-6 sm:px-8 md:px-10 font-black text-white shadow-2xl shadow-green-600/30 transition-all hover:bg-green-700 hover:scale-105 active:scale-95 text-base sm:text-lg md:text-xl tracking-tight">
                        <span>Create my store NOW</span>
                        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:animate-shine" />
                    </Link>

                    <button
                        onClick={() => setShowVideo(true)}
                        className="group inline-flex min-h-[48px] sm:min-h-[56px] md:h-16 w-full sm:w-auto items-center justify-center rounded-xl sm:rounded-2xl border-2 border-slate-300 bg-white px-6 sm:px-8 md:px-10 font-bold text-slate-700 transition-all hover:border-green-600 hover:text-green-600 hover:shadow-lg text-base sm:text-lg md:text-xl"
                    >
                        <div className="mr-2 sm:mr-3 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-slate-100 group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
                            <svg className="h-4 w-4 sm:h-5 sm:w-5 fill-current ml-0.5" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        Watch Demo
                    </button>
                </div>


                {/* Comparison Table */}
                <div className="max-w-4xl mx-auto mb-20">
                    <div className="text-center mb-2 sm:hidden">
                        <p className="text-xs text-gray-400 font-medium">← Swipe to see more →</p>
                    </div>

                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <div className="px-4 sm:px-0 min-w-max sm:min-w-0">
                            <div className="overflow-hidden rounded-2xl sm:rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl shadow-green-100/20">
                                <table className="w-full text-left border-collapse min-w-[600px] sm:min-w-0">
                                    <thead>
                                        <tr className="bg-slate-50">
                                            <th className="p-3 sm:p-4 md:p-6 lg:p-8 text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-wider">Feature</th>
                                            <th className="p-3 sm:p-4 md:p-6 lg:p-8 text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">Others</th>
                                            <th className="p-3 sm:p-4 md:p-6 lg:p-8 text-[9px] sm:text-[10px] font-black text-green-700 uppercase tracking-wider text-center bg-green-100">Creatiendas</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        <tr className="group hover:bg-slate-50 transition-colors">
                                            <td className="p-3 sm:p-4 md:p-6 lg:p-8 font-bold text-xs sm:text-sm md:text-base text-slate-700">Monthly Price</td>
                                            <td className="p-3 sm:p-4 md:p-6 lg:p-8 text-center text-rose-500 font-extrabold text-xs sm:text-sm md:text-base">$29+ USD</td>
                                            <td className="p-3 sm:p-4 md:p-6 lg:p-8 text-center text-green-600 font-black bg-green-50/5 text-xs sm:text-sm md:text-base">$60,000 (1st month FREE)</td>
                                        </tr>
                                        <tr className="group hover:bg-slate-50 transition-colors">
                                            <td className="p-3 sm:p-4 md:p-6 lg:p-8 font-bold text-xs sm:text-sm md:text-base text-slate-700">Setup Time</td>
                                            <td className="p-3 sm:p-4 md:p-6 lg:p-8 text-center text-slate-500 font-semibold text-xs sm:text-sm md:text-base">Hours / Days</td>
                                            <td className="p-3 sm:p-4 md:p-6 lg:p-8 text-center text-green-600 font-black bg-green-50/5 text-xs sm:text-sm md:text-base">2 minutes</td>
                                        </tr>
                                        <tr className="group hover:bg-slate-50 transition-colors">
                                            <td className="p-3 sm:p-4 md:p-6 lg:p-8 font-bold text-xs sm:text-sm md:text-base text-slate-700">Native WhatsApp</td>
                                            <td className="p-3 sm:p-4 md:p-6 lg:p-8 text-center text-rose-500 font-bold">
                                                <div className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base">
                                                    <span className="text-base sm:text-lg">❌</span> Extra plugins
                                                </div>
                                            </td>
                                            <td className="p-3 sm:p-4 md:p-6 lg:p-8 text-center text-green-600 font-black bg-green-50/5">
                                                <div className="flex items-center justify-center gap-1 sm:gap-2 font-black text-xs sm:text-sm md:text-base">
                                                    <span className="text-lg sm:text-xl">✅</span> Integrated
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Proof */}
                <div className="flex flex-wrap justify-center gap-16 text-center border-t border-slate-200 pt-12">
                    <div>
                        <div className="text-4xl font-black text-slate-900 mb-1">+2,500</div>
                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Stores Created</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-slate-900 mb-1">2m</div>
                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Setup Time</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-slate-900 mb-1">LATAM</div>
                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Made for us</div>
                    </div>
                </div>
            </div>

            {/* Video Modal */}
            <VideoModal
                isOpen={showVideo}
                onClose={() => setShowVideo(false)}
                videoSrc="https://youtu.be/XQQfQYZ0Phk"
            />
        </section>
    );
}
