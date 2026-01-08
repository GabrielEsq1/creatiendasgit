import React from 'react';

export default function FAQSchema({ lang = 'es' }: { lang?: 'es' | 'en' }) {
    const isEn = lang === 'en';
    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": isEn ? [
            {
                "@type": "Question",
                "name": "Is Creatiendas really free?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, Creatiendas offers a permanent free plan that allows you to create your catalog and receive orders via WhatsApp without paying monthly fees or sales commissions."
                }
            },
            {
                "@type": "Question",
                "name": "How do I receive payments from my customers?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You coordinate the payment directly with the customer. You can use bank transfers, local apps (Nequi, Daviplata), cash on delivery, or any other method you prefer. We do not hold your money."
                }
            },
            {
                "@type": "Question",
                "name": "Do I need technical knowledge to create my store?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Not at all. Creatiendas is designed to be used from your phone. If you know how to send a WhatsApp message, you can create your store on our platform."
                }
            },
            {
                "@type": "Question",
                "name": "Can I use my own domain?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, professional plans allow you to connect your own domain (e.g., www.yourname.com) to give more credibility to your brand."
                }
            }
        ] : [
            {
                "@type": "Question",
                "name": "¿Es realmente gratis Creatiendas?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sí, Creatiendas ofrece un plan gratuito permanente que te permite crear tu catálogo y recibir pedidos por WhatsApp sin pagar mensualidades ni comisiones por venta."
                }
            },
            {
                "@type": "Question",
                "name": "¿Cómo recibo los pagos de mis clientes?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Tú coordinas el pago directamente con el cliente. Puedes usar transferencias bancarias, Nequi, Daviplata, efectivo contra entrega o cualquier otro método que prefieras. No retenemos tu dinero."
                }
            },
            {
                "@type": "Question",
                "name": "¿Necesito conocimientos técnicos para crear mi tienda?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Para nada. Creatiendas está diseñado para ser usado desde el celular. Si sabes enviar un mensaje por WhatsApp, sabes crear tu tienda en nuestra plataforma."
                }
            },
            {
                "@type": "Question",
                "name": "¿Puedo usar mi propio dominio?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sí, los planes profesionales permiten conectar tu propio dominio (ej. www.tunombre.com) para darle más seriedad a tu marca."
                }
            }
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
