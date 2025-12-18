"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path: string) =>
        pathname === path
            ? 'text-green-600 font-bold border-b-2 border-green-600 h-full flex items-center'
            : 'text-gray-700 hover:text-green-600 transition-colors h-full flex items-center font-medium';

    const isHome = pathname === '/';

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all bg-white/90 backdrop-blur-md border-b border-gray-100 ${scrolled ? 'py-1 shadow-sm' : 'py-2'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Area */}
                    <div className="flex items-center">
                        <Link href={session ? "/dashboard" : "/"} className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-200 group-hover:scale-105 transition-transform">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <span className="text-xl font-black text-gray-900 tracking-tight">CreaTiendas</span>
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
                                            <span className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 text-[10px] rounded font-black uppercase tracking-tighter shadow-sm">Admin</span>
                                            Panel
                                        </Link>
                                        <Link href="/admin/users" className={isActive('/admin/users')}>
                                            Usuarios
                                        </Link>
                                    </div>
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
                        {status === 'loading' ? (
                            <div className="h-4 w-20 bg-gray-100 animate-pulse rounded" />
                        ) : session ? (
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:flex flex-col items-end">
                                    <span className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">Sesión de</span>
                                    <span className="text-sm font-black text-gray-800 leading-none">{session.user?.name}</span>
                                </div>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold text-gray-600 transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-600 hover:shadow-sm"
                                >
                                    <span>Salir</span>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/auth/login"
                                    className="hidden sm:block text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-black transition-colors"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl text-sm font-black shadow-lg shadow-green-100 transition-all hover:-translate-y-0.5 active:scale-95"
                                >
                                    Empezar GRATIS
                                </Link>
                            </div>
                        )}

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
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

            {/* Mobile Menu */}
            {isOpen && (
                <div className="lg:hidden bg-white border-t border-gray-100 py-6 px-4 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-4">
                    {session ? (
                        <>
                            <Link href="/dashboard" className="block p-4 rounded-2xl bg-gray-50 font-black text-gray-800" onClick={() => setIsOpen(false)}>Dashboard</Link>
                            <Link href="/dashboard/stores" className="block p-4 rounded-2xl hover:bg-gray-50 font-bold text-gray-600" onClick={() => setIsOpen(false)}>Mis Tiendas</Link>
                            <Link href="/dashboard/billing" className="block p-4 rounded-2xl hover:bg-gray-50 font-bold text-gray-600" onClick={() => setIsOpen(false)}>Mi Plan</Link>
                            <button
                                onClick={() => { setIsOpen(false); signOut({ callbackUrl: '/' }); }}
                                className="w-full text-left p-4 rounded-2xl text-red-600 font-black hover:bg-red-50 transition-colors"
                            >
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/login" className="block p-4 rounded-2xl hover:bg-gray-50 font-black text-gray-800" onClick={() => setIsOpen(false)}>Iniciar Sesión</Link>
                            <Link href="/auth/register" className="block p-4 rounded-2xl bg-green-500 text-white font-black text-center shadow-xl shadow-green-100" onClick={() => setIsOpen(false)}>EMPEZAR GRATIS</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
