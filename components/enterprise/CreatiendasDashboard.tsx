'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Store, Plus, Settings, Eye, Trash2, Edit } from 'lucide-react';
import WalletBadge from './WalletBadge';

interface StoreData {
    id: string;
    name: string;
    slug: string;
    views: number;
    createdAt: string;
}

export default function CreatiendasDashboard() {
    const { data: session } = useSession();
    const [stores, setStores] = useState<StoreData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newStoreName, setNewStoreName] = useState('');
    const [creating, setCreating] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);

    // Fetch user's stores
    useEffect(() => {
        fetchStores();
        if (session?.user?.id) {
            fetchWallet();
        }
    }, [session]);

    const fetchWallet = async () => {
        try {
            const response = await fetch('/api/wallet', {
                headers: { 'x-user-id': session?.user?.id || '' }
            });
            if (response.ok) {
                const data = await response.json();
                setWalletBalance(data.account?.balance || 0);
            }
        } catch (error) {
            console.error('Error fetching wallet:', error);
        }
    };

    const fetchStores = async () => {
        try {
            const response = await fetch('/api/stores/my-stores');
            if (response.ok) {
                const data = await response.json();
                setStores(data.stores || []);
            }
        } catch (error) {
            console.error('Error fetching stores:', error);
        } finally {
            setLoading(false);
        }
    };

    const createStore = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStoreName.trim()) return;

        setCreating(true);
        try {
            const slug = newStoreName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            const response = await fetch('/api/stores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newStoreName,
                    slug,
                    data: {
                        theme: 'modern',
                        colors: {
                            primary: '#667eea',
                            secondary: '#764ba2'
                        }
                    },
                    products: []
                }),
            });

            if (response.ok) {
                setNewStoreName('');
                setShowCreateModal(false);
                fetchStores();
            } else {
                alert('Error al crear la tienda');
            }
        } catch (error) {
            console.error('Error creating store:', error);
            alert('Error al crear la tienda');
        } finally {
            setCreating(false);
        }
    };

    const deleteStore = async (storeId: string) => {
        if (!confirm('¿Estás seguro de eliminar esta tienda?')) return;

        try {
            const response = await fetch(`/api/stores/${storeId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchStores();
            }
        } catch (error) {
            console.error('Error deleting store:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Cargando tiendas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto bg-slate-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                            <Store className="w-8 h-8 text-purple-600" />
                            Mis Tiendas
                        </h1>
                        <p className="text-slate-600 mt-2">
                            {session?.user?.name ? `Hola, ${session.user.name}` : 'Gestiona tus tiendas online'}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl"
                    >
                        <Plus className="w-5 h-5" />
                        Nueva Tienda
                    </button>
                </div>

                {/* Stores Grid */}
                {stores.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                        <Store className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No tienes tiendas aún</h3>
                        <p className="text-slate-600 mb-6">
                            Crea tu primera tienda online en minutos
                        </p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            Crear Primera Tienda
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stores.map((store) => (
                            <div
                                key={store.id}
                                className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Store className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => window.open(`/stores/${store.slug}`, '_blank')}
                                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                            title="Ver tienda"
                                        >
                                            <Eye className="w-4 h-4 text-slate-600" />
                                        </button>
                                        <button
                                            onClick={() => deleteStore(store.id)}
                                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">{store.name}</h3>
                                <p className="text-sm text-slate-500 mb-4">/{store.slug}</p>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">
                                        {store.views} visitas
                                    </span>
                                    <span className="text-slate-400">
                                        {new Date(store.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Quick Stats */}
                {stores.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="bg-white rounded-2xl p-6 border border-slate-200">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                    <Store className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Total Tiendas</p>
                                    <p className="text-2xl font-bold text-slate-800">{stores.length}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-slate-200">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                    <Eye className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Total Visitas</p>
                                    <p className="text-2xl font-bold text-slate-800">
                                        {stores.reduce((sum, store) => sum + store.views, 0)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-slate-200">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                    <Settings className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Plan Actual</p>
                                    <p className="text-2xl font-bold text-slate-800">
                                        {(session?.user as any)?.plan || 'FREE'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Store Modal */}
            {showCreateModal && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => setShowCreateModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Crear Nueva Tienda</h2>
                        <form onSubmit={createStore}>
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Nombre de la Tienda
                                </label>
                                <input
                                    type="text"
                                    value={newStoreName}
                                    onChange={(e) => setNewStoreName(e.target.value)}
                                    placeholder="Mi Tienda"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                    required
                                />
                                {newStoreName && (
                                    <p className="text-sm text-slate-500 mt-2">
                                        URL: /{newStoreName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-6 py-3 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
                                >
                                    {creating ? 'Creando...' : 'Crear Tienda'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <WalletBadge
                balance={walletBalance}
                onClick={() => window.location.href = '/wallet'}
            />
        </div>
    );
}
