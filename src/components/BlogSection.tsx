'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { blogPosts } from '@/data/blogPosts';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BlogSection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const animationFrameRef = useRef<number>();
    const lastScrollTop = useRef(0);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            { threshold: 0 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const drift = () => {
            if (isInView && !isHovered && scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                
                // Drift slightly faster: 0.8px per frame
                if (scrollLeft + clientWidth >= scrollWidth - 2) {
                    scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scrollRef.current.scrollLeft += 0.8;
                }
            }
            animationFrameRef.current = requestAnimationFrame(drift);
        };

        animationFrameRef.current = requestAnimationFrame(drift);
        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [isInView, isHovered]);

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current || !scrollRef.current || isHovered) return;

            const rect = sectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Simple parallax: Move horizontal based on vertical scroll penetration
            if (rect.top < windowHeight && rect.bottom > 0) {
                const totalHeight = windowHeight + rect.height;
                const distanceScrolled = windowHeight - rect.top;
                const scrollProgress = Math.max(0, Math.min(1, distanceScrolled / totalHeight));
                
                const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
                
                if (maxScroll > 0) {
                    // Start from 0 and move up to 60% of the available scroll
                    const targetScroll = maxScroll * scrollProgress * 0.6;
                    scrollRef.current.scrollLeft = targetScroll;
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHovered]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.8;
            
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section ref={sectionRef} className="py-24 bg-black overflow-hidden relative" id="blog">
             {/* Background elements */}
             <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="text-left relative z-10">
                        <div className="inline-block bg-green-500/10 text-green-400 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-green-500/20">
                            Blog & Recursos
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                            Aprende a vender online <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">con WhatsApp</span>
                        </h2>
                        <p className="text-lg text-slate-400 font-medium max-w-2xl">
                            Guías prácticas para crear tu tienda, automatizar tus ventas y escalar tu negocio sin pagar comisiones.
                        </p>
                    </div>
                </div>

                <div 
                    className="relative group/slider"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Navigation Arrows OVER the cards */}
                    <div className="hidden md:block">
                        <button
                            onClick={() => scroll('left')}
                            className="absolute -left-6 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-green-500 hover:text-black hover:border-green-400 transition-all duration-300 shadow-2xl opacity-0 group-hover/slider:opacity-100 group-hover/slider:left-4"
                            aria-label="Anterior"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="absolute -right-6 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-green-500 hover:text-black hover:border-green-400 transition-all duration-300 shadow-2xl opacity-0 group-hover/slider:opacity-100 group-hover/slider:right-4"
                            aria-label="Siguiente"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-6 pb-12 scrollbar-hide no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth"
                    >
                        {blogPosts.map((post, index) => (
                            <div
                                key={index}
                                className="flex-none w-[85vw] md:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)]"
                            >
                                <div className="group/card h-full bg-gradient-to-br from-slate-900/80 to-slate-900 rounded-[2.5rem] overflow-hidden border border-white/5 transition-all duration-500 hover:border-green-500/30 hover:shadow-2xl hover:shadow-green-500/10 flex flex-col backdrop-blur-sm">
                                    <div className="relative h-64 w-full overflow-hidden">
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            className="transition-transform duration-700 group-hover/card:scale-110 opacity-70 group-hover/card:opacity-100"
                                            loading="lazy"
                                        />
                                        <div className="absolute top-6 left-6">
                                            <span className="px-4 py-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-black rounded-full border border-white/10 uppercase tracking-[0.2em]">
                                                Guía Pro
                                            </span>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
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
                                            className="inline-flex items-center justify-between w-full py-4 px-6 bg-slate-800 text-white font-black rounded-2xl border border-white/5 transition-all hover:bg-green-500 hover:text-black hover:border-green-400 group/btn"
                                        >
                                            <span>Leer guía completa</span>
                                            <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="md:hidden flex justify-center gap-2 mt-2">
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
