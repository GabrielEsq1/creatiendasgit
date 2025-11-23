'use client';

export default function WhatsAppButton() {
    const handleClick = () => {
        const message = 'Hola, tengo una duda sobre los planes.';
        const whatsappUrl = `https://wa.me/573026687991?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <button
            onClick={handleClick}
            className="whatsapp-float"
            aria-label="Abrir chat de WhatsApp"
            title="Soporte 24/7"
        >
            💬
        </button>
    );
}
