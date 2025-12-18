'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Monedera from '../../components/Monedera';
import CreatiendasDashboard from '../../components/enterprise/CreatiendasDashboard';
import { MessageSquare, Store, Wallet, User, Menu } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function EnterprisePage() {
    const { data: session } = useSession();
    const [isWalletOpen, setIsWalletOpen] = useState(false);
    const [currentView, setCurrentView] = useState<'both' | 'b2bchat' | 'creatiendas'>('both');
    const [walletBalance, setWalletBalance] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Detect mobile/tablet screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768 && currentView === 'both') {
                setCurrentView('creatiendas');
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [currentView]);

    // Fetch wallet balance
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await fetch('/api/wallet');
                if (response.ok) {
                    const data = await response.json();
                    setWalletBalance(data.balance || 0);
                }
            } catch (error) {
                console.error('Error fetching wallet balance:', error);
            }
        };

        fetchBalance();
        const interval = setInterval(fetchBalance, 30000);
        return () => clearInterval(interval);
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const containerStyle: React.CSSProperties = {
        display: currentView === 'both' && !isMobile ? 'grid' : 'block',
        gridTemplateColumns: currentView === 'both' && !isMobile ? '1fr 1fr' : '1fr',
        height: '100vh',
        overflow: 'hidden',
        background: '#0a0a0f',
    };

    return (
        <>
            {/* Dashboard Title Section (Added to replace redundant fixed header) */}
            <div className="bg-white border-b border-gray-100 py-6 px-8 mb-6 mt-4 rounded-3xl mx-6 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-2xl shadow-lg">
                            🚀
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800">Enterprise Hub</h1>
                            <p className="text-slate-500 font-medium">Gestiona tu ecosistema de negocios</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Wallet Quick Access */}
                        <button
                            onClick={() => setIsWalletOpen(true)}
                            className="flex items-center gap-3 bg-slate-50 border border-slate-200 hover:bg-white hover:shadow-md transition-all px-6 py-3 rounded-2xl"
                        >
                            <Wallet className="w-5 h-5 text-slate-600" />
                            <div className="text-left">
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-none mb-1">Tu Saldo</p>
                                <p className="text-sm font-black text-slate-800 leading-none">{formatCurrency(walletBalance)}</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Local App Switcher (Non-fixed) */}
                <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl mt-8 w-fit">
                    <button
                        onClick={() => setCurrentView('both')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${currentView === 'both' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <Menu size={18} /> Ambos
                    </button>
                    <button
                        onClick={() => setCurrentView('b2bchat')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${currentView === 'b2bchat' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <MessageSquare size={18} /> B2BChat
                    </button>
                    <button
                        onClick={() => setCurrentView('creatiendas')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${currentView === 'creatiendas' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <Store size={18} /> CreaTiendas
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ ...containerStyle, paddingTop: '70px' }}>
                {/* B2BChat Panel */}
                {(currentView === 'b2bchat' || currentView === 'both') && (
                    <div
                        style={{
                            height: 'calc(100vh - 70px)',
                            overflow: 'auto',
                            borderRight: currentView === 'both' && !isMobile ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
                            background: '#f8fafc',
                            padding: '20px',
                        }}
                    >
                        <div className="max-w-4xl mx-auto">
                            <h1 className="text-3xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                                <MessageSquare className="w-8 h-8 text-blue-600" />
                                B2BChat
                            </h1>
                            <p className="text-lg text-slate-600 mb-8">
                                Bienvenido, {session?.user?.name}! 💬
                            </p>

                            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-blue-700">
                                            <strong>Ya iniciaste sesión:</strong> Estás accediendo con tu cuenta de Enterprise Hub.
                                            Las funcionalidades completas de mensajería estarán disponibles próximamente.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white rounded-lg p-6 shadow border border-slate-200">
                                    <h3 className="font-bold text-slate-800 mb-2">💬 Conversaciones</h3>
                                    <p className="text-sm text-slate-600">Gestiona todas tus conversaciones en un solo lugar</p>
                                </div>
                                <div className="bg-white rounded-lg p-6 shadow border border-slate-200">
                                    <h3 className="font-bold text-slate-800 mb-2">🤖 Automatización</h3>
                                    <p className="text-sm text-slate-600">Respuestas automáticas con IA</p>
                                </div>
                                <div className="bg-white rounded-lg p-6 shadow border border-slate-200">
                                    <h3 className="font-bold text-slate-800 mb-2">📊 Campañas</h3>
                                    <p className="text-sm text-slate-600">Envía mensajes masivos segmentados</p>
                                </div>
                                <div className="bg-white rounded-lg p-6 shadow border border-slate-200">
                                    <h3 className="font-bold text-slate-800 mb-2">📈 Analíticas</h3>
                                    <p className="text-sm text-slate-600">Métricas de rendimiento en tiempo real</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Creatiendas Panel */}
                {(currentView === 'creatiendas' || currentView === 'both') && (
                    <CreatiendasDashboard />
                )}
            </div>

            {/* Wallet Modal */}
            {isWalletOpen && (
                <div
                    onClick={() => setIsWalletOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10001,
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: '95%',
                            maxWidth: '700px',
                            maxHeight: '95vh',
                            background: '#ffffff',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
                            position: 'relative',
                        }}
                    >
                        <button
                            onClick={() => setIsWalletOpen(false)}
                            style={{
                                position: 'absolute',
                                top: '15px',
                                right: '15px',
                                width: '45px',
                                height: '45px',
                                borderRadius: '50%',
                                border: 'none',
                                background: 'rgba(0, 0, 0, 0.1)',
                                color: '#333',
                                fontSize: '28px',
                                cursor: 'pointer',
                                zIndex: 10002,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            ×
                        </button>

                        <div style={{ height: '95vh', overflow: 'auto' }}>
                            <Monedera />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
