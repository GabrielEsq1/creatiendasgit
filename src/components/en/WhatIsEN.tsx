import React from 'react';

export default function WhatIsEN() {
    return (
        <section className="py-16 px-4 md:px-8 lg:px-16 bg-black">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Card 1 */}
                <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-10 flex flex-col justify-center hover:border-green-500/30 transition-all">
                    <h3 className="text-2xl font-black text-white mb-4">
                        What is Creatiendas? 🎁
                    </h3>
                    <p className="text-slate-400 leading-relaxed font-medium">
                        Creatiendas allows you to create an online store in minutes, without
                        complications and without commissions. Everything you need to sell
                        your products directly through WhatsApp. ✨
                    </p>
                </div>
                {/* Card 2 */}
                <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-10 flex flex-col justify-center hover:border-green-500/30 transition-all">
                    <h3 className="text-2xl font-black text-white mb-4">
                        Ideal for 🎅
                    </h3>
                    <ul className="grid grid-cols-2 gap-2 text-slate-400 font-bold">
                        <li className="flex items-center gap-2"><span>❄️</span> Entrepreneurs</li>
                        <li className="flex items-center gap-2"><span>❄️</span> Stores</li>
                        <li className="flex items-center gap-2"><span>❄️</span> Brands</li>
                        <li className="flex items-center gap-2"><span>❄️</span> Businesses</li>
                        <li className="flex items-center gap-2"><span>❄️</span> Dropshipping</li>
                    </ul>
                </div>
            </div>
        </section>
    );
}
