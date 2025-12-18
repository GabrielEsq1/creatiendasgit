"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path: string) =>
        pathname === path
            ? 'text-green-500 font-bold'
            : 'text-slate-300 hover:text-white transition-colors';

    // Check if we are on the homepage to decide initial transparency
    const isHome = pathname === '/';

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || !isHome
                ? 'bg-[#0f172a]/80 backdrop-blur-lg border-b border-white/10 py-3 shadow-2xl'
                : 'bg-transparent py-5'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Area */}
                    <div className="flex items-center">
                        <Link href={session ? "/dashboard" : "/"} className="flex items-center group">
                            <div className="relative">
                                <img src="/logo.png" alt="Creatiendas" className="h-10 transition-transform group-hover:scale-105" />
                                {isHome && !scrolled && (
                                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 transition-all group-hover:w-full" />
                                )}
                            </div>
                        </Link>

                        {/* Desktop Menu */}
                        {session && (
                            <div className="hidden md:flex ml-10 space-x-8 items-center">
                                <Link href="/dashboard" className={isActive('/dashboard')}>
                                    Dashboard
                                </Link>
                                <Link href="/dashboard/stores" className={isActive('/dashboard/stores')}>
                                    Mis Tiendas
                                </Link>
                                <Link href="/dashboard/billing" className={isActive('/dashboard/billing')}>
                                    Mi Plan
                                </Link>

                                {/* Admin-Only Menu */}
                                {(session.user as any)?.role === 'ADMIN' && (
                                    <div className="flex items-center gap-6 pl-6 border-l border-white/10">
                                        <Link
                                            href="/admin"
                                            className={`${isActive('/admin')} flex items-center gap-2`}
                                        >
                                            <span className="px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] rounded-full font-black uppercase tracking-tighter">Admin</span>
                                            Panel
                                        </Link>
                                        <Link href="/admin/users" className={isActive('/admin/users')}>
                                            Usuarios
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-5">
                        {status === 'loading' ? (
                            <div className="h-4 w-20 bg-white/10 animate-pulse rounded" />
                        ) : session ? (
                            <div className="flex items-center gap-6">
                                <div className="hidden sm:flex flex-col items-end">
                                    <span className="text-xs text-slate-400">Sesión de</span>
                                    <span className="text-sm font-semibold text-white leading-tight">{session.user?.name}</span>
                                </div>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="group flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 transition-all hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400"
                                >
                                    <span>Salir</span>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/auth/login"
                                    className="text-slate-300 hover:text-white px-4 py-2 text-sm font-medium transition-colors"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-green-500/20 transition-all active:scale-95"
                                >
                                    Empezar Gratis
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
