'use client';

import React from 'react';
import { MessageSquare, ShoppingBag, ArrowRight } from 'lucide-react';

export default function HubPromoBannerEN() {
    return (
        <section className="py-16 px-4 md:px-8 lg:px-16 bg-slate-50 border-y border-slate-100">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
                        🚀 Discover the Total Hub
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                        Power your business with our complete ecosystem
                    </h2>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                        Two powerful tools, one mission: grow your business
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-10">
                    {/* B2BChat Card */}
                    <div className="bg-white border border-slate-100 rounded-3xl p-8 hover:border-blue-500/30 transition-all hover:-translate-y-1 shadow-xl shadow-slate-200/50">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-blue-50 p-4 rounded-2xl">
                                <MessageSquare className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <div className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold mb-1">
                                    B2B
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">B2BChat</h3>
                                <p className="text-slate-600 text-sm">Your B2B conversation engine</p>
                            </div>
                        </div>

                        <ul className="space-y-3 mb-6">
                            <li className="flex items-start gap-3">
                                <span className="text-blue-600 font-bold">✓</span>
                                <span className="text-slate-700 text-sm">Generate qualified conversations between real companies</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-blue-600 font-bold">✓</span>
                                <span className="text-slate-700 text-sm">Eliminate lost emails, cold LinkedIn and informal WhatsApp</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-blue-600 font-bold">✓</span>
                                <span className="text-slate-700 text-sm">Connect with verified decision makers</span>
                            </li>
                        </ul>

                        <div className="flex flex-wrap gap-2">
                            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold">
                                VERIFIED COMPANIES
                            </span>
                            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold">
                                REAL CONVERSATIONS
                            </span>
                        </div>
                    </div>

                    {/* CreaTiendas Card */}
                    <div className="bg-white border border-slate-100 rounded-3xl p-8 hover:border-green-500/30 transition-all hover:-translate-y-1 shadow-xl shadow-slate-200/50">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-green-50 p-4 rounded-2xl">
                                <ShoppingBag className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                                <div className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold mb-1">
                                    B2C
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">CreaTiendas</h3>
                                <p className="text-slate-600 text-sm">Turn conversations into sales</p>
                            </div>
                        </div>

                        <ul className="space-y-3 mb-6">
                            <li className="flex items-start gap-3">
                                <span className="text-green-600 font-bold">✓</span>
                                <span className="text-slate-700 text-sm">Transform chats into real orders</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-600 font-bold">✓</span>
                                <span className="text-slate-700 text-sm">Online store connected to WhatsApp</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-600 font-bold">✓</span>
                                <span className="text-slate-700 text-sm">No commissions · No friction · Instant activation</span>
                            </li>
                        </ul>

                        <div className="flex flex-wrap gap-2">
                            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold">
                                DIRECT SALES
                            </span>
                            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold">
                                INSTANT EXECUTION
                            </span>
                        </div>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="text-center">
                    <a
                        href="https://b2-chat-ruddy.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#22c55e] text-white font-bold px-8 py-4 rounded-xl hover:bg-green-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        Visit B2BChat Hub
                        <ArrowRight className="w-5 h-5" />
                    </a>
                    <p className="text-slate-500 text-sm mt-4">
                        Over 1,000 active companies · Conversations with real intent
                    </p>
                </div>
            </div>
        </section>
    );
}
