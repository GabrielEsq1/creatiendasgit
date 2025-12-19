import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ArticleLayoutProps {
    title: string;
    heroImage: string;
    children: React.ReactNode;
}

const ArticleLayout: React.FC<ArticleLayoutProps> = ({ title, heroImage, children }) => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
                <Image
                    src={heroImage}
                    alt={title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="brightness-[0.8]"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center px-4">
                    <div className="max-w-4xl w-full text-center">
                        <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-2xl tracking-tight leading-tight">
                            {title}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
                {/* Back Link */}
                <Link href="/" className="inline-flex items-center text-green-600 font-bold mb-12 hover:underline group">
                    <svg className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Volver al inicio
                </Link>

                {/* Article Content */}
                <article className="prose prose-lg prose-green max-w-none">
                    <div className="text-gray-700 leading-relaxed space-y-8 font-medium">
                        {children}
                    </div>
                </article>

                {/* Fixed/Sticky Bottom CTA for Mobile and regular end page CTA */}
                <div className="mt-20 p-12 bg-green-50 rounded-[3rem] border border-green-100 text-center">
                    <h2 className="text-3xl font-black text-gray-900 mb-6">¿Listo para empezar?</h2>
                    <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                        Únete a más de 2,500 emprendedores que ya están vendiendo por WhatsApp con Creatiendas.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link
                            href="/auth/register"
                            className="inline-flex h-16 items-center justify-center px-10 bg-green-500 text-white font-black text-xl rounded-2xl shadow-2xl shadow-green-500/30 transition-all hover:bg-green-600 hover:scale-105 active:scale-95"
                        >
                            Crear mi tienda gratis ahora
                        </Link>
                        <Link
                            href="/#demo"
                            className="inline-flex h-16 items-center justify-center px-10 bg-white text-gray-700 border-2 border-gray-200 font-bold text-xl rounded-2xl transition-all hover:border-green-500 hover:text-green-600"
                        >
                            Ver demo
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleLayout;
