'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { blogPosts } from '@/data/blogPosts';

const BlogSection = () => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left'
                ? scrollLeft - clientWidth / 2
                : scrollLeft + clientWidth / 2;

            scrollRef.current.scrollTo({
                left: scrollTo,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="py-24 bg-black overflow-hidden" id="blog">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="text-left">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                            Aprende a vender online <br className="hidden md:block" />
                            <span className="text-green-500">con WhatsApp</span>
                        </h2>
                        <p className="text-xl text-slate-400 font-medium max-w-2xl">
                            Guías prácticas para crear tu tienda, automatizar tus ventas y escalar tu negocio sin comisiones.
                        </p>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => scroll('left')}
                            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-colors"
                            aria-label="Anterior"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-colors"
                            aria-label="Siguiente"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Slider Container */}
                <div className="relative group">
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 scrollbar-hide no-scrollbar -mx-4 px-4 md:mx-0 md:px-0"
                    >
                        {blogPosts.map((post, index) => (
                            <div
                                key={index}
                                className="flex-none w-[85vw] md:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)] snap-start"
                            >
                                <div className="group/card h-full bg-slate-900 rounded-[2.5rem] overflow-hidden border border-white/5 transition-all hover:border-green-500/30 hover:shadow-2xl hover:shadow-green-500/10 flex flex-col">
                                    <div className="relative h-60 w-full overflow-hidden">
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            className="transition-transform duration-500 group-hover/card:scale-110 opacity-80 group-hover/card:opacity-100"
                                            loading="lazy"
                                        />
                                        <div className="absolute top-6 left-6">
                                            <span className="px-4 py-2 bg-black/50 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/10 uppercase tracking-widest">
                                                Guía
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-8 flex flex-col flex-grow">
                                        <h3 className="text-xl font-bold text-white mb-4 leading-snug group-hover/card:text-green-400 transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-slate-400 mb-8 line-clamp-3 text-sm leading-relaxed flex-grow">
                                            {post.excerpt}
                                        </p>
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="inline-flex items-center justify-center w-full py-4 px-6 bg-green-500 text-black font-black rounded-2xl shadow-lg shadow-green-900/40 transition-all hover:bg-green-400 active:scale-95 mt-auto"
                                        >
                                            Leer guía completa
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Visual Hint for Mobile */}
                    <div className="md:hidden flex justify-center gap-2 mt-4">
                        {blogPosts.slice(0, 4).map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
