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

    // Split testimonials into two groups
    const half = Math.ceil(testimonials.length / 2);
    const firstRow = testimonials.slice(0, half);
    const secondRow = testimonials.slice(half);

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

            <div className={`flex flex-col gap-8 transition-opacity duration-1000 ${isInView ? 'opacity-100' : 'opacity-50'}`}>
                {/* First line */}
                <div className="flex overflow-hidden">
                    <div className={`flex flex-nowrap gap-6 w-max pause-on-hover px-4 ${isInView ? 'animate-scroll-left' : ''}`}>
                        {[...firstRow, ...firstRow].map((t, idx) => (
                            <TestimonialCard key={idx} t={t} />
                        ))}
                    </div>
                </div>

                {/* Second line */}
                <div className="flex overflow-hidden">
                    <div className={`flex flex-nowrap gap-6 w-max pause-on-hover px-4 ${isInView ? 'animate-scroll-right' : ''}`}>
                        {[...secondRow, ...secondRow, ...secondRow].map((t, idx) => (
                            <TestimonialCard key={idx} t={t} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
