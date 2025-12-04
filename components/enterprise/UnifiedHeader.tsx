'use client';

import React from 'react';
import { MessageSquare, Store, Wallet, User, Menu, X } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

interface UnifiedHeaderProps {
    currentApp: 'home' | 'b2bchat' | 'creatiendas' | 'both';
    onAppSwitch: (app: 'home' | 'b2bchat' | 'creatiendas' | 'both') => void;
    walletBalance: number;
    onWalletClick: () => void;
    isMobile?: boolean;
}

export default function UnifiedHeader({
    currentApp,
    onAppSwitch,
    walletBalance: propWalletBalance,
    onWalletClick,
    isMobile = false,
}: UnifiedHeaderProps) {
    const { data: session, status } = useSession();
    const [showUserMenu, setShowUserMenu] = React.useState(false);

    // Use balance from session if available, otherwise use prop
    const walletBalance = (session?.user as any)?.walletBalance ?? propWalletBalance;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <header
            className="unified-header"
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
            {/* Logo/Branding */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div
                    style={{
                        width: '45px',
                        height: '45px',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                    }}
                >
                    🚀
                </div>
                {!isMobile && (
                    <div style={{ color: '#fff' }}>
                        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>
                            Enterprise Hub
                        </h1>
                        <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>
                            B2BChat + Creatiendas
                        </p>
                    </div>
                )}
            </div>

            {/* App Switcher */}
            <div
                style={{
                    display: 'flex',
                    gap: '8px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: '6px',
                }}
            >
                <button
                    onClick={() => onAppSwitch('home')}
                    style={{
                        padding: isMobile ? '8px 12px' : '10px 18px',
                        borderRadius: '8px',
                        border: 'none',
                        background:
                            currentApp === 'home'
                                ? 'rgba(255, 255, 255, 0.95)'
                                : 'transparent',
                        color: currentApp === 'home' ? '#667eea' : '#fff',
                        fontSize: isMobile ? '13px' : '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                    }}
                    aria-label="Go to Home"
                    aria-pressed={currentApp === 'home'}
                >
                    <span style={{ fontSize: '16px' }}>🏠</span>
                    {!isMobile && 'Inicio'}
                </button>
                <button
                    onClick={() => onAppSwitch('both')}
                    style={{
                        padding: isMobile ? '8px 12px' : '10px 18px',
                        borderRadius: '8px',
                        border: 'none',
                        background:
                            currentApp === 'both'
                                ? 'rgba(255, 255, 255, 0.95)'
                                : 'transparent',
                        color: currentApp === 'both' ? '#667eea' : '#fff',
                        fontSize: isMobile ? '13px' : '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                    }}
                    aria-label="View both apps"
                    aria-pressed={currentApp === 'both'}
                >
                    <Menu size={16} />
                    {!isMobile && 'Ambos'}
                </button>
                <button
                    onClick={() => onAppSwitch('b2bchat')}
                    style={{
                        padding: isMobile ? '8px 12px' : '10px 18px',
                        borderRadius: '8px',
                        border: 'none',
                        background:
                            currentApp === 'b2bchat'
                                ? 'rgba(255, 255, 255, 0.95)'
                                : 'transparent',
                        color: currentApp === 'b2bchat' ? '#667eea' : '#fff',
                        fontSize: isMobile ? '13px' : '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                    }}
                    aria-label="Switch to B2BChat"
                    aria-pressed={currentApp === 'b2bchat'}
                >
                    <MessageSquare size={16} />
                    {!isMobile && 'Chat'}
                </button>
                <button
                    onClick={() => onAppSwitch('creatiendas')}
                    style={{
                        padding: isMobile ? '8px 12px' : '10px 18px',
                        borderRadius: '8px',
                        border: 'none',
                        background:
                            currentApp === 'creatiendas'
                                ? 'rgba(255, 255, 255, 0.95)'
                                : 'transparent',
                        color: currentApp === 'creatiendas' ? '#667eea' : '#fff',
                        fontSize: isMobile ? '13px' : '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                    }}
                    aria-label="Switch to Creatiendas"
                    aria-pressed={currentApp === 'creatiendas'}
                >
                    <Store size={16} />
                    {!isMobile && 'Tienda'}
                </button>
            </div>

            {/* Right Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Wallet Balance */}
                <button
                    onClick={onWalletClick}
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
                    onMouseOver={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                    aria-label={`Open wallet. Balance: ${formatCurrency(walletBalance)}`}
                >
                    <Wallet size={18} />
                    {!isMobile && <span>{formatCurrency(walletBalance)}</span>}
                </button>

                {/* User Menu or Login */}
                {status === 'authenticated' ? (
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
                            aria-label="User menu"
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
                                    <div style={{ fontWeight: 600 }}>{session.user?.name || 'Usuario'}</div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>{session.user?.email}</div>
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
                ) : (
                    <Link href="/auth/login">
                        <button
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: 'none',
                                background: '#fff',
                                color: '#667eea',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            Iniciar Sesión
                        </button>
                    </Link>
                )}
            </div>
        </header>
    );
}
