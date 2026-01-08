'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Store, Plus, Settings, Eye, Trash2, Edit, Package, QrCode } from 'lucide-react';
import ActivationChecklistEN from '../en/ActivationChecklistEN';


interface StoreData {
    id: string;
    name: string;
    slug: string;
    views: number;
    createdAt: string;
    productCount: number;
}


const AdvisorModalEN = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 text-center">
                    <div className="w-20 h-20 bg-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce">
                        <Store className="w-10 h-10 text-purple-600" />
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
                        Limit reached!
                    </h2>

                    <p className="text-slate-600 text-lg mb-10 leading-relaxed font-medium">
                        You have reached the limit of your current plan. To create more stores and scale your business, you need personalized advice.
                    </p>

                    <div className="flex flex-col gap-3">
                        <a
                            href="https://wa.me/573026687991?text=Hello,%20I%20reached%20my%20store%20limit%20and%20would%20like%20to%20upgrade."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-500 hover:bg-green-600 text-white py-4 px-8 rounded-2xl font-black text-lg shadow-xl shadow-green-200 transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
                        >
                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.483 8.413-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.308 1.654zm6.733-14.453c-.166-.37-.341-.377-.499-.384-.129-.006-.277-.006-.425-.006-.148 0-.388.055-.591.273-.204.218-.777.759-.777 1.85s.796 2.144.906 2.293c.111.148 1.568 2.395 3.8 3.357.518.222.921.356 1.236.456.52.165.993.142 1.367.086.417-.062 1.284-.524 1.465-1.031.181-.506.181-.941.127-1.031-.054-.09-.199-.145-.421-.255s-1.31-.647-1.513-.721-.351-.11-.5.11c-.15.22-.578.721-.708.87-.13.15-.258.168-.48.058s-.937-.344-1.786-1.1c-.66-.588-1.107-1.314-1.237-1.535-.13-.22-.014-.34.097-.449.099-.099.221-.255.333-.384.111-.128.148-.22.222-.369.074-.148.037-.278-.019-.387z" />
                            </svg>
                            Talk to an Advisor
                        </a>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 font-bold py-2 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default function CreatiendasDashboardEN() {
    const router = useRouter();
    const { data: session } = useSession();
    const [stores, setStores] = useState<StoreData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);

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
            setIsLimitModalOpen(true);
            return;
        }

        router.push('/en/builder');
    };

    const deleteStore = async (storeId: string) => {
        if (!confirm('Are you sure you want to delete this store?')) return;

        try {
            const response = await fetch(`/api/stores/${storeId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Optimistic update
                setStores(prev => prev.filter(s => s.id !== storeId));
            } else {
                const error = await response.json();
                alert(error.message || 'Error deleting store');
            }
        } catch (error) {
            console.error('Error deleting store:', error);
            alert('Connection error while deleting store');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading stores...</p>
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
                            My Stores
                        </h1>
                        <p className="text-slate-600 mt-2">
                            {session?.user?.name ? `Hello, ${session.user.name}` : 'Manage your online stores'}
                        </p>
                    </div>
                    <button
                        onClick={handleCreateStore}
                        className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl"
                    >
                        <Plus className="w-5 h-5" />
                        New Store
                    </button>
                </div>

                {/* Activation Checklist (Gamification) */}
                <ActivationChecklistEN stores={stores} />

                {/* Stores Grid */}
                {stores.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                        <Store className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No stores yet</h3>
                        <p className="text-slate-600 mb-6">
                            Create your first online store in minutes
                        </p>
                        <button
                            onClick={handleCreateStore}
                            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            Create First Store
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
                                            onClick={() => router.push(`/en/builder?edit=${store.slug}`)}
                                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit store"
                                        >
                                            <Edit className="w-4 h-4 text-blue-600" />
                                        </button>
                                        <button
                                            onClick={() => window.open(`/stores/${store.slug}`, '_blank')}
                                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                            title="View store"
                                        >
                                            <Eye className="w-4 h-4 text-slate-600" />
                                        </button>
                                        <button
                                            onClick={() => deleteStore(store.id)}
                                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">{store.name}</h3>
                                <p className="text-sm text-slate-500 mb-4">/{store.slug}</p>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">
                                        {store.views} views
                                    </span>
                                    <span className="text-slate-600 flex items-center gap-1">
                                        <Package className="w-4 h-4" />
                                        {store.productCount}
                                    </span>
                                    <span className="text-slate-400">
                                        {new Date(store.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <button
                                    onClick={() => {
                                        try {
                                            if (!store.slug) {
                                                console.error('Missing slug for store:', store.id);
                                                alert('Error: The store does not have a valid address.');
                                                return;
                                            }
                                            router.push(`/en/builder/success?slug=${encodeURIComponent(store.slug)}&storeName=${encodeURIComponent(store.name)}`);
                                        } catch (err) {
                                            console.error('Navigation error:', err);
                                        }
                                    }}
                                    className="w-full mt-6 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl border border-purple-100 transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                                >
                                    <QrCode className="w-4 h-4" />
                                    Manage QR and Share
                                </button>
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
                                    <p className="text-sm text-slate-600">Total Stores</p>
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
                                    <p className="text-sm text-slate-600">Total Views</p>
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
                                    <p className="text-sm text-slate-600">Current Plan</p>
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
                                    <p className="text-sm text-slate-600">Total Products</p>
                                    <p className="text-2xl font-bold text-slate-800">
                                        {stores.reduce((sum, store) => sum + (store.productCount || 0), 0)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <AdvisorModalEN
                isOpen={isLimitModalOpen}
                onClose={() => setIsLimitModalOpen(false)}
            />
        </div>
    );
}
