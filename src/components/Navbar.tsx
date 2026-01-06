"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useAnalytics } from '@/components/Analytics';

export default function Navbar() {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { trackEvent } = useAnalytics();

    // HIDE NAVBAR on store pages or specialized preview views to avoid clutter
    const isStorePage = pathname?.includes('/stores/');
    const isSuccessPage = pathname?.includes('/builder/success');
    if (isStorePage || isSuccessPage) return null;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path: string) =>
        pathname === path
            ? 'text-green-600 font-bold border-b-2 border-green-500 h-full flex items-center'
            : 'text-slate-600 hover:text-green-600 transition-colors h-full flex items-center font-medium';

    const isHome = pathname === '/';

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all bg-white/80 backdrop-blur-xl border-b border-slate-100 ${scrolled ? 'py-1 shadow-lg shadow-slate-200/50' : 'py-2'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Area */}
                    <div className="flex items-center">
                        <Link href={session ? "/dashboard" : "/"} className="flex items-center group relative">
                            <img src="/logo.png" className="h-8 sm:h-10 w-auto object-contain" alt="CreaTiendas" />
                        </Link>

                        {/* Desktop Menu */}
                        {session && (
                            <div className="hidden lg:flex ml-10 space-x-8 items-center h-16">
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
                                    <div className="flex items-center gap-6 pl-6 border-l border-gray-100 h-16">
                                        <Link
                                            href="/admin"
                                            className={`${isActive('/admin')} flex items-center gap-2`}
                                        >
                                            <span className="px-2 py-0.5 bg-red-950/30 text-red-500 border border-red-500/20 text-[10px] rounded font-black uppercase tracking-tighter shadow-sm">Admin</span>
                                            Panel
                                        </Link>
                                        <Link href="/admin/users" className={isActive('/admin/users')}>
                                            Usuarios
                                        </Link>
                                    </div>
                                )}
                                {/* Admin-Only Main Link */}
                                {(session.user as any)?.role === 'ADMIN' && (
                                    <Link
                                        href="/admin"
                                        className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-200 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wide flex items-center gap-2 transition-all shadow-sm"
                                    >
                                        <span>Panel Admin</span>
                                    </Link>
                                )}
                            </div>
                        )}
                        {!session && (
                            <div className="hidden lg:flex ml-10 space-x-8 items-center h-16">
                                <Link href="/#demo" className="text-gray-600 hover:text-green-600 font-bold h-full flex items-center transition-colors">Demo</Link>
                                <Link href="/#features" className="text-gray-600 hover:text-green-600 font-bold h-full flex items-center transition-colors">Características</Link>
                            </div>
                        )}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        {/* 3D Language Switcher */}
                        <button
                            onClick={() => {
                                const isEn = pathname?.startsWith('/en');
                                const targetPath = isEn
                                    ? (pathname?.replace(/^\/en/, '') || '/')
                                    : `/en${pathname === '/' ? '' : pathname}`;
                                window.location.href = targetPath;
                            }}
                            className="hidden lg:block group relative w-24 h-10 bg-slate-50 rounded-full p-1 cursor-pointer border border-slate-200 shadow-inner overflow-hidden transition-all hover:border-green-500/30"
                            title="Cambiar idioma / Switch language"
                        >
                            {/* Sliding Background */}
                            <div className={`absolute top-1 bottom-1 w-[45%] bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg transition-all duration-300 ease-out ${pathname?.startsWith('/en') ? 'left-[52%]' : 'left-[3%]'
                                }`}>
                                <div className="absolute inset-0 bg-white/20 rounded-full" />
                            </div>

                            {/* Text Labels */}
                            <div className="relative z-10 flex w-full h-full text-[10px] font-black uppercase tracking-widest items-center justify-between px-3">
                                <span className={`transition-colors duration-300 ${!pathname?.startsWith('/en') ? 'text-white drop-shadow-md' : 'text-slate-500'}`}>ES</span>
                                <span className={`transition-colors duration-300 ${pathname?.startsWith('/en') ? 'text-white drop-shadow-md' : 'text-slate-500'}`}>EN</span>
                            </div>
                        </button>

                        {status === 'loading' ? (
                            <div className="h-4 w-20 bg-slate-800 animate-pulse rounded" />
                        ) : session ? (
                            <div className="flex items-center gap-2 sm:gap-4">
                                <Link
                                    href="/dashboard"
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-green-200 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                                >
                                    <span className="hidden xs:inline">Ir a mi</span><span>Panel</span>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                                <div className="hidden sm:flex flex-col items-end">
                                    <span className="text-[10px] uppercase font-bold text-slate-500 leading-none mb-1">Sesión de</span>
                                    <span className="text-sm font-black text-slate-900 leading-none">{session.user?.name}</span>
                                </div>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-sm font-bold text-slate-300 transition-all hover:bg-rose-950/30 hover:border-rose-500/30 hover:text-rose-400 hover:shadow-sm"
                                >
                                    <span>Salir</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href={pathname?.startsWith('/en') ? '/en/auth/login' : '/auth/login'}
                                    onClick={() => trackEvent('login_click', { location: 'navbar_desktop' })}
                                    className="hidden sm:block text-slate-500 hover:text-slate-900 px-4 py-2 text-sm font-black transition-colors"
                                >
                                    {pathname?.startsWith('/en') ? 'Log In' : 'Iniciar Sesión'}
                                </Link>
                                <Link
                                    href={pathname?.startsWith('/en') ? '/en/auth/register' : '/auth/register'}
                                    onClick={() => trackEvent('primary_cta_click', { location: 'navbar_desktop_cta' })}
                                    className="hidden sm:block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl text-sm font-black shadow-lg shadow-green-200 transition-all hover:-translate-y-0.5 active:scale-95"
                                >
                                    {pathname?.startsWith('/en') ? 'Start FREE' : 'Empezar GRATIS'}
                                </Link>
                            </div>
                        )}

                        {/* Mobile Toggle */}
                        <div className="flex items-center gap-2 lg:hidden">
                            <button
                                onClick={() => {
                                    const isEn = pathname?.startsWith('/en');
                                    const targetPath = isEn
                                        ? (pathname?.replace(/^\/en/, '') || '/')
                                        : `/en${pathname === '/' ? '' : pathname}`;
                                    window.location.href = targetPath;
                                }}
                                className={`p-2 rounded-xl border font-bold transition-all ${pathname?.startsWith('/en')
                                    ? 'bg-green-500/10 border-green-500 text-green-400'
                                    : 'bg-slate-900 border-slate-800 text-slate-400'
                                    }`}
                            >
                                {pathname?.startsWith('/en') ? 'EN' : 'ES'}
                            </button>

                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {
                isOpen && (
                    <div className="lg:hidden bg-slate-950 border-t border-white/5 py-6 px-4 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-4">
                        {session ? (
                            <>
                                <Link href="/dashboard" className="block p-4 rounded-2xl bg-slate-900 font-black text-white" onClick={() => setIsOpen(false)}>Dashboard</Link>
                                <Link href="/dashboard/stores" className="block p-4 rounded-2xl hover:bg-slate-900 font-bold text-slate-400" onClick={() => setIsOpen(false)}>Mis Tiendas</Link>
                                <Link href="/dashboard/billing" className="block p-4 rounded-2xl hover:bg-slate-900 font-bold text-slate-400" onClick={() => setIsOpen(false)}>Mi Plan</Link>
                                <button
                                    onClick={() => { setIsOpen(false); signOut({ callbackUrl: '/' }); }}
                                    className="w-full text-left p-4 rounded-2xl text-rose-500 font-black hover:bg-rose-950/30 transition-colors"
                                >
                                    Cerrar Sesión
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/auth/login"
                                    className="block p-4 rounded-2xl hover:bg-slate-900 font-black text-white"
                                    onClick={() => {
                                        setIsOpen(false);
                                        trackEvent('login_click', { location: 'navbar_mobile' });
                                    }}
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="block p-4 rounded-2xl bg-green-500 text-white font-black text-center shadow-xl shadow-green-900/40"
                                    onClick={() => {
                                        setIsOpen(false);
                                        trackEvent('primary_cta_click', { location: 'navbar_mobile_cta' });
                                    }}
                                >
                                    EMPEZAR GRATIS
                                </Link>
                            </>
                        )}
                    </div>
                )
            }
        </nav>
    );
}
