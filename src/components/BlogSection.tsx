import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface BlogPost {
    title: string;
    excerpt: string;
    image: string;
    slug: string;
}

const posts: BlogPost[] = [
    {
        title: "Cómo crear una tienda online GRATIS en 2 minutos (sin comisiones)",
        excerpt: "Aprende paso a paso cómo crear tu tienda online gratis y empezar a vender por WhatsApp en minutos.",
        image: "/images/blog/crear-tienda-gratis.png",
        slug: "crear-tienda-online-gratis"
    },
    {
        title: "Pasarelas de pago vs. WhatsApp: Cómo cerrar ventas sin perder clientes",
        excerpt: "Descubre por qué WhatsApp-first es la mejor estrategia para LATAM frente a las pasarelas tradicionales.",
        image: "/images/blog/pasarelas-pago.jpg",
        slug: "pasarelas-pago-vs-whatsapp"
    },
    {
        title: "WhatsApp Commerce 2025: Por qué el email marketing está muriendo",
        excerpt: "Las tendencias que dominarán el ecommerce este año y cómo preparar tu pequeña empresa.",
        image: "/images/blog/trends-2025.jpg",
        slug: "whatsapp-commerce-2025"
    },
    {
        title: "7 Errores fatales al vender por WhatsApp (y cómo evitarlos)",
        excerpt: "No pierdas más ventas por errores simples. Guía para profesionalizar tu atención al cliente.",
        image: "/images/blog/errores-whatsapp.jpg",
        slug: "errores-vender-por-whatsapp"
    },
    {
        title: "Cómo vender por WhatsApp con una tienda online (guía práctica)",
        excerpt: "Convierte WhatsApp en tu principal canal de ventas con una tienda online conectada.",
        image: "/images/blog/vender-por-whatsapp.jpg",
        slug: "vender-por-whatsapp"
    },
    {
        title: "Shopify vs Creatiendas: ¿cuál conviene para pequeños negocios?",
        excerpt: "Compara Shopify y Creatiendas y elige la mejor opción si eres emprendedor o PYME.",
        image: "/images/blog/shopify-vs-creatiendas.jpg",
        slug: "shopify-vs-creatiendas"
    }
];

const BlogSection = () => {
    return (
        <section className="py-24 bg-black overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                        Aprende a vender online <span className="text-green-500">con WhatsApp</span> 🎄
                    </h2>
                    <p className="text-xl text-slate-400 font-medium">
                        Guías prácticas para crear tu tienda y vender más sin comisiones ✨
                    </p>
                </div>

                {/* Slider Container */}
                <div className="relative group">
                    <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 scrollbar-hide no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                        {posts.map((post, index) => (
                            <div
                                key={index}
                                className="flex-none w-[85vw] md:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)] snap-start"
                            >
                                <div className="group/card h-full bg-slate-900 rounded-[2.5rem] overflow-hidden border border-white/5 transition-all hover:border-green-500/30 hover:shadow-2xl hover:shadow-green-500/10">
                                    <div className="relative h-60 w-full overflow-hidden">
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            className="transition-transform duration-500 group-hover/card:scale-110 opacity-80 group-hover/card:opacity-100"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="p-8 flex flex-col h-[calc(100%-15rem)]">
                                        <h3 className="text-xl font-bold text-white mb-4 leading-snug group-hover/card:text-green-400 transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-slate-400 mb-8 line-clamp-3 text-sm leading-relaxed flex-grow">
                                            {post.excerpt}
                                        </p>
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="inline-flex items-center justify-center w-full py-4 px-6 bg-green-500 text-black font-black rounded-2xl shadow-lg shadow-green-900/40 transition-all hover:bg-green-400 active:scale-95"
                                        >
                                            Leer guía completa ❄️
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Visual Hint for Mobile */}
                    <div className="md:hidden flex justify-center gap-2 mt-4">
                        {posts.map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
