'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Store, Plus, Settings, Eye, Trash2, Edit, Package, QrCode, MessageCircle, ArrowRight } from 'lucide-react';
import { getStoreUrl } from '@/lib/utils';
import ActivationChecklistEN from '../en/ActivationChecklistEN';
import PricingCards from '../PricingCards';
import Link from 'next/link';

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
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce">
                        <Store className="w-10 h-10 text-green-600" />
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
                        Limit reached!
                    </h2>

                    <p className="text-slate-600 text-lg mb-10 leading-relaxed font-medium">
                        You have reached the limit of your current plan. To create more stores and scale your business, choose a higher plan or request advice.
                    </p>

                    <div className="flex flex-col gap-3">
                        <a
                            href="https://wa.me/573026687991?text=Hello,%20I%20reached%20my%20store%20limit%20and%20would%20like%20to%20upgrade."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-500 hover:bg-green-600 text-white py-4 px-8 rounded-2xl font-black text-lg shadow-xl shadow-green-200 transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
                        >
                            <MessageCircle className="w-6 h-6" />
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

    const userPlan = (session?.user as any)?.plan || 'FREE';

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
        const limit = userPlan === 'PRO' ? 10 : 1; 

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
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading your stores...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto bg-slate-50 p-6 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                            <Store className="w-8 h-8 text-green-600" />
                            My Stores
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">
                            {session?.user?.name ? `Hello, ${session.user.name}` : 'Manage your online stores'}
                        </p>
                    </div>
                    <button
                        onClick={handleCreateStore}
                        className="flex items-center gap-2 bg-green-500 text-white px-6 py-3.5 rounded-2xl font-black shadow-lg shadow-green-200 hover:shadow-xl hover:bg-green-600 transition-all active:scale-[0.98]"
                    >
                        <Plus className="w-5 h-5" />
                        New Store
                    </button>
                </div>

                {/* Activation Checklist (Gamification) */}
                <div className="mb-12">
                    <ActivationChecklistEN stores={stores} />
                </div>

                {/* Stores Grid */}
                {stores.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-16 text-center border border-slate-100 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-3xl -mr-16 -mt-16" />
                        <Store className="w-20 h-20 text-slate-200 mx-auto mb-6" />
                        <h3 className="text-2xl font-black text-slate-900 mb-2">No stores yet</h3>
                        <p className="text-slate-500 mb-8 font-medium max-w-sm mx-auto">
                            Create your first online store in minutes and start selling on WhatsApp.
                        </p>
                        <button
                            onClick={handleCreateStore}
                            className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-green-200 hover:bg-green-600 transition-all hover:-translate-y-1"
                        >
                            <Plus className="w-6 h-6" />
                            Create First Store
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {stores.map((store) => (
                            <div
                                key={store.id}
                                className="bg-white rounded-[2rem] p-8 border border-slate-100 hover:shadow-2xl transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-full blur-2xl -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center group-hover:scale-110 group-hover:bg-green-100 transition-all">
                                        <Store className="w-7 h-7 text-green-600" />
                                    </div>
                                    <div className="flex gap-1">
                                        <a
                                            href={`https://wa.me/?text=${encodeURIComponent(`Hi! Check out my new online store: ${getStoreUrl(store.slug)}`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2.5 hover:bg-green-50 text-slate-400 hover:text-green-600 rounded-xl transition-all"
                                            title="Share on WhatsApp"
                                        >
                                            <MessageCircle className="w-5 h-5" />
                                        </a>
                                        <Link
                                            href={`/en/builder?edit=${store.slug}`}
                                            className="p-2.5 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-xl transition-all"
                                            title="Edit store"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </Link>
                                        <button
                                            onClick={() => deleteStore(store.id)}
                                            className="p-2.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-green-600 transition-colors">{store.name}</h3>
                                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">/{store.slug}</p>
                                </div>

                                <div className="grid grid-cols-3 gap-2 mb-8">
                                    <div className="bg-slate-50 p-3 rounded-2xl text-center">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">Views</p>
                                        <p className="text-base font-black text-slate-900">{store.views}</p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-2xl text-center">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">Prod.</p>
                                        <p className="text-base font-black text-slate-900">{store.productCount}</p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-2xl text-center">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">QR</p>
                                        <QrCode className="w-4 h-4 mx-auto text-slate-900" />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <a
                                        href={getStoreUrl(store.slug)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 py-3.5 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all text-center flex items-center justify-center gap-2"
                                    >
                                        <Eye className="w-4 h-4" /> View Web
                                    </a>
                                    <Link
                                        href={`/builder/share?slug=${encodeURIComponent(store.slug)}&storeName=${encodeURIComponent(store.name)}`}
                                        className="flex-1 py-3.5 bg-green-50 text-green-700 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-green-100 transition-all text-center flex items-center justify-center gap-2"
                                    >
                                        Share <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Quick Stats */}
                {stores.length > 0 && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Total Stores</p>
                            <p className="text-3xl font-black text-slate-900">{stores.length}<span className="text-slate-300 text-base font-medium ml-1">/ {userPlan === 'PRO' ? '10' : '1'}</span></p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Total Traffic</p>
                            <p className="text-3xl font-black text-slate-900">{stores.reduce((sum, store) => sum + store.views, 0)}</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Active Plan</p>
                            <div className="flex items-center gap-2">
                                <p className="text-2xl font-black text-green-600">{userPlan}</p>
                                {userPlan === 'FREE' && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Products</p>
                            <p className="text-3xl font-black text-slate-900">{stores.reduce((sum, store) => sum + (store.productCount || 0), 0)}</p>
                        </div>
                    </div>
                )}

                {/* Pricing Section for upgrades */}
                <div className="mt-24 mb-20">
                    <div className="text-center mb-16">
                        <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-4">
                            Next Level
                        </span>
                        <h2 className="text-3xl font-black text-slate-900 mb-4">Scale your WhatsApp business</h2>
                        <p className="text-slate-500 font-medium max-w-2xl mx-auto">Select a plan to unlock more stores, products and advanced features.</p>
                    </div>
                    <PricingCards lang="en" />
                </div>
            </div>
            <AdvisorModalEN
                isOpen={isLimitModalOpen}
                onClose={() => setIsLimitModalOpen(false)}
            />
        </div>
    );
}
