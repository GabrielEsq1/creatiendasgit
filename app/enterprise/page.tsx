'use client';

import React, { useState } from 'react';
import styles from './enterprise.module.css';
import StoreSection from '../../components/enterprise/StoreSection';
import ChatSection from '../../components/enterprise/ChatSection';
import WalletModal from '../../components/enterprise/WalletModal';

export default function EnterprisePage() {
    const [isWalletOpen, setIsWalletOpen] = useState(false);

    return (
        <div className={styles.enterpriseContainer}>
            <StoreSection onOpenWallet={() => setIsWalletOpen(true)} />
            <ChatSection />
            <WalletModal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />
        </div>
    );
}
