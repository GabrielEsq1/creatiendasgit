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
        const verified = searchParams?.get("verified");
        const errorParam = searchParams?.get("error");

        if (verified === "true") {
            setSuccessMessage("Email verified! You can now log in.");
        } else if (verified === "already") {
            setSuccessMessage("Your email was already verified. Log in below.");
        } else if (searchParams?.get("registered") === "true") {
            setSuccessMessage("Account created successfully. You can now log in.");
        }

        if (errorParam === "invalid_token") {
            setError("The verification link is invalid or has already been used.");
        } else if (errorParam === "token_missing") {
            setError("The verification link appears to be incorrect.");
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
                if (result.error === "EMAIL_NOT_VERIFIED") {
                    setError("Please verify your email first! Check your inbox and click the link we sent you.");
                } else {
                    setError("Invalid credentials");
                }
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
        <div className="min-h-screen bg-white md:bg-slate-50 text-slate-900 selection:bg-green-500/30 font-sans overflow-x-hidden pt-20 flex flex-col items-center">
            
            {/* --- MOBILE LAYOUT (FROM SCRATCH) --- */}
            <div className="w-full max-w-[400px] mx-auto flex flex-col lg:hidden px-6 pt-6 pb-12 bg-white relative z-20">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-slate-900 mb-1">Welcome Back</h1>
                    <p className="text-slate-500 text-sm font-semibold tracking-wide">Manage your WhatsApp store</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Email</label>
                        <div className="relative group/input">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/input:text-green-600 transition-colors" />
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600/50 transition-all shadow-inner" placeholder="you@email.com" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
                            <Link href="/en/auth/forgot-password" className="text-[11px] font-bold text-green-600 hover:text-green-500 transition-colors">Forgot?</Link>
                        </div>
                        <div className="relative group/input">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/input:text-green-600 transition-colors" />
                            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600/50 transition-all shadow-inner" placeholder="••••••••" />
                        </div>
                    </div>

                    {error && <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-600 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-600" />{error}</div>}
                    {successMessage && <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-bold text-emerald-600 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />{successMessage}</div>}

                    <div className="text-center py-1 overflow-hidden mt-2">
                        <p className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider">
                            No card · Cancelable · Instant Access
                        </p>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-black py-4 rounded-2xl transition-all shadow-xl shadow-green-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Enter Dashboard <ArrowRight className="w-4 h-4" /></>}
                    </button>
                </form>

                <p className="text-center mt-8 text-sm text-slate-500 font-medium">
                    Don't have an account yet?{' '}
                    <Link href="/en/auth/register" className="font-black text-green-600">Start for free now</Link>
                </p>

                <a href="https://wa.me/573026687991?text=Help%20login" target="_blank" className="mt-8 bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm active:scale-95 transition-transform">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-900">Problems?</p>
                            <p className="text-[10px] text-slate-500">Live support</p>
                        </div>
                    </div>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-lg">Chat</span>
                </a>
            </div>

            {/* --- DESKTOP LAYOUT --- */}
            <div className="hidden lg:grid max-w-6xl w-full mx-auto grid-cols-2 gap-12 items-center relative z-10 py-12">
                <div className="space-y-8 pr-0 lg:pr-8">
                    <div className="space-y-6">
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

                <div className="flex justify-end">
                    <div className="w-full max-w-[440px] bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-green-500/10 transition-all"></div>
                        <div className="text-center mb-10 relative z-10">
                            <h1 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h1>
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Manage your WhatsApp store</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Email</label>
                                <div className="relative group/input">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/input:text-green-600 transition-colors" />
                                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600/50 transition-all shadow-inner" placeholder="you@email.com" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                                    <Link href="/en/auth/forgot-password" className="text-xs font-bold text-green-600 hover:text-green-500 transition-colors">Forgot?</Link>
                                </div>
                                <div className="relative group/input">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/input:text-green-600 transition-colors" />
                                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600/50 transition-all shadow-inner" placeholder="••••••••" />
                                </div>
                            </div>
                            {error && <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-600 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-600" />{error}</div>}
                            {successMessage && <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-bold text-emerald-600 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />{successMessage}</div>}
                            <div className="text-center py-2"><p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-4">No card · Cancelable · Instant Access</p></div>
                            <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-black py-4 rounded-2xl transition-all shadow-xl shadow-green-200 hover:shadow-green-500/40 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Enter Dashboard <ArrowRight className="w-4 h-4" /></>}
                            </button>
                        </form>
                        <p className="text-center mt-8 text-sm text-slate-500 font-medium">Don't have an account yet?{' '}<Link href="/en/auth/register" className="font-black text-green-600 hover:text-green-500 transition-colors">Start for free now</Link></p>
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
