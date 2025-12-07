import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-green-50 py-16 px-4 md:px-8 lg:px-16">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-green-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-6xl mx-auto relative">
                {/* Trust Badge */}
                <div className="flex justify-center mb-6">
                    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-green-200 rounded-full px-4 py-2 shadow-sm">
                        <span className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </span>
                        <span className="text-sm text-gray-600 font-medium">+500 tiendas creadas</span>
                    </div>
                </div>

                {/* Main Headline */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                        El <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">Shopify de WhatsApp</span>
                        <br />
                        <span className="text-3xl md:text-4xl lg:text-5xl">para negocios latinoamericanos</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto">
                        Crea tu tienda online en <span className="font-bold text-green-600">2 minutos</span>, no en 2 días.
                        <br className="hidden md:block" />
                        Recibe pedidos directo a tu WhatsApp. <span className="font-bold text-green-600">100% GRATIS.</span>
                    </p>
                </div>

                {/* Shopify Comparison Box */}
                <div className="max-w-2xl mx-auto mb-10">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="grid grid-cols-3 text-center">
                            <div className="p-4 border-b border-gray-100">
                                <span className="text-xs text-gray-500 uppercase tracking-wider">Característica</span>
                            </div>
                            <div className="p-4 border-b border-gray-100 bg-gray-50">
                                <span className="text-xs text-gray-500 uppercase tracking-wider">Otros</span>
                            </div>
                            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-green-500 to-emerald-600">
                                <span className="text-xs text-white uppercase tracking-wider font-bold">Creatiendas</span>
                            </div>

                            {/* Row 1 */}
                            <div className="p-4 flex items-center justify-center border-b border-gray-50">
                                <span className="text-sm text-gray-700">Precio mensual</span>
                            </div>
                            <div className="p-4 flex items-center justify-center border-b border-gray-50 bg-gray-50">
                                <span className="text-red-500 font-semibold">$29+ USD</span>
                            </div>
                            <div className="p-4 flex items-center justify-center border-b border-gray-50 bg-green-50">
                                <span className="text-green-600 font-bold text-lg">¡GRATIS!</span>
                            </div>

                            {/* Row 2 */}
                            <div className="p-4 flex items-center justify-center border-b border-gray-50">
                                <span className="text-sm text-gray-700">Tiempo de setup</span>
                            </div>
                            <div className="p-4 flex items-center justify-center border-b border-gray-50 bg-gray-50">
                                <span className="text-gray-500">Horas / Días</span>
                            </div>
                            <div className="p-4 flex items-center justify-center border-b border-gray-50 bg-green-50">
                                <span className="text-green-600 font-bold">2 minutos ⚡</span>
                            </div>

                            {/* Row 3 */}
                            <div className="p-4 flex items-center justify-center">
                                <span className="text-sm text-gray-700">WhatsApp nativo</span>
                            </div>
                            <div className="p-4 flex items-center justify-center bg-gray-50">
                                <span className="text-red-500">❌ Plugins extra</span>
                            </div>
                            <div className="p-4 flex items-center justify-center bg-green-50">
                                <span className="text-green-600 font-bold">✅ Integrado</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                    <Link
                        href="/auth/register"
                        className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-105"
                    >
                        🏪 Crear mi tienda GRATIS
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                    <Link
                        href="#demo"
                        className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
                    >
                        ▶️ Ver demo en vivo
                    </Link>
                </div>

                {/* Trust Elements */}
                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Sin tarjeta de crédito
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Sin comisiones
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        100% en español
                    </div>
                </div>

                {/* Steps Card */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {[
                        { title: 'Regístrate gratis', icon: '📝', desc: 'Solo email, sin tarjeta' },
                        { title: 'Crea tu tienda', icon: '🎨', desc: 'Constructor visual fácil' },
                        { title: 'Recibe pedidos por WhatsApp', icon: '📲', desc: '¡Empieza a vender!' },
                    ].map((step, idx) => (
                        <div
                            key={idx}
                            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 flex flex-col items-center text-center transition-all hover:-translate-y-1 border border-gray-100"
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <span className="text-3xl">{step.icon}</span>
                            </div>
                            <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full mb-2">
                                Paso {idx + 1}
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">{step.title}</h3>
                            <p className="text-sm text-gray-500">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
