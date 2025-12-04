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
            {/* Unified Header */}
            <header
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '70px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 20px',
                }}
            >
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{
                        width: '45px',
                        height: '45px',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                    }}>
                        🚀
                    </div>
                    {!isMobile && (
                        <div style={{ color: '#fff' }}>
                            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>
                                Enterprise Hub
                            </h1>
                            <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>
                                {session?.user?.name || 'B2BChat + Creatiendas'}
                            </p>
                        </div>
                    )}
                </div>

                {/* App Switcher */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: '6px',
                }}>
                    <button
                        onClick={() => setCurrentView('both')}
                        style={{
                            padding: isMobile ? '8px 12px' : '10px 18px',
                            borderRadius: '8px',
                            border: 'none',
                            background: currentView === 'both' ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
                            color: currentView === 'both' ? '#667eea' : '#fff',
                            fontSize: isMobile ? '13px' : '14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}
                    >
                        <Menu size={16} />
                        {!isMobile && 'Ambos'}
                    </button>
                    <button
                        onClick={() => setCurrentView('b2bchat')}
                        style={{
                            padding: isMobile ? '8px 12px' : '10px 18px',
                            borderRadius: '8px',
                            border: 'none',
                            background: currentView === 'b2bchat' ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
                            color: currentView === 'b2bchat' ? '#667eea' : '#fff',
                            fontSize: isMobile ? '13px' : '14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}
                    >
                        <MessageSquare size={16} />
                        {!isMobile && 'Chat'}
                    </button>
                    <button
                        onClick={() => setCurrentView('creatiendas')}
                        style={{
                            padding: isMobile ? '8px 12px' : '10px 18px',
                            borderRadius: '8px',
                            border: 'none',
                            background: currentView === 'creatiendas' ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
                            color: currentView === 'creatiendas' ? '#667eea' : '#fff',
                            fontSize: isMobile ? '13px' : '14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}
                    >
                        <Store size={16} />
                        {!isMobile && 'Tienda'}
                    </button>
                </div>

                {/* Right Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Wallet Balance */}
                    <button
                        onClick={() => setIsWalletOpen(true)}
                        style={{
                            padding: isMobile ? '8px 12px' : '10px 16px',
                            borderRadius: '10px',
                            border: 'none',
                            background: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(10px)',
                            color: '#fff',
                            fontSize: isMobile ? '13px' : '14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        <Wallet size={18} />
                        {!isMobile && formatCurrency(walletBalance)}
                    </button>

                    {/* User Menu */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                border: '2px solid rgba(255, 255, 255, 0.3)',
                                background: 'rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(10px)',
                                color: '#fff',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <User size={20} />
                        </button>

                        {showUserMenu && (
                            <div style={{
                                position: 'absolute',
                                top: '50px',
                                right: 0,
                                background: 'white',
                                borderRadius: '12px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                padding: '8px',
                                minWidth: '150px',
                                color: '#333'
                            }}>
                                <div style={{ padding: '8px 12px', borderBottom: '1px solid #eee', marginBottom: '4px' }}>
                                    <div style={{ fontWeight: 600 }}>{session?.user?.name || 'Usuario'}</div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>{session?.user?.email}</div>
                                </div>
                                <button
                                    onClick={() => signOut()}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        textAlign: 'left',
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#e53e3e',
                                        cursor: 'pointer',
                                        borderRadius: '6px',
                                        fontSize: '14px'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#fff5f5'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

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
