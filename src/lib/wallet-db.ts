import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'wallet-db.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DB_PATH))) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

// Initial Seed Data
const INITIAL_DATA = {
    accounts: [
        { userId: '1', balance: 100000, currency: 'COP' }, // Test User
        { userId: '2', balance: 50000, currency: 'COP' }
    ],
    ledger: [
        {
            id: 'tx_1',
            userId: '1',
            type: 'credit',
            amount: 100000,
            description: 'Bono de bienvenida',
            createdAt: new Date().toISOString(),
            status: 'completed',
            metadata: { method: 'SYSTEM' }
        }
    ]
};

export const getWalletDB = () => {
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_DATA, null, 2));
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
};

export const saveWalletDB = (data: any) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

export const getAccount = (userId: string) => {
    const db = getWalletDB();
    let account = db.accounts.find((a: any) => a.userId === userId);

    if (!account) {
        // Create account if not exists
        account = { userId, balance: 0, currency: 'COP' };
        db.accounts.push(account);
        saveWalletDB(db);
    }

    return account;
};

export const getTransactions = (userId: string) => {
    const db = getWalletDB();
    return db.ledger
        .filter((tx: any) => tx.userId === userId)
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const createTransaction = (userId: string, type: 'credit' | 'debit', amount: number, description: string, metadata: any = {}) => {
    const db = getWalletDB();
    const accountIndex = db.accounts.findIndex((a: any) => a.userId === userId);

    if (accountIndex === -1) {
        // Create account if missing
        db.accounts.push({ userId, balance: 0, currency: 'COP' });
    }

    const account = db.accounts.find((a: any) => a.userId === userId);

    if (type === 'debit' && account.balance < amount) {
        throw new Error('Insufficient funds');
    }

    // Update balance
    if (type === 'credit') {
        account.balance += amount;
    } else {
        account.balance -= amount;
    }

    // Add ledger entry
    const transaction = {
        id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        type,
        amount,
        description,
        createdAt: new Date().toISOString(),
        status: 'completed',
        metadata
    };

    db.ledger.push(transaction);
    saveWalletDB(db);

    return transaction;
};
