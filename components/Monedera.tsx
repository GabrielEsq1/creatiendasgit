'use client';

import React, { useState, useEffect } from 'react';
import { Wallet, Send, Download, Upload, Eye, EyeOff, Bell, LogOut, ArrowRight, CreditCard, Smartphone, Building2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

const MOCK_USER_TEMPLATE = {
    id: 1,
    name: 'Usuario Monedera',
    email: '',
    phone: '',
    balance: 0,
    role: 'USER'
};

const Monedera = () => {
    const [currentView, setCurrentView] = useState('login');
    const [user, setUser] = useState<any>(null);
    const [showBalance, setShowBalance] = useState(true);
    const [transactions, setTransactions] = useState<any[]>([]);

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [transferRecipient, setTransferRecipient] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [transferNote, setTransferNote] = useState('');

    const [depositMethod, setDepositMethod] = useState('PSE');
    const [depositAmount, setDepositAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const { data: session } = useSession();
    const userId = session?.user?.id;

    const fetchWalletData = async () => {
        if (!userId) return;

        try {
            setLoading(true);
            const res = await fetch('/api/wallet', {
                headers: { 'x-user-id': userId }
            });

            if (res.ok) {
                const data = await res.json();

                // Map API data to component state
                const balance = Number(data.account?.balance || 0);

                setUser({
                    ...MOCK_USER_TEMPLATE,
                    id: data.user?.id || userId,
                    email: data.user?.email || loginEmail,
                    balance: balance
                });

                // Map ledger to transactions
                const mappedTransactions = (data.ledger || []).map((tx: any) => ({
                    id: tx.id,
                    type: tx.type === 'credit' ? 'DEPOSIT' : 'WITHDRAWAL',
                    amount: tx.type === 'credit' ? Number(tx.amount) : -Number(tx.amount),
                    recipient: tx.metadata?.recipient || 'Unknown',
                    sender: tx.metadata?.sender || 'Unknown',
                    method: tx.metadata?.method || 'SYSTEM',
                    date: new Date(tx.createdAt).toISOString().split('T')[0],
                    status: tx.status.toUpperCase(),
                    note: tx.description
                }));

                setTransactions(mappedTransactions);
            }
        } catch (error) {
            console.error('Error fetching wallet data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user) {
            fetchWalletData();
            setCurrentView('dashboard');
        }
    }, [session]);

    const handleLogin = async () => {
        // Login handled by NextAuth globally
        if (session) {
            await fetchWalletData();
            setCurrentView('dashboard');
        }
    };

    const handleTransfer = async () => {
        const amount = parseFloat(transferAmount);
        if (user && amount > 0 && amount <= user.balance && transferRecipient) {
            try {
                setLoading(true);
                const res = await fetch('/api/wallet/transfer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId,
                        recipientEmail: transferRecipient,
                        amount,
                        note: transferNote
                    })
                });

                if (res.ok) {
                    await fetchWalletData();
                    setTransferRecipient('');
                    setTransferAmount('');
                    setTransferNote('');
                    alert('¡Transferencia exitosa!');
                    setCurrentView('dashboard');
                } else {
                    const error = await res.json();
                    alert(`Error: ${error.error}`);
                }
            } catch (error) {
                console.error('Transfer failed:', error);
                alert('Error al realizar la transferencia');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDeposit = async () => {
        const amount = parseFloat(depositAmount);
        if (amount > 0) {
            if (depositMethod === 'NEQUI' || depositMethod === 'PSE') {
                const message = `Hola, quiero recargar mi billetera Monedera con ${formatCurrency(amount)}. Mi ID de usuario es: ${userId}`;
                const whatsappUrl = `https://wa.me/573001234567?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
            } else {
                // Test deposit
                try {
                    setLoading(true);
                    const res = await fetch('/api/wallet/deposit', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId,
                            amount,
                            method: depositMethod
                        })
                    });

                    if (res.ok) {
                        await fetchWalletData();
                        alert('¡Depósito exitoso!');
                        setCurrentView('dashboard');
                    }
                } catch (error) {
                    console.error('Deposit failed:', error);
                } finally {
                    setLoading(false);
                }
            }
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    };


    if (currentView === 'login') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-2xl p-8">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl mb-4">
                                <Wallet className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Monedera</h1>
                            <p className="text-gray-600">Tu billetera digital inteligente</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    placeholder="tu@email.com"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    <button
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleLogin}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 disabled:opacity-50"
                            >
                                {loading ? 'Cargando...' : 'Iniciar Sesión'}
                            </button>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Demo: usar cualquier email/contraseña
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) return <div className="min-h-screen flex items-center justify-center">Cargando datos...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                                <Wallet className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">Monedera</span>
                        </div>

                        <nav className="hidden md:flex space-x-1">
                            <button
                                onClick={() => setCurrentView('dashboard')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentView === 'dashboard' ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                Inicio
                            </button>
                            <button
                                onClick={() => setCurrentView('transactions')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentView === 'transactions' ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                Transacciones
                            </button>
                        </nav>

                        <div className="flex items-center space-x-3">
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <Bell className="w-5 h-5 text-gray-600" />
                            </button>
                            <button
                                onClick={() => {
                                    setUser(null);
                                    setCurrentView('login');
                                    setLoginEmail('');
                                    setLoginPassword('');
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <LogOut className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {currentView === 'dashboard' && (
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-2xl p-8 text-white mb-8 shadow-xl">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-purple-200 text-sm mb-2">Balance disponible</p>
                                <div className="flex items-center space-x-3">
                                    {showBalance ? (
                                        <h2 className="text-4xl font-bold">{formatCurrency(user.balance)}</h2>
                                    ) : (
                                        <h2 className="text-4xl font-bold">••••••</h2>
                                    )}
                                    <button
                                        onClick={() => setShowBalance(!showBalance)}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            <Wallet className="w-12 h-12 text-white/30" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setCurrentView('transfer')}
                                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl p-4 transition-all transform hover:scale-105"
                            >
                                <Send className="w-6 h-6 mb-2" />
                                <p className="text-sm font-medium">Enviar</p>
                            </button>
                            <button
                                onClick={() => setCurrentView('deposit')}
                                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl p-4 transition-all transform hover:scale-105"
                            >
                                <Download className="w-6 h-6 mb-2" />
                                <p className="text-sm font-medium">Recargar</p>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Movimientos recientes</h3>
                            <button
                                onClick={() => setCurrentView('transactions')}
                                className="text-purple-600 text-sm font-medium hover:text-purple-700"
                            >
                                Ver todos
                            </button>
                        </div>

                        <div className="space-y-4">
                            {transactions.slice(0, 5).map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tx.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                                            }`}>
                                            {tx.type === 'DEPOSIT' && <Download className="w-6 h-6 text-green-600" />}
                                            {tx.type === 'WITHDRAWAL' && <Upload className="w-6 h-6 text-red-600" />}
                                            {tx.type === 'TRANSFER_OUT' && <Send className="w-6 h-6 text-red-600" />}
                                            {tx.type === 'TRANSFER_IN' && <Download className="w-6 h-6 text-green-600" />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {tx.type === 'DEPOSIT' && `Recarga ${tx.method}`}
                                                {tx.type === 'WITHDRAWAL' && `Retiro ${tx.method}`}
                                                {tx.type === 'TRANSFER_OUT' && `Enviado a ${tx.recipient}`}
                                                {tx.type === 'TRANSFER_IN' && `Recibido de ${tx.sender}`}
                                            </p>
                                            <p className="text-sm text-gray-500">{tx.date}</p>
                                        </div>
                                    </div>
                                    <p className={`text-lg font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            )}

            {currentView === 'transfer' && (
                <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <button
                        onClick={() => setCurrentView('dashboard')}
                        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
                    >
                        <ArrowRight className="w-5 h-5 rotate-180 mr-2" />
                        Volver
                    </button>

                    <div className="bg-white rounded-2xl shadow-sm p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Enviar dinero</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Destinatario (email o teléfono)
                                </label>
                                <input
                                    type="text"
                                    value={transferRecipient}
                                    onChange={(e) => setTransferRecipient(e.target.value)}
                                    placeholder="maria@example.com o +57 300 123 4567"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Monto</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        value={transferAmount}
                                        onChange={(e) => setTransferAmount(e.target.value)}
                                        placeholder="0"
                                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                                <p className="text-sm text-gray-500 mt-2">Disponible: {formatCurrency(user.balance)}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nota (opcional)</label>
                                <textarea
                                    value={transferNote}
                                    onChange={(e) => setTransferNote(e.target.value)}
                                    placeholder="Añade un mensaje..."
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <button
                                onClick={handleTransfer}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
                            >
                                Enviar {transferAmount && formatCurrency(parseFloat(transferAmount))}
                            </button>
                        </div>
                    </div>
                </main>
            )}

            {currentView === 'deposit' && (
                <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <button
                        onClick={() => setCurrentView('dashboard')}
                        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
                    >
                        <ArrowRight className="w-5 h-5 rotate-180 mr-2" />
                        Volver
                    </button>

                    <div className="bg-white rounded-2xl shadow-sm p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recargar saldo</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Método de recarga</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        onClick={() => setDepositMethod('PSE')}
                                        className={`p-4 border-2 rounded-lg transition-all ${depositMethod === 'PSE' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <Building2 className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                                        <p className="text-sm font-medium">PSE</p>
                                    </button>
                                    <button
                                        onClick={() => setDepositMethod('CARD')}
                                        className={`p-4 border-2 rounded-lg transition-all ${depositMethod === 'CARD' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <CreditCard className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                                        <p className="text-sm font-medium">Tarjeta</p>
                                    </button>
                                    <button
                                        onClick={() => setDepositMethod('NEQUI')}
                                        className={`p-4 border-2 rounded-lg transition-all ${depositMethod === 'NEQUI' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <Smartphone className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                                        <p className="text-sm font-medium">Nequi</p>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Monto a recargar</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        value={depositAmount}
                                        onChange={(e) => setDepositAmount(e.target.value)}
                                        placeholder="0"
                                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="flex gap-2 mt-3">
                                    {[50000, 100000, 200000, 500000].map((amount) => (
                                        <button
                                            key={amount}
                                            onClick={() => setDepositAmount(amount.toString())}
                                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-purple-600 hover:text-purple-600 transition-colors"
                                        >
                                            {formatCurrency(amount)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleDeposit}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
                            >
                                Recargar {depositAmount && formatCurrency(parseFloat(depositAmount))}
                            </button>
                        </div>
                    </div>
                </main>
            )}

            {currentView === 'transactions' && (
                <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <button
                        onClick={() => setCurrentView('dashboard')}
                        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
                    >
                        <ArrowRight className="w-5 h-5 rotate-180 mr-2" />
                        Volver
                    </button>

                    <div className="bg-white rounded-2xl shadow-sm p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Todas las transacciones</h2>

                        <div className="space-y-3">
                            {transactions.map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tx.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                                            }`}>
                                            {tx.type === 'DEPOSIT' && <Download className="w-6 h-6 text-green-600" />}
                                            {tx.type === 'WITHDRAWAL' && <Upload className="w-6 h-6 text-red-600" />}
                                            {tx.type === 'TRANSFER_OUT' && <Send className="w-6 h-6 text-red-600" />}
                                            {tx.type === 'TRANSFER_IN' && <Download className="w-6 h-6 text-green-600" />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {tx.type === 'DEPOSIT' && `Recarga ${tx.method}`}
                                                {tx.type === 'WITHDRAWAL' && `Retiro ${tx.method}`}
                                                {tx.type === 'TRANSFER_OUT' && `Enviado a ${tx.recipient}`}
                                                {tx.type === 'TRANSFER_IN' && `Recibido de ${tx.sender}`}
                                            </p>
                                            <p className="text-sm text-gray-500">{tx.date}</p>
                                            {tx.note && <p className="text-sm text-gray-400 italic mt-1">{tx.note}</p>}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-lg font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                                        </p>
                                        <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full mt-1">
                                            {tx.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            )}
        </div>
    );
};

export default Monedera;
