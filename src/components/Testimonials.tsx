'use client';

import React, { useRef, useEffect, useState } from 'react';

const testimonials = [
    {
        name: 'Andrea',
        role: 'Boutique de Moda',
        quote: 'Creatiendas me permitió lanzar mi tienda en minutos y ya tengo pedidos todos los días. ¡Es increíble!',
        tag: 'Ventas'
    },
    {
        name: 'Sarah J.',
        role: 'Accesorios',
        quote: 'Subí todo mi inventario desde el celular en una tarde. Lo que más me gusta es que no necesito computador.',
        tag: 'Catálogo'
    },
    {
        name: 'Miguel A.',
        role: 'Burger Shop',
        quote: 'Mis clientes aman que el pedido les llega directo al chat ya listo. Nos ahorra 10 minutos de preguntas por venta.',
        tag: 'WhatsApp'
    },
    {
        name: 'Luisa F.',
        role: 'Ropa Deportiva',
        quote: 'En otras plataformas perdía el 5% por venta. Aquí todo lo que vendo es para mí. Eso paga mi publicidad.',
        tag: '0% Comisiones'
    },
    {
        name: 'Camilo D.',
        role: 'Tecnología',
        quote: 'Pude poner mi logo y mis colores exactos. No parece una plantilla genérica, se ve como MI marca.',
        tag: 'Diseño'
    },
    {
        name: 'Ana P.',
        role: 'Cosmética',
        quote: 'La tienda carga volando. Antes usaba WordPress y era lento. Ahora mis clientes no se aburren esperando.',
        tag: 'Velocidad'
    },
    {
        name: 'Jorge T.',
        role: 'Calzado',
        quote: 'No sé cómo, pero gente que busca "zapatillas en Bogotá" ahora me encuentra en Google gracias a la tienda.',
        tag: 'SEO'
    },
    {
        name: 'Marta L.',
        role: 'Artesanías',
        quote: 'Tengo 50 años y cero tecnología. Creé mi tienda yo sola sin pedirle ayuda a mis hijos. Es muy intuitivo.',
        tag: 'Facilidad'
    },
    {
        name: 'David R.',
        role: 'Mascotas',
        quote: 'Tuve una duda un domingo y me respondieron. No es un robot, es gente real que quiere que vendas.',
        tag: 'Soporte'
    },
    {
        name: 'Valentina S.',
        role: 'Postres',
        quote: 'Que no me retengan la plata es clave. El cliente me paga directo a mi Nequi y yo despacho. Sin intermediarios.',
        tag: 'Pagos'
    },
    {
        name: 'Andrés G.',
        role: 'Ferretería',
        quote: 'Antes mandaba fotos sueltas por WhatsApp. Ahora mando el link de mi catálogo y me veo 10 veces más profesional.',
        tag: 'Imagen'
    },
    {
        name: 'Jhon',
        role: 'Emprendedor Digital',
        quote: 'La integración con WhatsApp simplifica la comunicación con mis clientes. No hay comisiones y todo es mío.',
        tag: 'Libertad'
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

export default function Testimonials() {
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

    // Dividir testimonios en dos grupos y duplicarlos para el scroll infinito
    const half = Math.ceil(testimonials.length / 2);
    const firstRow = [...testimonials.slice(0, half), ...testimonials.slice(0, half), ...testimonials.slice(0, half)];
    const secondRow = [...testimonials.slice(half), ...testimonials.slice(half), ...testimonials.slice(half)];

    return (
        <section ref={sectionRef} className="py-24 bg-slate-50 border-t border-slate-100 overflow-hidden" id="testimonials">
            <div className="max-w-7xl mx-auto px-4 md:px-8 mb-16 text-center">
                <span className="inline-block bg-green-100 text-green-700 text-[10px] font-black px-4 py-1 rounded-full mb-4 uppercase tracking-[0.2em] border border-green-200">
                    Historias Reales
                </span>
                <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                    La comunidad habla
                </h3>
                <p className="text-slate-500 font-medium max-w-2xl mx-auto">
                    Emprendedores reales que validaron su idea y escalaron sus ventas con Creatiendas.
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
                {/* Primera línea */}
                <div 
                    ref={row1Ref}
                    className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide no-scrollbar -mx-4 px-4 md:mx-0 md:px-0"
                >
                    {firstRow.map((t, idx) => (
                        <TestimonialCard key={`row1-${idx}`} t={t} />
                    ))}
                </div>

                {/* Segunda línea */}
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
