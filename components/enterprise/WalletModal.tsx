'use client';

import React from 'react';
import styles from '../../app/enterprise/enterprise.module.css';

interface WalletModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WalletModal({ isOpen, onClose }: WalletModalProps) {
    if (!isOpen) return null;

    const showAction = (action: string) => {
        alert(`✨ ${action}\n\nEsta función estará disponible próximamente.\nGracias por usar Creatiendas!`);
    };

    return (
        <div className={styles.walletOverlay} onClick={onClose}>
            <div className={styles.walletModal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.walletHeader}>
                    <h2>💰 Mi Monedero</h2>
                    <button className={styles.btnCloseWallet} onClick={onClose}>✕</button>
                </div>
                <div className={styles.walletContent}>
                    <div className={styles.balanceCard}>
                        <div className={styles.balanceLabel}>Saldo Disponible</div>
                        <div className={styles.balanceAmount}>$420.500 COP</div>
                        <div className={styles.balanceButtons}>
                            <button className={styles.btnBalance} onClick={() => showAction('Recargar')}>💳 Recargar</button>
                            <button className={styles.btnBalance} onClick={() => showAction('Retirar')}>📤 Retirar</button>
                        </div>
                    </div>

                    <div className={styles.quickActions}>
                        <div className={styles.sectionTitle}>Acciones Rápidas</div>
                        <div className={styles.actionsGrid}>
                            <div className={styles.actionItem} onClick={() => showAction('Enviar Dinero')}>
                                <div className={styles.actionIcon}>💸</div>
                                <div className={styles.actionLabel}>Enviar</div>
                            </div>
                            <div className={styles.actionItem} onClick={() => showAction('Solicitar')}>
                                <div className={styles.actionIcon}>📨</div>
                                <div className={styles.actionLabel}>Solicitar</div>
                            </div>
                            <div className={styles.actionItem} onClick={() => showAction('Pagar')}>
                                <div className={styles.actionIcon}>💳</div>
                                <div className={styles.actionLabel}>Pagar</div>
                            </div>
                            <div className={styles.actionItem} onClick={() => showAction('Historial')}>
                                <div className={styles.actionIcon}>📊</div>
                                <div className={styles.actionLabel}>Historial</div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.transactions}>
                        <div className={styles.sectionTitle}>Transacciones Recientes</div>
                        <div className={styles.transactionsList}>
                            <div className={styles.transaction}>
                                <div className={styles.transactionLeft}>
                                    <div className={`${styles.transactionIcon} ${styles.transactionIconReceived}`}>↓</div>
                                    <div className={styles.transactionDetails}>
                                        <h4>Recibido de Carlos M.</h4>
                                        <div className={styles.transactionDate}>Hoy, 2:15 PM</div>
                                    </div>
                                </div>
                                <div className={`${styles.transactionAmount} ${styles.transactionAmountPositive}`}>+$85.000</div>
                            </div>
                            <div className={styles.transaction}>
                                <div className={styles.transactionLeft}>
                                    <div className={styles.transactionIcon}>↑</div>
                                    <div className={styles.transactionDetails}>
                                        <h4>Compra - Camisa Premium</h4>
                                        <div className={styles.transactionDate}>Hoy, 10:30 AM</div>
                                    </div>
                                </div>
                                <div className={`${styles.transactionAmount} ${styles.transactionAmountNegative}`}>-$120.000</div>
                            </div>
                            <div className={styles.transaction}>
                                <div className={styles.transactionLeft}>
                                    <div className={`${styles.transactionIcon} ${styles.transactionIconReceived}`}>↓</div>
                                    <div className={styles.transactionDetails}>
                                        <h4>Recarga Nequi</h4>
                                        <div className={styles.transactionDate}>Ayer, 6:00 PM</div>
                                    </div>
                                </div>
                                <div className={`${styles.transactionAmount} ${styles.transactionAmountPositive}`}>+$200.000</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
