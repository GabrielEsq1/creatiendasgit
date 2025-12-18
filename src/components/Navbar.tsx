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
            : 'text-gray-600 hover:text-green-600 transition-colors h-full flex items-center';

    const isHome = pathname === '/';

    return (
        <nav className={`sticky top-0 left-0 right-0 z-[100] transition-all bg-white border-b border-gray-100 ${scrolled ? 'py-2 shadow-md' : 'py-4'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Area */}
                    <div className="flex items-center">
                        <Link href={session ? "/dashboard" : "/"} className="flex items-center">
                            <img src="/logo.png" alt="Creatiendas" className="h-10 transition-transform hover:scale-105" />
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
                                            <span className="px-2 py-0.5 bg-red-100 text-red-600 border border-red-200 text-[10px] rounded font-black uppercase tracking-tighter">Admin</span>
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
                                <Link href="/#demo" className="text-gray-600 hover:text-green-600 font-medium h-full flex items-center">Demo</Link>
                                <Link href="/#features" className="text-gray-600 hover:text-green-600 font-medium h-full flex items-center">Características</Link>
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
                                    <span className="text-xs text-gray-400 leading-none mb-1">Sesión de</span>
                                    <span className="text-sm font-bold text-gray-800 leading-none">{session.user?.name}</span>
                                </div>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-600"
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
                                    className="hidden sm:block text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-bold transition-colors"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-extrabold shadow-lg shadow-green-100 transition-all active:scale-95"
                                >
                                    Empezar Gratis
                                </Link>
                            </div>
                        )}

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="lg:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-3 shadow-xl animate-in fade-in slide-in-from-top-4">
                    {session ? (
                        <>
                            <Link href="/dashboard" className="block p-3 rounded-xl bg-gray-50 font-bold text-gray-700" onClick={() => setIsOpen(false)}>Dashboard</Link>
                            <Link href="/dashboard/stores" className="block p-3 rounded-xl hover:bg-gray-50 font-semibold text-gray-600" onClick={() => setIsOpen(false)}>Mis Tiendas</Link>
                            <Link href="/dashboard/billing" className="block p-3 rounded-xl hover:bg-gray-50 font-semibold text-gray-600" onClick={() => setIsOpen(false)}>Mi Plan</Link>
                            <button
                                onClick={() => { setIsOpen(false); signOut({ callbackUrl: '/' }); }}
                                className="w-full text-left p-3 rounded-xl text-red-600 font-bold hover:bg-red-50"
                            >
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/login" className="block p-4 rounded-xl hover:bg-gray-50 font-bold text-gray-700" onClick={() => setIsOpen(false)}>Log In</Link>
                            <Link href="/auth/register" className="block p-4 rounded-xl bg-green-500 text-white font-black text-center shadow-lg" onClick={() => setIsOpen(false)}>EMPEZAR GRATIS</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
