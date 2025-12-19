import React from 'react';
import ArticleLayout from '@/components/ArticleLayout';

export default function PaginaCrearTienda() {
    return (
        <ArticleLayout
            title="Cómo crear una tienda online GRATIS en 2 minutos (sin comisiones)"
            heroImage="/images/blog/crear-tienda-gratis.png"
        >
            <section>
                <p>Crear una tienda online ya no requiere conocimientos técnicos, pagos mensuales ni procesos largos. Hoy es posible lanzar una tienda funcional en minutos y empezar a vender de inmediato, especialmente si tu canal principal es WhatsApp.</p>
                <p>En esta guía práctica te explicamos <strong>cómo crear una tienda online gratis en solo 2 minutos</strong>, sin comisiones y sin tarjeta de crédito.</p>
            </section>

            <hr className="my-12 border-gray-100" />

            <section>
                <h2 className="text-3xl font-black text-gray-900 mb-6">¿Qué necesitas para crear tu tienda online?</h2>
                <p>Antes de empezar, asegúrate de tener:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Un correo electrónico activo</li>
                    <li>Fotos de tus productos (pueden ser del celular)</li>
                    <li>Precios y descripciones básicas</li>
                    <li>Un número de WhatsApp donde recibas pedidos</li>
                </ul>
                <p className="mt-4">Eso es todo. No necesitas dominio, hosting ni experiencia previa.</p>
            </section>

            <hr className="my-12 border-gray-100" />

            <section>
                <h2 className="text-3xl font-black text-gray-900 mb-6">Paso a paso para crear tu tienda online gratis</h2>
                <div className="space-y-6">
                    <p><strong>Paso 1: Regístrate gratis</strong><br />Ingresa a Creatiendas y crea tu cuenta con tu email. El registro toma menos de 30 segundos.</p>
                    <p><strong>Paso 2: Inicia sesión</strong><br />Accede al panel de control desde cualquier dispositivo.</p>
                    <p><strong>Paso 3: Crea tu tienda</strong><br />Usa el constructor simple para agregar:</p>
                    <ul className="list-disc pl-10 space-y-1">
                        <li>Nombre de tu tienda</li>
                        <li>Logo y colores</li>
                        <li>Información básica del negocio</li>
                    </ul>
                    <p><strong>Paso 4: Agrega tus productos</strong><br />Sube fotos, precios y descripciones fácilmente.</p>
                    <p><strong>Paso 5: Comparte tu tienda</strong><br />Obtén tu enlace o QR y compártelo por WhatsApp, Instagram o donde quieras.</p>
                </div>
                <p className="mt-8">En menos de 2 minutos tu tienda estará en línea y lista para recibir pedidos.</p>
            </section>

            <hr className="my-12 border-gray-100" />

            <section>
                <h2 className="text-3xl font-black text-gray-900 mb-6">¿Por qué usar una tienda online gratis?</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>No pagas mensualidades</li>
                    <li>No hay comisiones por venta</li>
                    <li>No dependes de marketplaces</li>
                    <li>Todo el contacto es directo con el cliente</li>
                </ul>
                <p className="mt-4">Para emprendedores y pequeños negocios, esto significa más margen y más control.</p>
            </section>

            <hr className="my-12 border-gray-100" />

            <section>
                <h2 className="text-3xl font-black text-gray-900 mb-8">Crear tienda online gratis vs plataformas tradicionales</h2>
                <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-lg">
                    <table className="w-full text-left bg-white">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="p-4 font-bold text-gray-900">Característica</th>
                                <th className="p-4 font-bold text-gray-900">Plataformas tradicionales</th>
                                <th className="p-4 font-bold text-green-600">Creatiendas</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <tr>
                                <td className="p-4 text-gray-700">Precio mensual</td>
                                <td className="p-4 text-red-500 font-bold">Desde $29 USD</td>
                                <td className="p-4 text-green-600 font-black">Gratis</td>
                            </tr>
                            <tr>
                                <td className="p-4 text-gray-700">Tiempo de setup</td>
                                <td className="p-4 text-gray-500">Horas o días</td>
                                <td className="p-4 text-green-600 font-black">2 minutos</td>
                            </tr>
                            <tr>
                                <td className="p-4 text-gray-700">Comisiones</td>
                                <td className="p-4 text-red-500 font-bold">Sí</td>
                                <td className="p-4 text-green-600 font-black">No</td>
                            </tr>
                            <tr>
                                <td className="p-4 text-gray-700">WhatsApp</td>
                                <td className="p-4 text-gray-500">Plugins</td>
                                <td className="p-4 text-green-600 font-black">Integrado</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <hr className="my-12 border-gray-100" />

            <section>
                <h2 className="text-3xl font-black text-gray-900 mb-6">Conclusión</h2>
                <p>Si buscas una forma rápida, gratuita y sin complicaciones de empezar a vender online, crear una tienda online gratis con Creatiendas es la opción más simple y efectiva.</p>
            </section>
        </ArticleLayout>
    );
}
