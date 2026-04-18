'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Store, Plus, Settings, Eye, Trash2, Edit, Package, MessageCircle, QrCode } from 'lucide-react';
import { getStoreUrl } from '@/lib/utils';
import ActivationChecklist from '../dashboard/ActivationChecklist';

/** Returns days remaining in the 30-day free trial. Negative = expired. */
function getTrialDaysRemaining(createdAt: string): number {
    const created = new Date(createdAt).getTime();
    const elapsed = (Date.now() - created) / (1000 * 60 * 60 * 24);
    return Math.ceil(30 - elapsed);
}

/** Full-width banner shown above the stores grid for unpaid free-trial stores */
function TrialBanner({ stores }: { stores: StoreData[] }) {
    // Only show for free-plan stores that haven't paid yet
    const freeStores = stores.filter(s => !s.isPaid && s.createdAt);
    if (freeStores.length === 0) return null;

    // Use the store with the fewest days left (worst case) as the reference
    const daysLeft = Math.min(...freeStores.map(s => getTrialDaysRemaining(s.createdAt)));
    const daysUsed = Math.max(0, 30 - Math.max(0, daysLeft));
    const progress = Math.min(100, (daysUsed / 30) * 100);

    const expired = daysLeft <= 0;
    const isUrgent = daysLeft <= 7;
    const isWarning = daysLeft <= 15;

    const barColor = expired || isUrgent
        ? 'from-red-500 to-red-400'
        : isWarning
        ? 'from-amber-500 to-yellow-400'
        : 'from-blue-500 to-purple-500';

    const borderColor = expired || isUrgent
        ? 'border-red-200'
        : isWarning
        ? 'border-amber-200'
        : 'border-blue-200';

    const bgColor = expired || isUrgent
        ? 'bg-red-50'
        : isWarning
        ? 'bg-amber-50'
        : 'bg-blue-50';

    const labelColor = expired || isUrgent
        ? 'text-red-700'
        : isWarning
        ? 'text-amber-700'
        : 'text-blue-700';

    const title = expired
        ? '🔒 Tu período de prueba ha terminado'
        : isUrgent
        ? `⚠️ ¡Solo quedan ${daysLeft} día${daysLeft === 1 ? '' : 's'} de prueba!`
        : `🕐 Versión de prueba gratuita`;

    const subtitle = expired
        ? 'Tu tienda está desactivada públicamente. Activa tu plan para volver a estar visible.'
        : `Tu tienda estará activa y visible por ${Math.max(0, daysLeft)} días más. Activa tu plan para no perder clientes.`;

    return (
        <div className={`w-full rounded-2xl border ${borderColor} ${bgColor} p-5 mb-6`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <p className={`font-black text-base ${labelColor}`}>{title}</p>
                    <p className="text-sm text-slate-500 mt-0.5 leading-snug">{subtitle}</p>

                    {/* Progress bar */}
                    <div className="mt-3">
                        <div className="flex justify-between text-xs font-bold mb-1">
                            <span className={labelColor}>{daysUsed} / 30 días usados</span>
                            <span className="text-slate-400">{Math.max(0, daysLeft)} días restantes</span>
                        </div>
                        <div className="w-full h-2.5 bg-white/70 rounded-full overflow-hidden border border-white">
                            <div
                                className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-700`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                <a
                    href="https://wa.me/573026687991?text=Hola%2C%20quiero%20activar%20mi%20plan%20y%20mantener%20mi%20tienda%20activa."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-black px-5 py-3 rounded-xl shadow-md shadow-green-200 transition-all hover:-translate-y-0.5 no-underline text-sm"
                >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.483 8.413-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.308 1.654zm6.733-14.453c-.166-.37-.341-.377-.499-.384-.129-.006-.277-.006-.425-.006-.148 0-.388.055-.591.273-.204.218-.777.759-.777 1.85s.796 2.144.906 2.293c.111.148 1.568 2.395 3.8 3.357.518.222.921.356 1.236.456.52.165.993.142 1.367.086.417-.062 1.284-.524 1.465-1.031.181-.506.181-.941.127-1.031-.054-.09-.199-.145-.421-.255s-1.31-.647-1.513-.721-.351-.11-.5.11c-.15.22-.578.721-.708.87-.13.15-.258.168-.48.058s-.937-.344-1.786-1.1c-.66-.588-1.107-1.314-1.237-1.535-.13-.22-.014-.34.097-.449.099-.099.221-.255.333-.384.111-.128.148-.22.222-.369.074-.148.037-.278-.019-.387z" /></svg>
                    {expired ? 'Activar ahora' : 'Activar plan'}
                </a>
            </div>
        </div>
    );
}


interface StoreData {
    id: string;
    name: string;
    slug: string;
    views: number;
    createdAt: string;
    productCount: number;
    isPaid?: boolean;
}

const BlockedStoreModal = ({ isOpen }: { isOpen: boolean }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-lg w-full shadow-2xl relative overflow-hidden text-center">
                <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse">
                    <Store className="w-10 h-10 text-red-600" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
                    Tiempo de Prueba Terminado
                </h2>
                <p className="text-slate-600 text-lg mb-10 leading-relaxed font-medium">
                    El período de prueba de 30 días ha concluido. Para continuar usando tu tienda y tener acceso al panel de control, por favor realiza el pago de la suscripción.
                </p>
                <div className="flex flex-col gap-3">
                    <a
                        href="https://wa.me/573026687991?text=Hola,%20mi%20período%20de%20prueba%20terminó%20y%20me%20gustaría%20realizar%20el%20pago%20de%20mi%20tienda."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 hover:bg-green-600 text-white py-4 px-8 rounded-2xl font-black text-lg shadow-xl shadow-green-200 transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
                    >
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.483 8.413-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.308 1.654zm6.733-14.453c-.166-.37-.341-.377-.499-.384-.129-.006-.277-.006-.425-.006-.148 0-.388.055-.591.273-.204.218-.777.759-.777 1.85s.796 2.144.906 2.293c.111.148 1.568 2.395 3.8 3.357.518.222.921.356 1.236.456.52.165.993.142 1.367.086.417-.062 1.284-.524 1.465-1.031.181-.506.181-.941.127-1.031-.054-.09-.199-.145-.421-.255s-1.31-.647-1.513-.721-.351-.11-.5.11c-.15.22-.578.721-.708.87-.13.15-.258.168-.48.058s-.937-.344-1.786-1.1c-.66-.588-1.107-1.314-1.237-1.535-.13-.22-.014-.34.097-.449.099-.099.221-.255.333-.384.111-.128.148-.22.222-.369.074-.148.037-.278-.019-.387z" />
                        </svg>
                        Pagar Suscripción
                    </a>
                </div>
            </div>
        </div>
    );
};


const AdvisorModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
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
                        ¡Límite alcanzado!
                    </h2>

                    <p className="text-slate-600 text-lg mb-10 leading-relaxed font-medium">
                        Has alcanzado el límite de tu plan actual. Para crear más tiendas y escalar tu negocio, necesitas asesoría personalizada.
                    </p>

                    <div className="flex flex-col gap-3">
                        <a
                            href="https://wa.me/573026687991?text=Hola,%20alcancé%20el%20límite%20de%20tiendas%20y%20me%20gustaría%20subir%20de%20plan."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-500 hover:bg-green-600 text-white py-4 px-8 rounded-2xl font-black text-lg shadow-xl shadow-green-200 transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
                        >
                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.483 8.413-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.308 1.654zm6.733-14.453c-.166-.37-.341-.377-.499-.384-.129-.006-.277-.006-.425-.006-.148 0-.388.055-.591.273-.204.218-.777.759-.777 1.85s.796 2.144.906 2.293c.111.148 1.568 2.395 3.8 3.357.518.222.921.356 1.236.456.52.165.993.142 1.367.086.417-.062 1.284-.524 1.465-1.031.181-.506.181-.941.127-1.031-.054-.09-.199-.145-.421-.255s-1.31-.647-1.513-.721-.351-.11-.5.11c-.15.22-.578.721-.708.87-.13.15-.258.168-.48.058s-.937-.344-1.786-1.1c-.66-.588-1.107-1.314-1.237-1.535-.13-.22-.014-.34.097-.449.099-.099.221-.255.333-.384.111-.128.148-.22.222-.369.074-.148.037-.278-.019-.387z" />
                            </svg>
                            Hablar con un Asesor
                        </a>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 font-bold py-2 transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default function CreatiendasDashboard() {
    const router = useRouter();
    const { data: session } = useSession();
    const [stores, setStores] = useState<StoreData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);

    // Fetch user's stores
    useEffect(() => {
        fetchStores();
    }, [session]);

    const fetchStores = async () => {
        try {
            const response = await fetch('/api/stores/my-stores');
            if (response.ok) {
                const data = await response.json();
                if (data && Array.isArray(data.stores)) {
                    const storesWithCount = data.stores.map((store: any) => ({
                        ...store,
                        productCount: Array.isArray(store.products) ? store.products.length : 0
                    }));
                    setStores(storesWithCount);

                    // Verifica si hay alguna tienda bloqueada
                    const hasBlockedStore = storesWithCount.some((store: any) => {
                        if (store.isPaid) return false;
                        if (!store.createdAt) return false;
                        const createdDate = new Date(store.createdAt);
                        const daysDiff = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
                        return daysDiff > 30;
                    });
                    
                    if (hasBlockedStore) {
                        setIsBlocked(true);
                    }
                } else {
                    setStores([]);
                }
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

        router.push('/builder');
    };

    const deleteStore = async (storeId: string) => {
        if (!confirm('¿Estás seguro de eliminar esta tienda?')) return;

        try {
            const response = await fetch(`/api/stores/${storeId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Optimistic update
                setStores(prev => prev.filter(s => s.id !== storeId));
            } else {
                const error = await response.json();
                alert(error.message || 'Error al eliminar la tienda');
            }
        } catch (error) {
            console.error('Error deleting store:', error);
            alert('Error de conexión al eliminar la tienda');
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
                    <a
                        href="/builder"
                        onClick={(e) => {
                            const plan = (session?.user as any)?.plan || 'FREE';
                            const limit = plan === 'PRO' ? 10 : 1;
                            if (stores.length >= limit) {
                                e.preventDefault();
                                setIsLimitModalOpen(true);
                            }
                        }}
                        className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl no-underline"
                    >
                        <Plus className="w-5 h-5" />
                        Nueva Tienda
                    </a>
                </div>

                {/* Activation Checklist (Gamification) */}
                <ActivationChecklist stores={stores} />

                {/* Trial Days Banner (full-width, shown for free-plan stores) */}
                <TrialBanner stores={stores} />

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
                                        <a
                                            href={`https://wa.me/?text=${encodeURIComponent(`¡Hola! Mira mi nueva tienda online: ${getStoreUrl(store.slug)}`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 hover:bg-green-50 rounded-lg transition-colors inline-flex items-center justify-center"
                                            title="Compartir en WhatsApp"
                                        >
                                            <MessageCircle className="w-4 h-4 text-green-600" />
                                        </a>
                                        <a
                                            href={`/builder?edit=${store.slug}`}
                                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center justify-center"
                                            title="Editar tienda"
                                        >
                                            <Edit className="w-4 h-4 text-blue-600" />
                                        </a>
                                        <a
                                            href={getStoreUrl(store.slug)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors inline-flex items-center justify-center"
                                            title="Ver tienda"
                                        >
                                            <Eye className="w-4 h-4 text-slate-600" />
                                        </a>
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
                                        {store.createdAt ? new Date(store.createdAt).toLocaleDateString() : ''}
                                    </span>
                                </div>

                                <a
                                    href={`/builder/share?slug=${encodeURIComponent(store.slug || store.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}&storeName=${encodeURIComponent(store.name)}`}
                                    className="w-full mt-6 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl border border-purple-100 transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02] no-underline"
                                >
                                    <QrCode className="w-4 h-4" />
                                    Gestionar QR y Compartir
                                </a>
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
            <AdvisorModal
                isOpen={isLimitModalOpen}
                onClose={() => setIsLimitModalOpen(false)}
            />
            <BlockedStoreModal isOpen={isBlocked} />
        </div>
    );
}
