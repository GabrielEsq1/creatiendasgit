"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
    MessageSquare,
    TrendingUp,
    Users,
    Megaphone,
    ArrowRight,
    Store,
} from "lucide-react";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState({
        conversations: 0,
        campaigns: 0,
        socialConnections: 0,
        messages: 0,
    });

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            fetchStats();
        }
    }, [status, router]);

    const fetchStats = async () => {
        // TODO: Implement actual stats fetching
        setStats({
            conversations: 0,
            campaigns: 0,
            socialConnections: 0,
            messages: 0,
        });
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900">
            {/* Header */}
            <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">B2BChat</h1>
                                <p className="text-blue-100 text-sm">Bienvenido, {session?.user?.name}</p>
                            </div>
                        </div>
                        <Link
                            href="/dashboard/profile"
                            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all"
                        >
                            Mi Perfil
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">
                        ¡Hola, {session?.user?.name?.split(' ')[0]}! 👋
                    </h2>
                    <p className="text-blue-100">
                        Gestiona tus conversaciones, campañas y conexiones empresariales
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <MessageSquare className="h-6 w-6 text-blue-600" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{stats.conversations}</span>
                        </div>
                        <h3 className="text-gray-600 font-medium">Conversaciones</h3>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-100 rounded-xl">
                                <Megaphone className="h-6 w-6 text-green-600" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{stats.campaigns}</span>
                        </div>
                        <h3 className="text-gray-600 font-medium">Campañas</h3>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-100 rounded-xl">
                                <Users className="h-6 w-6 text-purple-600" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{stats.socialConnections}</span>
                        </div>
                        <h3 className="text-gray-600 font-medium">Conexiones</h3>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-orange-100 rounded-xl">
                                <TrendingUp className="h-6 w-6 text-orange-600" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{stats.messages}</span>
                        </div>
                        <h3 className="text-gray-600 font-medium">Mensajes</h3>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link
                        href="/chat"
                        className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all transform hover:scale-[1.02] group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                                <MessageSquare className="h-6 w-6 text-white" />
                            </div>
                            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Chat B2B</h3>
                        <p className="text-gray-600 text-sm">
                            Inicia conversaciones con empresas y profesionales
                        </p>
                    </Link>

                    <Link
                        href="/contacts"
                        className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all transform hover:scale-[1.02] group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Contactos</h3>
                        <p className="text-gray-600 text-sm">
                            Gestiona tu red de contactos empresariales
                        </p>
                    </Link>

                    <Link
                        href="/ads-manager"
                        className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all transform hover:scale-[1.02] group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                                <Megaphone className="h-6 w-6 text-white" />
                            </div>
                            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Gestor de Anuncios</h3>
                        <p className="text-gray-600 text-sm">
                            Crea y gestiona tus campañas publicitarias
                        </p>
                    </Link>

                    <a
                        href="https://creatiendas.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all transform hover:scale-[1.02] group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl">
                                <Store className="h-6 w-6 text-white" />
                            </div>
                            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-pink-600 transition-colors" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Mi Tienda</h3>
                        <p className="text-gray-600 text-sm">
                            Gestiona tu tienda online en Creatiendas
                        </p>
                    </a>
                </div>
            </div>
        </div>
    );
}
