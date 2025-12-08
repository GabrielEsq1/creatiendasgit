'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Store, Plus, Settings, Eye, Trash2, Edit, Package } from 'lucide-react';


interface StoreData {
    id: string;
    name: string;
    slug: string;
    views: number;
    createdAt: string;
    productCount: number;
}


export default function CreatiendasDashboard() {
    const router = useRouter();
    const { data: session } = useSession();
    const [stores, setStores] = useState<StoreData[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch user's stores
    useEffect(() => {
        fetchStores();
    }, [session]);

    const fetchStores = async () => {
        try {
            const response = await fetch('/api/stores/my-stores');
            if (response.ok) {
                const data = await response.json();
                const storesWithCount = data.stores.map((store: any) => ({
                    ...store,
                    productCount: Array.isArray(store.products) ? store.products.length : 0
                }));
                setStores(storesWithCount || []);
            }
        } catch (error) {
            console.error('Error fetching stores:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateStore = () => {
        const plan = (session?.user as any)?.plan || 'FREE';
        const limit = plan === 'PRO' ? 10 : 1; // Limit 1 for FREE, 10 for PRO

        if (stores.length >= limit) {
            alert(`Has alcanzado el límite de tiendas para tu plan ${plan}. Actualiza tu plan para crear más.`);
            return;
        }

        router.push('/builder');
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
                        onClick={handleCreateStore}
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
                            onClick={handleCreateStore}
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
                                            onClick={() => router.push(`/builder?edit=${store.slug}`)}
                                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Editar tienda"
                                        >
                                            <Edit className="w-4 h-4 text-blue-600" />
                                        </button>
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
                                    <span className="text-slate-600 flex items-center gap-1">
                                        <Package className="w-4 h-4" />
                                        {store.productCount}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
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
                        <div className="bg-white rounded-2xl p-6 border border-slate-200">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                                    <Package className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Total Productos</p>
                                    <p className="text-2xl font-bold text-slate-800">
                                        {stores.reduce((sum, store) => sum + (store.productCount || 0), 0)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
