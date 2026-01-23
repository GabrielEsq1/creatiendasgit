import Link from 'next/link';
import { Sparkles, CheckCircle, MessageCircle, Clock, Store, ArrowRight } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Crea tu Tienda Online Gratis | Creatiendas',
    description: 'Crea tu tienda online en 2 minutos y vende por WhatsApp. Sin comisiones, sin complicaciones. Empieza gratis hoy.',
    openGraph: {
        title: 'Crea tu Tienda Online Gratis | Creatiendas',
        description: 'Vende por WhatsApp en minutos. Sin comisiones, sin complicaciones.',
    }
};

export default function CrearTiendaPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800">
            {/* Header */}
            <div className="pt-8 px-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Link href="/" className="text-white font-black text-2xl flex items-center gap-2">
                        <Store className="w-8 h-8" />
                        Creatiendas
                    </Link>
                    <Link
                        href="/auth/login"
                        className="text-white/80 hover:text-white font-semibold"
                    >
                        Iniciar Sesion
                    </Link>
                </div>
            </div>

            {/* Hero */}
            <section className="py-20 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-full mb-8 font-bold text-sm">
                        <Sparkles className="w-4 h-4" />
                        PLAN GRATUITO DISPONIBLE
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
                        Crea tu Tienda Online
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                            en 2 Minutos
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto">
                        Vende por WhatsApp sin comisiones, sin inventario, sin complicaciones.
                        <br />
                        Comienza gratis y crece con nosotros.
                    </p>

                    {/* CTA */}
                    <Link
                        href="/auth/register"
                        className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-green-500/30 hover:scale-105 transition-all"
                    >
                        Crear Mi Tienda Gratis
                        <ArrowRight className="w-6 h-6" />
                    </Link>

                    <p className="mt-4 text-white/60 text-sm">
                        No necesitas tarjeta de credito
                    </p>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                        <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-7 h-7 text-green-400" />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">Sin Comisiones</h3>
                        <p className="text-white/70">Tu ganas el 100% de cada venta. Sin sorpresas.</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                        <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <MessageCircle className="w-7 h-7 text-green-400" />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">Vende por WhatsApp</h3>
                        <p className="text-white/70">Tus clientes compran directo desde WhatsApp.</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                        <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-7 h-7 text-green-400" />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">Lista en 2 Minutos</h3>
                        <p className="text-white/70">Sin configuraciones complicadas. Solo crea y vende.</p>
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <section className="py-16 px-4 border-t border-white/10">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="flex flex-wrap justify-center gap-12 text-white">
                        <div>
                            <div className="text-4xl font-black">+2,500</div>
                            <div className="text-white/60 text-sm font-semibold">Tiendas Creadas</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black">LATAM</div>
                            <div className="text-white/60 text-sm font-semibold">Hecho para nosotros</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black">100%</div>
                            <div className="text-white/60 text-sm font-semibold">Gratis para empezar</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 px-4 text-center">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                        Empieza a vender hoy mismo
                    </h2>
                    <p className="text-white/70 mb-8">
                        Unete a miles de emprendedores que ya venden con Creatiendas
                    </p>
                    <Link
                        href="/auth/register"
                        className="inline-flex items-center gap-3 bg-white text-indigo-600 px-10 py-5 rounded-2xl font-black text-xl shadow-2xl hover:scale-105 transition-all"
                    >
                        Crear Mi Tienda Gratis
                        <ArrowRight className="w-6 h-6" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 border-t border-white/10 text-center">
                <p className="text-white/50 text-sm">
                    2024 Creatiendas. Todos los derechos reservados.
                </p>
            </footer>
        </main>
    );
}
