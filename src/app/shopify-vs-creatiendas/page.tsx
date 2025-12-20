import React from 'react';
import ArticleLayout from '@/components/ArticleLayout';

export default function PaginaShopifyVsCreatiendas() {
    return (
        <ArticleLayout
            title="Shopify vs Creatiendas: ¿cuál conviene para pequeños negocios?"
            heroImage="/images/blog/shopify-vs-creatiendas.jpg"
        >
            <section>
                <p>Elegir la plataforma correcta para vender online es clave, especialmente si estás empezando. Dos opciones comunes son Shopify y Creatiendas, pero están pensadas para públicos muy diferentes.</p>
                <p>En esta comparación te mostramos <strong>cuál conviene más para pequeños negocios y emprendedores</strong>.</p>
            </section>

            <hr className="my-12 border-gray-100" />

            <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-red-50 p-8 rounded-[2rem] border border-red-100">
                    <h2 className="text-2xl font-black text-red-600 mb-6">Shopify</h2>
                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-900">Ventajas:</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            <li>Plataforma robusta</li>
                            <li>Muchas integraciones</li>
                            <li>Escalable</li>
                        </ul>
                        <h3 className="font-bold text-gray-900 mt-6">Desventajas:</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            <li>Pago mensual en dólares</li>
                            <li>Comisiones adicionales</li>
                            <li>Configuración más compleja</li>
                            <li>WhatsApp no es nativo</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-green-50 p-8 rounded-[2rem] border border-green-100">
                    <h2 className="text-2xl font-black text-green-600 mb-6">Creatiendas</h2>
                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-900">Ventajas:</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            <li>100% gratis</li>
                            <li>Sin comisiones</li>
                            <li>Setup en 2 minutos</li>
                            <li>WhatsApp integrado</li>
                            <li>Ideal para LATAM</li>
                        </ul>
                        <h3 className="font-bold text-gray-900 mt-6">Desventajas:</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            <li>Enfocado en PYMES (no enterprise)</li>
                        </ul>
                    </div>
                </div>
            </section>

            <hr className="my-12 border-gray-100" />

            <section>
                <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Comparación directa</h2>
                {/* Mobile-friendly scrollable table container */}
                <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden rounded-[1rem] md:rounded-[2rem] border border-gray-100 shadow-xl">
                            <table className="min-w-full text-left bg-white">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="p-3 md:p-6 font-bold text-gray-900 text-sm md:text-base whitespace-nowrap">Característica</th>
                                        <th className="p-3 md:p-6 font-bold text-gray-900 text-sm md:text-base whitespace-nowrap">Shopify</th>
                                        <th className="p-3 md:p-6 font-bold text-green-600 text-sm md:text-base whitespace-nowrap">Creatiendas</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    <tr>
                                        <td className="p-3 md:p-6 text-gray-700 font-medium text-sm md:text-base whitespace-nowrap">Precio mensual</td>
                                        <td className="p-3 md:p-6 text-red-500 font-bold text-sm md:text-base whitespace-nowrap">$29 USD / mes</td>
                                        <td className="p-3 md:p-6 text-green-600 font-black text-sm md:text-base whitespace-nowrap">Gratis</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 md:p-6 text-gray-700 font-medium text-sm md:text-base whitespace-nowrap">Comisiones</td>
                                        <td className="p-3 md:p-6 text-red-500 font-bold text-sm md:text-base whitespace-nowrap">Sí</td>
                                        <td className="p-3 md:p-6 text-green-600 font-black text-sm md:text-base whitespace-nowrap">No</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 md:p-6 text-gray-700 font-medium text-sm md:text-base whitespace-nowrap">Tiempo de setup</td>
                                        <td className="p-3 md:p-6 text-gray-500 text-sm md:text-base whitespace-nowrap">Horas o días</td>
                                        <td className="p-3 md:p-6 text-green-600 font-black text-sm md:text-base whitespace-nowrap">2 minutos</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 md:p-6 text-gray-700 font-medium text-sm md:text-base whitespace-nowrap">WhatsApp</td>
                                        <td className="p-3 md:p-6 text-gray-500 text-sm md:text-base whitespace-nowrap">Plugins</td>
                                        <td className="p-3 md:p-6 text-green-600 font-black text-sm md:text-base whitespace-nowrap">Integrado</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 md:p-6 text-gray-700 font-medium text-sm md:text-base whitespace-nowrap">Ideal para</td>
                                        <td className="p-3 md:p-6 text-gray-500 text-sm md:text-base whitespace-nowrap">Empresas grandes</td>
                                        <td className="p-3 md:p-6 text-green-600 font-black text-sm md:text-base whitespace-nowrap">PYMES</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {/* Scroll hint for mobile */}
                <p className="text-center text-xs text-gray-400 mt-3 md:hidden">← Desliza para ver toda la tabla →</p>
            </section>

            <hr className="my-12 border-gray-100" />

            <section className="bg-gray-900 text-white p-12 rounded-[3rem] text-center">
                <h2 className="text-3xl font-black mb-6">¿Cuál deberías elegir?</h2>
                <div className="space-y-4 text-xl">
                    <p>👉 Si estás empezando y vendes por WhatsApp <span className="text-green-400 font-black">→ Creatiendas</span></p>
                    <p>👉 Si tienes un equipo técnico y presupuesto <span className="text-blue-400 font-bold">→ Shopify</span></p>
                </div>
            </section>

            <hr className="my-12 border-gray-100" />

            <section>
                <h2 className="text-3xl font-black text-gray-900 mb-6">Conclusión</h2>
                <p>Para pequeños negocios que buscan vender rápido, sin costos y sin fricción, Creatiendas es la opción más conveniente.</p>
            </section>
        </ArticleLayout>
    );
}
