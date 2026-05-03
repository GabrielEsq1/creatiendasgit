'use client';

import React from 'react';
import { useAnalytics } from './Analytics';
import { trackConversionEvent } from '@/lib/analytics';

export default function FinalCTA() {
    const { trackEvent } = useAnalytics();

    return (
        <section className="py-12 md:py-16 px-4 md:px-8 lg:px-16 bg-[#22c55e] text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Prueba tu idea</h2>
            <p className="mb-6 max-w-2xl mx-auto text-base md:text-lg">
                No te cases con la plataforma. Explora, valida y decide después.
            </p>
            <a
                href="/auth/register"
                onClick={() => {
                    trackEvent('primary_cta_click', { location: 'final_cta' });
                    trackConversionEvent('Lead');
                }}
                className="inline-block w-full sm:w-auto bg-white text-[#22c55e] font-bold px-8 py-4 rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
                Empezar sin riesgo
            </a>
        </section>
    );
}
