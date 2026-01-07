import React from 'react';

export default function LocalBusinessSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Software as a Service (SaaS)",
        "provider": {
            "@type": "LocalBusiness",
            "name": "Creatiendas",
            "image": "https://creatiendas.co/logo.png",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Bogotá",
                "addressRegion": "Cundinamarca",
                "addressCountry": "CO"
            },
            "priceRange": "$$"
        },
        "areaServed": {
            "@type": "Country",
            "name": ["Colombia", "México", "Perú", "Chile", "Argentina"]
        },
        "description": "Plataforma para crear tiendas online optimizadas para WhatsApp en toda Latinoamérica."
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
