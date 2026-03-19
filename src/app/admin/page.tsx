'use client';
export const dynamic = "force-dynamic";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    Users,
    Store,
    TrendingUp,
    Activity,
    AlertCircle,
    CheckCircle,
    Clock,
    DollarSign
} from 'lucide-react';
import Link from 'next/link';

interface Stats {
    totalUsers: number;
    totalStores: number;
    todayUsers: number;
    todayStores: number;
    growthPercent: number;
}

interface Alert {
    type: string;
    priority: 'high' | 'medium' | 'low';
    title: string;
    message: string;
}

interface RecentUser {
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
}

interface StoreDetailed {
    id: string;
    name: string;
    slug: string;
    views: number;
    createdAt: string;
    owner: {
        id: string;
        name: string | null;
        email: string;
        plan: string;
    } | null;
}

export default function AdminDashboard() {
    const { data: session } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
    const [allStores, setAllStores] = useState<StoreDetailed[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session && (session.user as any)?.role !== 'ADMIN') {
            router.push('/dashboard');
            return;
        }

        fetchDashboardData();
        fetchStoresData();
    }, [session, router]);

    const fetchDashboardData = async () => {
        try {
            const res = await fetch('/api/admin/alerts');
            if (res.ok) {
                const data = await res.json();
                setStats(data.stats);
                setAlerts(data.alerts || []);
                setRecentUsers(data.recentUsers || []);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    const fetchStoresData = async () => {
        try {
            const res = await fetch('/api/admin/stores');
            if (res.ok) {
                const data = await res.json();
                setAllStores(data.stores || []);
            }
        } catch (error) {
            console.error('Error fetching stores data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteStore = async (storeId: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar esta tienda permanentemente?')) return;
        
        try {
            const res = await fetch(`/api/admin/stores/${storeId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setAllStores(prev => prev.filter(s => s.id !== storeId));
                fetchDashboardData(); // update counts
            } else {
                alert('Hubo un error al eliminar la tienda.');
            }
        } catch (e) {
            console.error('Error delete', e);
        }
    };

    const handleUpdatePlan = async (userId: string, currentPlan: string, newPlan: string) => {
        if (currentPlan === newPlan) return;
        if (!confirm(`¿Confirmas el cambio de plan de usuario a ${newPlan}?`)) return;

        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: newPlan })
            });

            if (res.ok) {
                setAllStores(prev => 
                    prev.map(store => {
                        if (store.owner?.id === userId) {
                            return { ...store, owner: { ...store.owner, plan: newPlan } };
                        }
                        return store;
                    })
                );
            } else {
                alert('Hubo un error al actualizar el plan.');
            }
        } catch (e) {
            console.error('Error update plan', e);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-white text-xl uppercase tracking-widest font-mono">Initializing System...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 p-6 font-mono text-slate-300">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-4">
                        <Activity className="w-8 h-8 text-emerald-500" />
                        <div>
                            <h1 className="text-2xl font-bold text-slate-100 uppercase tracking-wider">System Overview</h1>
                            <p className="text-sm text-slate-500">Creatiendas Platform Administration</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={fetchStoresData}
                            className="px-4 py-2 border border-slate-700 rounded hover:bg-slate-800 text-sm flex gap-2 items-center transition-colors"
                        >
                            <Activity className="w-4 h-4" /> REFRESH
                        </button>
                        <button
                            onClick={() => router.push('/admin/users')}
                            className="px-4 py-2 bg-blue-900/50 border border-blue-800 text-blue-300 rounded hover:bg-blue-900 transition-colors text-sm"
                        >
                            USER MANAGEMENT
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard icon={<Users className="w-6 h-6" />} title="Usuarios Totales" value={stats?.totalUsers || 0} change={`+${stats?.todayUsers || 0} 24H`} color="blue" />
                    <StatCard icon={<Store className="w-6 h-6" />} title="Tiendas Totales" value={stats?.totalStores || 0} change={`+${stats?.todayStores || 0} 24H`} color="purple" />
                    <StatCard icon={<TrendingUp className="w-6 h-6" />} title="Crecimiento Total" value={`${stats?.growthPercent || 0}%`} change="7 DÍAS" color="emerald" />
                    <StatCard icon={<Clock className="w-6 h-6" />} title="Actividad (Logs)" value={(stats?.todayUsers || 0) + (stats?.todayStores || 0)} change="24H VOL" color="orange" />
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center gap-3">
                        <Store className="w-5 h-5 text-indigo-400" />
                        <h2 className="text-lg font-bold text-slate-200">ACTIVE STORES REGISTRY</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-800/50 text-slate-400">
                                <tr>
                                    <th className="px-4 py-3 font-medium cursor-pointer flex items-center gap-2">STORE ID</th>
                                    <th className="px-4 py-3 font-medium">NAME / URL</th>
                                    <th className="px-4 py-3 font-medium">OWNER ACCOUNT</th>
                                    <th className="px-4 py-3 font-medium">SUBSCRIPTION</th>
                                    <th className="px-4 py-3 font-medium">CREATED TIMESTAMP</th>
                                    <th className="px-4 py-3 font-medium">TOTAL VIEWS</th>
                                    <th className="px-4 py-3 font-medium text-right">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/80">
                                {allStores.map((store) => (
                                    <tr key={store.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-4 py-3 text-slate-500 font-mono text-xs max-w-[120px] truncate" title={store.id}>
                                            {store.id}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-slate-200 font-medium">{store.name}</div>
                                            <a href={`/stores/${store.slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-xs mt-0.5 inline-block">
                                                /{store.slug}
                                            </a>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-slate-300">{store.owner?.name || 'SYS_UNKNOWN'}</div>
                                            <div className="text-xs text-slate-500">{store.owner?.email}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {store.owner ? (
                                                <select 
                                                    value={store.owner.plan || 'FREE'} 
                                                    onChange={(e) => handleUpdatePlan(store.owner!.id, store.owner!.plan, e.target.value)}
                                                    className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded px-2 py-1 outline-none focus:border-emerald-500 cursor-pointer"
                                                >
                                                    <option value="FREE">FREE</option>
                                                    <option value="PRO">PRO</option>
                                                </select>
                                            ) : (
                                                <span className="text-slate-600 font-mono text-xs">N/A</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-slate-400">
                                            {new Date(store.createdAt).toISOString().split('T')[0]} <span className="text-xs text-slate-600">{new Date(store.createdAt).toISOString().split('T')[1].slice(0, 8)}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-0.5 bg-slate-800 rounded text-xs text-slate-300 font-medium">
                                                {store.views}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right space-x-2">
                                            <a href={`/stores/${store.slug}`} target="_blank" rel="noopener noreferrer">
                                                <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded transition-colors border border-slate-700">
                                                    VIEW
                                                </button>
                                            </a>
                                            <button 
                                                onClick={() => handleDeleteStore(store.id)}
                                                className="px-3 py-1 bg-red-950/30 hover:bg-red-900/50 text-red-500 text-xs rounded transition-colors border border-red-900/50"
                                            >
                                                TERMINATE
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {allStores.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                                            No store records found in database.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, title, value, change, color }: {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    change: string;
    color: 'blue' | 'purple' | 'emerald' | 'orange';
}) {
    const colorClasses = {
        blue: 'from-blue-600 to-blue-700 text-blue-400',
        purple: 'from-purple-600 to-purple-700 text-purple-400',
        emerald: 'from-emerald-600 to-emerald-700 text-emerald-400',
        orange: 'from-orange-600 to-orange-700 text-orange-400'
    };

    return (
        <div className={`bg-gradient-to-br ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]} bg-opacity-10 backdrop-blur rounded-2xl p-6 border border-slate-700`}>
            <div className={`${colorClasses[color].split(' ')[2]} mb-3`}>{icon}</div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
            <p className="text-white text-3xl font-bold mb-1">{value}</p>
            <p className="text-slate-500 text-xs">{change}</p>
        </div>
    );
}

function AlertCard({ alert }: { alert: Alert }) {
    const priorityColors = {
        high: 'border-red-500 bg-red-500/10',
        medium: 'border-yellow-500 bg-yellow-500/10',
        low: 'border-blue-500 bg-blue-500/10'
    };

    return (
        <div className={`p-4 rounded-xl border ${priorityColors[alert.priority]}`}>
            <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div className="flex-1">
                    <h4 className="text-white font-semibold mb-1">{alert.title}</h4>
                    <p className="text-slate-300 text-sm">{alert.message}</p>
                </div>
            </div>
        </div>
    );
}
