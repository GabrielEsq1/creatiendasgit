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

interface RecentStore {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
}

export default function AdminDashboard() {
    const { data: session } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
    const [recentStores, setRecentStores] = useState<RecentStore[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is admin
        if (session && (session.user as any)?.role !== 'ADMIN') {
            router.push('/dashboard');
            return;
        }

        fetchDashboardData();

        // Refresh every 30 seconds
        const interval = setInterval(fetchDashboardData, 30000);
        return () => clearInterval(interval);
    }, [session, router]);

    const fetchDashboardData = async () => {
        try {
            const res = await fetch('/api/admin/alerts');
            if (res.ok) {
                const data = await res.json();
                setStats(data.stats);
                setAlerts(data.alerts || []);
                setRecentUsers(data.recentUsers || []);
                setRecentStores(data.recentStores || []);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Cargando Panel Admin...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-2">
                        <Link href="/dashboard">
                            <img src="/logo.png" alt="CreaTiendas" className="h-10 w-auto" />
                        </Link>
                        <div className="h-8 w-px bg-slate-700 mx-2" />
                        <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                            <Activity className="w-10 h-10 text-emerald-400" />
                            Panel Admin
                        </h1>
                    </div>
                    <p className="text-slate-400">Monitoreo en tiempo real de Creatiendas</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={<Users className="w-8 h-8" />}
                        title="Total Usuarios"
                        value={stats?.totalUsers || 0}
                        change={`+${stats?.todayUsers || 0} hoy`}
                        color="blue"
                    />
                    <StatCard
                        icon={<Store className="w-8 h-8" />}
                        title="Total Tiendas"
                        value={stats?.totalStores || 0}
                        change={`+${stats?.todayStores || 0} hoy`}
                        color="purple"
                    />
                    <StatCard
                        icon={<TrendingUp className="w-8 h-8" />}
                        title="Crecimiento"
                        value={`${stats?.growthPercent || 0}%`}
                        change="Esta semana"
                        color="emerald"
                    />
                    <StatCard
                        icon={<Clock className="w-8 h-8" />}
                        title="Actividad Hoy"
                        value={(stats?.todayUsers || 0) + (stats?.todayStores || 0)}
                        change="Acciones totales"
                        color="orange"
                    />
                </div>

                {/* Alerts */}
                {alerts.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <AlertCircle className="w-6 h-6 text-yellow-400" />
                            Alertas
                        </h2>
                        <div className="space-y-3">
                            {alerts.map((alert, idx) => (
                                <AlertCard key={idx} alert={alert} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Users */}
                    <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-400" />
                            Usuarios Recientes
                        </h3>
                        <div className="space-y-3">
                            {recentUsers.map(user => (
                                <div key={user.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                                    <div>
                                        <p className="text-white font-medium">{user.name || 'Sin nombre'}</p>
                                        <p className="text-slate-400 text-sm">{user.email}</p>
                                    </div>
                                    <span className="text-xs text-slate-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Stores */}
                    <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Store className="w-5 h-5 text-purple-400" />
                            Tiendas Recientes
                        </h3>
                        <div className="space-y-3">
                            {recentStores.map(store => (
                                <div key={store.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                                    <div>
                                        <p className="text-white font-medium">{store.name}</p>
                                        <p className="text-slate-400 text-sm">/{store.slug}</p>
                                    </div>
                                    <span className="text-xs text-slate-500">
                                        {new Date(store.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => router.push('/admin/users')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                    >
                        <Users className="w-5 h-5" />
                        Gestionar Usuarios
                    </button>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                    >
                        <Store className="w-5 h-5" />
                        Ver Tiendas
                    </button>
                    <button
                        onClick={fetchDashboardData}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                    >
                        <Activity className="w-5 h-5" />
                        Actualizar Datos
                    </button>
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
