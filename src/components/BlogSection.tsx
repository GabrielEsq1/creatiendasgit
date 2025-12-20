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
        <section className="py-24 bg-black">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                        Aprende a vender online con WhatsApp 🎄
                    </h2>
                    <p className="text-xl text-slate-400 font-medium">
                        Guías prácticas para crear tu tienda y vender más sin comisiones ✨
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <div
                            key={index}
                            className="group bg-slate-900 rounded-[2rem] overflow-hidden border border-white/5 transition-all hover:-translate-y-2 hover:border-green-500/30 hover:shadow-2xl hover:shadow-green-500/10"
                        >
                            <div className="relative h-60 w-full overflow-hidden">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    className="transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                    loading="lazy"
                                />
                            </div>
                            <div className="p-8">
                                <h3 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-green-400 transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-slate-400 mb-8 line-clamp-2 text-sm leading-relaxed">
                                    {post.excerpt}
                                </p>
                                <Link
                                    href={`/${post.slug}`}
                                    className="inline-flex items-center justify-center w-full py-4 px-6 bg-green-500 text-white font-black rounded-2xl shadow-lg shadow-green-900/40 transition-all hover:bg-green-600 active:scale-95 group-hover:animate-subtle-bounce"
                                >
                                    Leer guía completa ❄️
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
