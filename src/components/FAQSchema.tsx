import React from 'react';

export default function FAQSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
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
