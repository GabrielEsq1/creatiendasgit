import React from 'react';
import WalkthroughSlideshow from '../WalkthroughSlideshow';
import { MessageSquare, Store, Wallet, Zap, Shield, Globe, ArrowRight } from 'lucide-react';

export default function HomeView({ onNavigate }: { onNavigate: (app: 'b2bchat' | 'creatiendas' | 'both') => void }) {
    return (
        <div className="h-full overflow-y-auto bg-slate-50 pb-20">
            {/* Hero Section with Slideshow */}
            <div className="bg-slate-900 text-white pt-10 pb-20 px-4 rounded-b-[3rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[100px]"></div>
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-12">
                        <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-semibold mb-4 backdrop-blur-sm">
                            ✨ Bienvenido a tu Ecosistema Digital
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-200">
                            Enterprise Hub
                        </h1>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                            Gestiona tu negocio, comunícate con clientes y controla tus finanzas.
                            Todo en una sola plataforma unificada y potente. 🚀
                        </p>
                    </div>

                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-800/50 backdrop-blur-sm">
                        <WalkthroughSlideshow />
                    </div>
                </div>
            </div>

            {/* Cards Section */}
            <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* B2BChat Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer" onClick={() => onNavigate('b2bchat')}>
                        <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <MessageSquare className="w-7 h-7 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">B2BChat</h3>
                        <p className="text-slate-600 mb-4">
                            Centraliza tus conversaciones de WhatsApp, Instagram y Messenger. Automatiza respuestas y vende más. 💬
                        </p>
                        <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                            Ir al Chat <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                    </div>

                    {/* Creatiendas Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer" onClick={() => onNavigate('creatiendas')}>
                        <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Store className="w-7 h-7 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Creatiendas</h3>
                        <p className="text-slate-600 mb-4">
                            Crea tu tienda online en minutos. Catálogo digital, carrito de compras y pagos integrados. 🛍️
                        </p>
                        <div className="flex items-center text-purple-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                            Ir a la Tienda <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                    </div>

                    {/* Monedera Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 group">
                        <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Wallet className="w-7 h-7 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Billetera</h3>
                        <p className="text-slate-600 mb-4">
                            Gestiona tus ingresos, realiza pagos y recargas. Tu dinero seguro y disponible 24/7. 💰
                        </p>
                        <div className="flex items-center text-green-600 font-semibold text-sm">
                            Disponible en el menú <Zap className="w-4 h-4 ml-1" />
                        </div>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                    <div className="text-2xl">ℹ️</div>
                    <div>
                        <h4 className="font-bold text-blue-900 mb-1">Estado de las aplicaciones</h4>
                        <p className="text-sm text-blue-700">
                            B2BChat y Creatiendas están integrados nativamente en Enterprise Hub y utilizan el mismo sistema de autenticación.
                            Actualmente estamos finalizando las funcionalidades completas de cada aplicación.
                        </p>
                    </div>
                </div>
            </div>

            {/* Long Text / UX Section */}
            <div className="max-w-4xl mx-auto px-4 mt-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-800 mb-4">¿Por qué Enterprise Hub? 🤔</h2>
                    <p className="text-lg text-slate-600">
                        Diseñado para potenciar cada aspecto de tu negocio digital con herramientas de vanguardia.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-orange-100 text-orange-600 mt-1">
                                <Zap className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-slate-800">Velocidad Increíble</h4>
                                <p className="text-slate-600">
                                    Nuestra plataforma está optimizada para cargar al instante. No pierdas clientes por esperas innecesarias. ⚡
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mt-1">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-slate-800">Seguridad Total</h4>
                                <p className="text-slate-600">
                                    Tus datos y los de tus clientes están protegidos con encriptación de grado militar. 🔒
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600 mt-1">
                                <Globe className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-slate-800">Alcance Global</h4>
                                <p className="text-slate-600">
                                    Vende y comunícate sin fronteras. Tu negocio disponible para el mundo entero. 🌍
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl p-8 border border-slate-200">
                        <h3 className="text-2xl font-bold text-slate-800 mb-4">
                            "La herramienta definitiva para el comercio moderno"
                        </h3>
                        <p className="text-slate-600 mb-6 italic">
                            Hemos integrado lo mejor de la mensajería instantánea con el poder del comercio electrónico.
                            Ya no necesitas múltiples pestañas o aplicaciones. Todo fluye en un solo lugar.
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                EH
                            </div>
                            <div>
                                <div className="font-bold text-slate-800">Equipo Enterprise</div>
                                <div className="text-sm text-slate-500">Product Team</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
