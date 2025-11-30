'use client';

import React, { useEffect, useState } from 'react';

export default function WalletPage() {
    const [data, setData] = useState<any>(null);
    const [amount, setAmount] = useState(5000);
    const [loading, setLoading] = useState(true);

    // Mock User ID for dev
    const userId = '1';

    async function fetchWallet() {
        try {
            const res = await fetch('/api/wallet', { headers: { 'x-user-id': userId } });
            if (res.ok) {
                setData(await res.json());
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchWallet(); }, []);

    async function handleNequi() {
        const message = `Hola, quiero recargar mi billetera Monedera con $${(amount / 100).toFixed(2)} USD (aprox ${amount} COP). Mi ID de usuario es: ${userId}`;
        const whatsappUrl = `https://wa.me/573026687991?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    async function handleTestTopup() {
        try {
            setLoading(true);
            const res = await fetch('/api/wallet/test-topup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
                body: JSON.stringify({ amount_cents: amount })
            });
            if (res.ok) {
                alert('Recarga de prueba exitosa!');
                fetchWallet(); // Refresh balance
            } else {
                alert('Error en recarga de prueba');
            }
        } catch (e) {
            console.error(e);
            alert('Error connecting to server');
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className="p-8">Loading...</div>;
    if (!data) return <div className="p-8">Error loading wallet. Ensure database is setup.</div>;

    return (
        <div style={{ maxWidth: 720, margin: '40px auto', fontFamily: 'system-ui' }} className="p-4">
            <h1 className="text-2xl font-bold mb-4">Monedera - Billetera Virtual</h1>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <p className="text-gray-600">Usuario: <span className="font-semibold">{data.user?.email || 'Unknown'}</span></p>
                <p className="text-3xl font-bold mt-2">Balance: ${(Number(data.account?.balance || 0) / 100).toFixed(2)} USD</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-lg font-semibold mb-4">Recargar Saldo</h3>
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Monto (centavos USD)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={e => setAmount(Number(e.target.value))}
                            className="w-full p-2 border rounded"
                        />
                        <p className="text-xs text-gray-500 mt-1">Ej: 5000 = $50.00 USD</p>
                    </div>

                    <div className="flex gap-3 mt-2">
                        <button
                            onClick={handleNequi}
                            className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <span>📱</span> Recargar con Nequi
                        </button>

                        <button
                            onClick={handleTestTopup}
                            className="flex-1 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                        >
                            <span>🧪</span> Simular Pago (Test)
                        </button>
                    </div>

                    <div className="mt-4 border-t pt-4">
                        <h4 className="text-sm font-semibold mb-2">Debug Tools</h4>
                        <button
                            onClick={async () => {
                                try {
                                    const res = await fetch('/api/nequi/auth', { method: 'POST' });
                                    const data = await res.json();
                                    alert(JSON.stringify(data, null, 2));
                                } catch (e) {
                                    alert('Error fetching token');
                                }
                            }}
                            className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 text-sm"
                        >
                            Test Nequi Token Generation
                        </button>
                    </div>
                </div>
            </div>

            <h3 className="text-xl font-bold mb-4">Transacciones recientes</h3>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {data.ledger?.length === 0 && <li className="p-4 text-gray-500">No hay transacciones.</li>}
                    {data.ledger?.map((tx: any) => (
                        <li key={tx.id} className="p-4 hover:bg-gray-50">
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-medium">{tx.type.toUpperCase()}</p>
                                    <p className="text-sm text-gray-500">{new Date(tx.created_at).toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                        {tx.type === 'credit' ? '+' : '-'}${Math.abs(tx.amount / 100).toFixed(2)}
                                    </p>
                                    <p className="text-xs text-gray-400">Bal: ${(tx.balance_after / 100).toFixed(2)}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
