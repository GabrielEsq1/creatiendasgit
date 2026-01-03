"use client";
export const dynamic = 'force-dynamic';

import { signIn, getSession } from "next-auth/react";
import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SocialProofSection } from "@/components/SocialProofSection";

function LoginFormEN() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";

    useEffect(() => {
        if (searchParams?.get("registered") === "true") {
            setSuccessMessage("Account created successfully. You can now log in.");
        }
    }, [searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid credentials");
            } else {
                const session = await getSession();
                if (session?.user?.role === 'ADMIN') {
                    router.push('/admin');
                } else {
                    router.push(callbackUrl);
                }
                router.refresh();
            }
        } catch (err) {
            setError("Connection error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4 selection:bg-green-500/30 font-sans">
            <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">

                {/* LEFT COLUMN: Social Proof */}
                <div className="order-2 lg:order-1 space-y-8 pr-0 lg:pr-8">
                    <div className="hidden lg:block space-y-6">
                        <Link href="/en" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors mb-4 group text-sm uppercase tracking-widest">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to home
                        </Link>
                        <h2 className="text-5xl font-black text-slate-900 leading-tight">
                            Join the real traction of <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Creatiendas</span>
                        </h2>
                        <p className="text-xl text-slate-600 font-medium">
                            More than a tool, we are a community of entrepreneurs growing every day.
                        </p>
                    </div>

                    <SocialProofSection />
                </div>

                {/* RIGHT COLUMN: Login Form */}
                <div className="order-1 lg:order-2 flex justify-center lg:justify-end mb-8 lg:mb-0">
                    <div className="w-full max-w-[440px] bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-8 sm:p-12 relative overflow-hidden group hover:border-green-500/30 transition-all duration-500">
                        {/* Decoration blob */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-green-500/10 transition-all"></div>

                        {/* Mobile Header */}
                        <div className="text-center mb-10 relative z-10">
                            <h1 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h1>
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Manage your WhatsApp store</p>
                        </div>

                        {/* Credentials Form */}
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Email</label>
                                <div className="relative group/input">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/input:text-green-600 transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all shadow-inner"
                                        placeholder="you@email.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                                    <Link href="/en/auth/forgot-password" title="Forgot Password" className="text-xs font-bold text-green-600 hover:text-green-700 transition-colors">
                                        Forgot?
                                    </Link>
                                </div>
                                <div className="relative group/input">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/input:text-green-600 transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all shadow-inner"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-sm font-bold text-rose-600 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                    {error}
                                </div>
                            )}

                            {successMessage && (
                                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-sm font-bold text-emerald-600 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    {successMessage}
                                </div>
                            )}

                            <div className="text-center py-2">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                                    No card · Cancelable · Instant Access
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-green-600 hover:bg-green-700 text-white text-lg font-black py-4 rounded-2xl transition-all shadow-xl shadow-green-100 hover:shadow-green-600/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Enter Dashboard <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="text-center mt-8 text-sm text-slate-500 font-medium">
                            Don't have an account yet?{' '}
                            <Link href="/en/auth/register" className="font-black text-green-600 hover:text-green-700 transition-colors">
                                Start for free now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPageEN() {
    return (
        <Suspense fallback={<div className="min-h-screen grid place-items-center bg-white"><div className="w-8 h-8 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" /></div>}>
            <LoginFormEN />
        </Suspense>
    );
}
