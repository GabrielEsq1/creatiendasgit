"use client";

import { useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPageEN() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

    const handleRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/reset-request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, turnstileToken }),
            });

            const data = await res.json();

            if (res.ok) {
                setEmailSent(true);
            } else {
                setError(data.error || "Error requesting recovery");
            }
        } catch (err) {
            setError("Connection error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 selection:bg-green-500/30">
                <div className="w-full max-w-[440px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 md:p-12 text-center space-y-6">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-black text-slate-900">Email Sent</h1>
                        <p className="text-slate-500 text-sm">
                            If <span className="font-bold text-slate-900">{email}</span> is registered, you will receive a link to reset your password in a few minutes.
                        </p>
                    </div>
                    <div className="pt-4">
                        <Link href="/en/auth/login" className="inline-flex items-center gap-2 text-green-600 font-bold hover:gap-3 transition-all">
                            Back to Login <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 selection:bg-green-500/30">
            <div className="w-full max-w-[440px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                
                <div className="mb-10">
                    <Link href="/en/auth/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-xs uppercase tracking-widest transition-colors mb-6 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back
                    </Link>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">Recover Access</h1>
                    <p className="text-slate-500 text-sm">Enter your email and we'll send you a secure link to create a new password.</p>
                </div>

                <form onSubmit={handleRequest} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Email Address</label>
                        <div className="relative group/input">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/input:text-green-600 transition-colors" />
                            <input 
                                type="email" 
                                required 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600/50 transition-all shadow-inner" 
                                placeholder="you@example.com" 
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                            {error}
                        </div>
                    )}

                    {/* Cloudflare Turnstile */}
                    <div className="flex justify-center my-4">
                        <div 
                            className="cf-turnstile" 
                            data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
                            data-callback="onTurnstileSuccess"
                        ></div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-black py-4 rounded-2xl transition-all shadow-xl shadow-green-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Send Secure Link <ArrowRight className="w-4 h-4" /></>}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400 font-medium">
                        Didn't receive the email? Check your spam folder or contact support via WhatsApp.
                    </p>
                </div>
            </div>

            <Script 
                src="https://challenges.cloudflare.com/turnstile/v0/api.js" 
                strategy="lazyOnload"
                onLoad={() => {
                    (window as any).onTurnstileSuccess = (token: string) => {
                        setTurnstileToken(token);
                    };
                }}
            />
        </div>
    );
}
