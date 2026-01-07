import React from 'react';

export default function OrganizationSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Creatiendas",
        "url": "https://creatiendas.co",
        "logo": "https://creatiendas.co/logo.png",
        "sameAs": [
            "https://www.facebook.com/creatiendas",
            "https://www.instagram.com/creatiendas",
            "https://www.linkedin.com/company/creatiendas"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+573000000000",
            "contactType": "customer service",
            "areaServed": "LATAM",
            "availableLanguage": ["Spanish", "English"]
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
