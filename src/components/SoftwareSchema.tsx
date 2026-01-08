import React from 'react';

export default function SoftwareSchema({ lang = 'es' }: { lang?: 'es' | 'en' }) {
    const isEn = lang === 'en';
    const schema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Creatiendas",
        "operatingSystem": "All",
        "applicationCategory": "BusinessApplication",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": isEn
            ? "Create your online store via WhatsApp for free in minutes. No commissions, designed for entrepreneurs in LATAM."
            : "Crea tu tienda online por WhatsApp gratis en minutos. Sin comisiones, diseñado para emprendedores en LATAM.",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "2500"
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
