import React from 'react';
import ArticleLayout from '@/components/ArticleLayout';
import { Metadata } from 'next';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';

export const metadata: Metadata = {
    title: "Cómo vender por WhatsApp con una tienda online (guía práctica)",
    description: "Descubre cómo profesionalizar tus ventas por WhatsApp. Crea un catálogo online, recibe pedidos automáticos y escala tu negocio sin perder tiempo.",
};

export default function PaginaVenderWhatsApp() {
    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Inicio', item: '/' },
                    { name: 'Cómo vender por WhatsApp', item: '/vender-por-whatsapp' }
                ]}
            />
            <ArticleLayout
                title="Cómo vender por WhatsApp con una tienda online (guía práctica)"
                heroImage="/images/blog/vender-por-whatsapp.jpg"
            >
                <section>
                    <p>WhatsApp es uno de los canales de venta más poderosos para pequeños negocios en LATAM. Sin embargo, vender solo enviando fotos y precios suele ser caótico y poco profesional.</p>
                    <p>La solución es <strong>vender por WhatsApp usando una tienda online conectada</strong>, que ordene tus productos y facilite el proceso para tus clientes.</p>
                </section>

                <hr className="my-12 border-gray-100" />

                <section>
                    <h2 className="text-3xl font-black text-gray-900 mb-6">Problemas comunes al vender solo por WhatsApp</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Enviar precios uno por uno</li>
                        <li>Clientes preguntando lo mismo</li>
                        <li>Pedidos desordenados</li>
                        <li>Pérdida de tiempo y ventas</li>
                    </ul>
                    <p className="mt-6">Una tienda online elimina todos estos problemas.</p>
                </section>

                <hr className="my-12 border-gray-100" />

                <section>
                    <h2 className="text-3xl font-black text-gray-900 mb-6">¿Cómo funciona una tienda conectada a WhatsApp?</h2>
                    <p>Una tienda online para WhatsApp permite que:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>El cliente vea tu catálogo completo</li>
                        <li>Seleccione productos</li>
                        <li>Envíe el pedido directamente a tu WhatsApp</li>
                    </ul>
                    <p className="mt-6">Todo sin intermediarios ni comisiones.</p>
                </section>

                <hr className="my-12 border-gray-100" />

                <section>
                    <h2 className="text-3xl font-black text-gray-900 mb-6">Pasos para vender por WhatsApp con Creatiendas</h2>
                    <ol className="list-decimal pl-6 space-y-3">
                        <li>Crea tu tienda online gratis</li>
                        <li>Sube tus productos</li>
                        <li>Configura tu número de WhatsApp</li>
                        <li>Comparte tu enlace de tienda</li>
                    </ol>
                    <p className="mt-6">Cuando un cliente hace un pedido, llega automáticamente a tu WhatsApp con el detalle completo.</p>
                </section>

                <hr className="my-12 border-gray-100" />

                <section>
                    <h2 className="text-3xl font-black text-gray-900 mb-6">Beneficios de vender por WhatsApp con tienda online</h2>
                    <ul className="list-disc pl-6 space-y-2 font-bold text-green-600">
                        <li>Más profesionalismo</li>
                        <li>Menos mensajes repetitivos</li>
                        <li>Mayor tasa de cierre</li>
                        <li>Mejor experiencia para el cliente</li>
                    </ul>
                </section>

                <hr className="my-12 border-gray-100" />

                <section>
                    <h2 className="text-3xl font-black text-gray-900 mb-6">¿Para quién es ideal este modelo?</h2>
                    <div className="flex flex-wrap gap-3">
                        {["Emprendedores", "Tiendas pequeñas", "Negocios locales", "Marcas nuevas", "Dropshipping"].map((tag) => (
                            <span key={tag} className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 font-bold text-sm">
                                {tag}
                            </span>
                        ))}
                    </div>
                </section>

                <hr className="my-12 border-gray-100" />

                <section>
                    <h2 className="text-3xl font-black text-gray-900 mb-6">Conclusión</h2>
                    <p>Si ya vendes por WhatsApp, una tienda online conectada es el siguiente paso lógico para vender más y perder menos tiempo.</p>
                </section>
            </ArticleLayout>
        </>
    );
}
