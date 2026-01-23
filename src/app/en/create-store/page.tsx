import Link from 'next/link';
import { Sparkles, CheckCircle, MessageCircle, Clock, Store, ArrowRight } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create Your Free Online Store | Creatiendas',
    description: 'Create your online store in 2 minutes and sell via WhatsApp. No commissions, no hassle. Start free today.',
    openGraph: {
        title: 'Create Your Free Online Store | Creatiendas',
        description: 'Sell via WhatsApp in minutes. No commissions, no hassle.',
    }
};

export default function CreateStorePageEN() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800">
            {/* Header */}
            <div className="pt-8 px-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Link href="/en" className="text-white font-black text-2xl flex items-center gap-2">
                        <Store className="w-8 h-8" />
                        Creatiendas
                    </Link>
                    <Link
                        href="/en/auth/login"
                        className="text-white/80 hover:text-white font-semibold"
                    >
                        Log In
                    </Link>
                </div>
            </div>

            {/* Hero */}
            <section className="py-20 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-full mb-8 font-bold text-sm">
                        <Sparkles className="w-4 h-4" />
                        FREE PLAN AVAILABLE
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
                        Create Your Online Store
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                            in 2 Minutes
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto">
                        Sell via WhatsApp with no commissions, no inventory, no hassle.
                        <br />
                        Start free and grow with us.
                    </p>

                    {/* CTA */}
                    <Link
                        href="/en/auth/register"
                        className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-green-500/30 hover:scale-105 transition-all"
                    >
                        Create My Free Store
                        <ArrowRight className="w-6 h-6" />
                    </Link>

                    <p className="mt-4 text-white/60 text-sm">
                        No credit card required
                    </p>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                        <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-7 h-7 text-green-400" />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">No Commissions</h3>
                        <p className="text-white/70">You keep 100% of every sale. No surprises.</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                        <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <MessageCircle className="w-7 h-7 text-green-400" />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">Sell on WhatsApp</h3>
                        <p className="text-white/70">Your customers buy directly from WhatsApp.</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                        <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-7 h-7 text-green-400" />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">Ready in 2 Minutes</h3>
                        <p className="text-white/70">No complicated setups. Just create and sell.</p>
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <section className="py-16 px-4 border-t border-white/10">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="flex flex-wrap justify-center gap-12 text-white">
                        <div>
                            <div className="text-4xl font-black">+2,500</div>
                            <div className="text-white/60 text-sm font-semibold">Stores Created</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black">LATAM</div>
                            <div className="text-white/60 text-sm font-semibold">Built for LATAM</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black">100%</div>
                            <div className="text-white/60 text-sm font-semibold">Free to start</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 px-4 text-center">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                        Start selling today
                    </h2>
                    <p className="text-white/70 mb-8">
                        Join thousands of entrepreneurs who are already selling with Creatiendas
                    </p>
                    <Link
                        href="/en/auth/register"
                        className="inline-flex items-center gap-3 bg-white text-indigo-600 px-10 py-5 rounded-2xl font-black text-xl shadow-2xl hover:scale-105 transition-all"
                    >
                        Create My Free Store
                        <ArrowRight className="w-6 h-6" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 border-t border-white/10 text-center">
                <p className="text-white/50 text-sm">
                    {new Date().getFullYear()} Creatiendas. All rights reserved.
                </p>
            </footer>
        </main>
    );
}
