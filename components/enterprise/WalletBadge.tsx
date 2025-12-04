'use client';

import React, { useState } from 'react';
import { Wallet } from 'lucide-react';

interface WalletBadgeProps {
    balance: number;
    hasNotifications?: boolean;
    onClick: () => void;
}

export default function WalletBadge({
    balance,
    hasNotifications = false,
    onClick,
}: WalletBadgeProps) {
    const [isHovered, setIsHovered] = useState(false);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div style={{ position: 'relative' }}>
            {/* Floating Wallet Button */}
            <button
                onClick={onClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: '#000',
                    fontSize: '32px',
                    cursor: 'pointer',
                    boxShadow: isHovered
                        ? '0 12px 40px rgba(79, 172, 254, 0.7)'
                        : '0 8px 30px rgba(79, 172, 254, 0.5)',
                    zIndex: 10000,
                    transition: 'all 0.3s ease',
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: hasNotifications ? 'pulse 2s infinite' : 'none',
                }}
                aria-label={`Open wallet. Current balance: ${formatCurrency(balance)}`}
                aria-describedby={isHovered ? 'wallet-tooltip' : undefined}
            >
                <Wallet size={32} color="#000" />
            </button>

            {/* Notification Badge */}
            {hasNotifications && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '85px',
                        right: '30px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#ff4757',
                        border: '3px solid #fff',
                        zIndex: 10001,
                        animation: 'bounce 1s infinite',
                    }}
                    aria-label="New transaction notification"
                />
            )}

            {/* Tooltip on Hover */}
            {isHovered && (
                <div
                    id="wallet-tooltip"
                    role="tooltip"
                    style={{
                        position: 'fixed',
                        bottom: '110px',
                        right: '30px',
                        padding: '12px 20px',
                        background: 'rgba(0, 0, 0, 0.9)',
                        backdropFilter: 'blur(10px)',
                        color: '#fff',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
                        zIndex: 10001,
                        animation: 'fadeIn 0.3s ease',
                    }}
                >
                    <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>
                        Saldo disponible
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 700 }}>
                        {formatCurrency(balance)}
                    </div>
                </div>
            )}

            {/* Inline Styles for Animations */}
            <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            box-shadow: 0 8px 30px rgba(79, 172, 254, 0.5);
          }
          50% {
            box-shadow: 0 12px 40px rgba(79, 172, 254, 0.8);
          }
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
}
