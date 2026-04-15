"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Users, MessageSquare, TrendingUp, Settings, Eye, EyeOff } from "lucide-react";

export default function AdminDashboard() {
    const { data: session } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [stores, setStores] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Solo admin puede acceder
        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            router.push('/dashboard');
            return;
        }
        loadData();
    }, [session]);

    const loadData = async () => {
        try {
            const [usersRes, campaignsRes, storesRes] = await Promise.all([
                fetch('/api/admin/users'),
                fetch('/api/campaigns'),
                fetch('/api/admin/stores') // Added to fetch stores
            ]);

            const usersData = await usersRes.json();
            const campaignsData = await campaignsRes.json();
            const storesData = await storesRes.json();

            setUsers(usersData.users || []);
            setCampaigns(campaignsData.campaigns || []);
            setStores(storesData.stores || []);
        } catch (error) {
            console.error('Error loading admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleCampaign = async (campaignId: string, currentStatus: string) => {
        try {
            const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
            const res = await fetch(`/api/campaigns/${campaignId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                loadData(); // Reload
            }
        } catch (error) {
            console.error('Error toggling campaign:', error);
        }
    };

    const toggleStorePaid = async (storeId: string, currentPaid: boolean) => {
        try {
            const res = await fetch(`/api/admin/stores/${storeId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isPaid: !currentPaid }),
            });

            if (res.ok) {
                loadData(); // Reload
            }
        } catch (error) {
            console.error('Error toggling store paid status:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Cargando panel admin...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Panel de Administración</h1>
                            <p className="text-blue-100">Gestiona usuarios y campañas en tiempo real</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <a
                            href="/admin/ads"
                            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all"
                        >
                            Gestionar Anuncios
                        </a>
                        <a
                            href="/dashboard"
                            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all"
                        >
                            ← Volver al Dashboard
                        </a>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Usuarios Totales</p>
                                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-xl">
                                <TrendingUp className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Campañas Activas</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {campaigns.filter(c => c.status === 'ACTIVE').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 rounded-xl">
                                <MessageSquare className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Campañas</p>
                                <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Campaigns Management */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                        <h2 className="text-xl font-bold text-gray-900">Gestión de Campañas</h2>
                        <p className="text-sm text-gray-600 mt-1">Activa o pausa campañas en tiempo real</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaña</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Presupuesto</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {campaigns.map((campaign) => (
                                    <tr key={campaign.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{campaign.name}</p>
                                                <p className="text-sm text-gray-500">{campaign.objective}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {campaign.user?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            ${campaign.budget?.toLocaleString() || 0}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${campaign.status === 'ACTIVE'
                                                ? 'bg-green-100 text-green-700'
                                                : campaign.status === 'PAUSED'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {campaign.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleCampaign(campaign.id, campaign.status)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${campaign.status === 'ACTIVE'
                                                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    }`}
                                            >
                                                {campaign.status === 'ACTIVE' ? (
                                                    <><EyeOff className="h-4 w-4 inline mr-1" /> Pausar</>
                                                ) : (
                                                    <><Eye className="h-4 w-4 inline mr-1" /> Activar</>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Users List */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-purple-100">
                        <h2 className="text-xl font-bold text-gray-900">Usuarios Registrados</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empresa</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{user.phone}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{user.company?.name || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Stores List */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mt-8">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-100">
                        <h2 className="text-xl font-bold text-gray-900">Gestión de Tiendas</h2>
                        <p className="text-sm text-gray-600 mt-1">Habilita suscripciones pagas para las tiendas (límite 30 días)</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tienda</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Propietario</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creación</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado Bloqueo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Suscripción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {stores.map((store) => {
                                    const createdDate = new Date(store.createdAt);
                                    const daysDiff = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
                                    const isBlocked = !store.isPaid && daysDiff > 30;

                                    return (
                                        <tr key={store.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{store.name}</div>
                                                <div className="text-xs text-gray-500">Slug: {store.slug}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {store.owner?.name || 'N/A'} <br />
                                                <span className="text-xs text-gray-400">{store.owner?.email}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {createdDate.toLocaleDateString()}
                                                <div className="text-xs text-gray-400">Hace {Math.floor(daysDiff)} días</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {isBlocked ? (
                                                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Bloqueada (30d)</span>
                                                ) : store.isPaid ? (
                                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Permanente</span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">En prueba</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleStorePaid(store.id, store.isPaid)}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${store.isPaid
                                                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        }`}
                                                >
                                                    {store.isPaid ? 'Quitar Pago (No Pagó)' : 'Marcar Pagada'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
