import { CartItem } from "@/store/cartStore";

export const formatPriceConfig = (value: number | string) => {
    const num = Number(value || 0);
    return num.toLocaleString("es-CO", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
};

export const buildSingleProductMessage = (productName: string, price: number | string): string => {
    return `Hola, quiero este producto:

🛍️ *${productName}*
Precio: $${formatPriceConfig(price)}

Mi nombre es: 
Dirección: 
Método de pago: `;
};

export const buildCartMessage = (items: CartItem[]): string => {
    const total = items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
    
    let message = `Hola, quiero hacer este pedido:\n\n🛒 *Pedido:*\n`;
    
    items.forEach(item => {
        message += `• ${item.name} (x${item.quantity}) - $${formatPriceConfig(Number(item.price) * item.quantity)}\n`;
    });
    
    message += `\n*Total: $${formatPriceConfig(total)}*\n\nMi nombre es: \nDirección: \nMétodo de pago: `;
    
    return message;
};

export const getWhatsAppUrl = (phone: string, message: string): string => {
    const cleanPhone = (phone || '').replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};
