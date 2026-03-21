'use client';

import React, { useRef, useEffect, useState } from 'react';

const testimonials = [
    {
        name: 'Andrea',
        role: 'Fashion Boutique',
        quote: 'Creatiendas allowed me to launch my store in minutes and I already have orders every day. It\'s incredible!',
        tag: 'Sales'
    },
    {
        name: 'Sarah J.',
        role: 'Accessories',
        quote: 'I uploaded my entire inventory from my phone in one afternoon. What I love most is that I don\'t need a computer.',
        tag: 'Catalog'
    },
    {
        name: 'Miguel A.',
        role: 'Burger Shop',
        quote: 'My customers love that the order reaches them directly in the chat already prepared. It saves us 10 minutes of questions per sale.',
        tag: 'WhatsApp'
    },
    {
        name: 'Luisa F.',
        role: 'Sportswear',
        quote: 'On other platforms I lost 5% per sale. Here everything I sell is mine. That pays for my advertising.',
        tag: '0% Commission'
    },
    {
        name: 'Camilo D.',
        role: 'Technology',
        quote: 'I was able to put my logo and my exact colors. It doesn\'t look like a generic template, it looks like MY brand.',
        tag: 'Design'
    },
    {
        name: 'Ana P.',
        role: 'Cosmetics',
        quote: 'The store loads fast. Before I used WordPress and it was slow. Now my customers don\'t get bored waiting.',
        tag: 'Speed'
    },
    {
        name: 'Jorge T.',
        role: 'Footwear',
        quote: 'I don\'t know how, but people searching for "sneakers in Bogotá" now find me on Google thanks to the store.',
        tag: 'SEO'
    },
    {
        name: 'Marta L.',
        role: 'Handicrafts',
        quote: 'I\'m 50 years old and zero technology. I created my store by myself without asking my children for help. It\'s very intuitive.',
        tag: 'Ease of Use'
    },
    {
        name: 'David R.',
        role: 'Pets',
        quote: 'I had a question on a Sunday and they answered me. It\'s not a robot, it\'s real people who want you to sell.',
        tag: 'Support'
    },
    {
        name: 'Valentina S.',
        role: 'Desserts',
        quote: 'Not having my money held is key. The customer pays me directly to my Nequi and I ship. No intermediaries.',
        tag: 'Payments'
    },
    {
        name: 'Andrés G.',
        role: 'Hardware Store',
        quote: 'Before I sent separate photos by WhatsApp. Now I send the link to my catalog and I look 10 times more professional.',
        tag: 'Image'
    },
    {
        name: 'Jhon',
        role: 'Digital Entrepreneur',
        quote: 'The WhatsApp integration simplifies communication with my customers. There are no commissions and everything is mine.',
        tag: 'Freedom'
    }
];

const TestimonialCard = ({ t }: { t: typeof testimonials[0] }) => (
    <div className="flex-none w-[350px] md:w-[400px] bg-white border border-slate-100 rounded-[2rem] p-8 flex flex-col shadow-lg shadow-slate-200/50 hover:border-green-500/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
        <div className="mb-4">
            <span className="inline-block bg-slate-100 text-slate-500 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider group-hover:bg-green-50 group-hover:text-green-600 transition-colors">
                {t.tag}
            </span>
        </div>
        <p className="text-slate-600 italic mb-6 text-base leading-relaxed">
            "{t.quote}"
        </p>
        <div className="mt-auto flex items-center gap-3 pt-6 border-t border-slate-50">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-black text-sm shadow-md">
                {t.name.charAt(0)}
            </div>
            <div>
                <p className="text-slate-900 font-black text-sm">{t.name}</p>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{t.role}</p>
            </div>
        </div>
    </div>
);

export default function TestimonialsEN() {
    const sectionRef = useRef<HTMLElement>(null);
    const [isInView, setIsInView] = useState(false);

    const row1Ref = useRef<HTMLDivElement>(null);
    const row2Ref = useRef<HTMLDivElement>(null);
    const animationFrameRef = useRef<number>();
    const [isHovered, setIsHovered] = useState(false);
    const [isTouched, setIsTouched] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Initial setup for the second row to start at the end so it can scroll backward
    useEffect(() => {
        if (row2Ref.current) {
            row2Ref.current.scrollLeft = row2Ref.current.scrollWidth - row2Ref.current.clientWidth;
        }
    }, []);

    useEffect(() => {
        const drift = () => {
            if (isInView && !isHovered && !isTouched) {
                // Row 1: Scroll Left
                if (row1Ref.current) {
                    const { scrollLeft, scrollWidth, clientWidth } = row1Ref.current;
                    if (scrollLeft + clientWidth >= scrollWidth - 2) {
                        row1Ref.current.scrollTo({ left: 0, behavior: 'auto' });
                    } else {
                        row1Ref.current.scrollLeft += 0.5;
                    }
                }
                // Row 2: Scroll Right (going backwards)
                if (row2Ref.current) {
                    const { scrollLeft, scrollWidth, clientWidth } = row2Ref.current;
                    if (scrollLeft <= 2) {
                        row2Ref.current.scrollTo({ left: scrollWidth - clientWidth, behavior: 'auto' });
                    } else {
                        row2Ref.current.scrollLeft -= 0.5;
                    }
                }
            }
            animationFrameRef.current = requestAnimationFrame(drift);
        };

        animationFrameRef.current = requestAnimationFrame(drift);
        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [isInView, isHovered, isTouched]);

    // Split testimonials into two groups and duplicate for infinite scroll
    const half = Math.ceil(testimonials.length / 2);
    const firstRow = [...testimonials.slice(0, half), ...testimonials.slice(0, half), ...testimonials.slice(0, half)];
    const secondRow = [...testimonials.slice(half), ...testimonials.slice(half), ...testimonials.slice(half)];

    return (
        <section ref={sectionRef} className="py-24 bg-slate-50 border-t border-slate-100 overflow-hidden" id="testimonials">
            <div className="max-w-7xl mx-auto px-4 md:px-8 mb-16 text-center">
                <span className="inline-block bg-green-100 text-green-700 text-[10px] font-black px-4 py-1 rounded-full mb-4 uppercase tracking-[0.2em] border border-green-200">
                    Real Stories
                </span>
                <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                    The Community Speaks
                </h3>
                <p className="text-slate-500 font-medium max-w-2xl mx-auto">
                    Real entrepreneurs who validated their idea and scaled their sales with Creatiendas.
                </p>
            </div>

            <div 
                className={`flex flex-col gap-8 transition-opacity duration-1000 ${isInView ? 'opacity-100' : 'opacity-50'}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onTouchStart={() => setIsTouched(true)}
                onTouchEnd={() => setIsTouched(false)}
                onTouchCancel={() => setIsTouched(false)}
            >
                {/* First line */}
                <div 
                    ref={row1Ref}
                    className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide no-scrollbar -mx-4 px-4 md:mx-0 md:px-0"
                >
                    {firstRow.map((t, idx) => (
                        <TestimonialCard key={`row1-${idx}`} t={t} />
                    ))}
                </div>

                {/* Second line */}
                <div 
                    ref={row2Ref}
                    className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide no-scrollbar -mx-4 px-4 md:mx-0 md:px-0"
                >
                    {secondRow.map((t, idx) => (
                        <TestimonialCard key={`row2-${idx}`} t={t} />
                    ))}
                </div>
            </div>
        </section>
    );
}
