import { CartItem } from "@/store/cartStore";

const COP_USD_RATE = 4000;

export const formatPriceConfig = (value: number | string, lang: 'es' | 'en' = 'es') => {
    const num = Number(value || 0);

    if (lang === 'en') {
        const usdValue = num / COP_USD_RATE;
        return usdValue.toLocaleString("en-US", {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
    }

    return num.toLocaleString("es-CO", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
};

export const buildSingleProductMessage = (productName: string, price: number | string, lang: 'es' | 'en' = 'es'): string => {
    if (lang === 'en') {
        return `Hello, I want to order this product:

🛍️ *${productName}*
Price: ${formatPriceConfig(price, 'en')}

Size / Color (if applicable): 

My name is: 
Address: 
Payment method: `;
    }

    return `Hola, quiero este producto:

🛍️ *${productName}*
Precio: $${formatPriceConfig(price, 'es')}

Talla / Color (si aplica): 

Mi nombre es: 
Dirección: 
Método de pago: `;
};

export const buildCartMessage = (items: CartItem[], lang: 'es' | 'en' = 'es'): string => {
    const total = items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
    
    let message = lang === 'en' 
        ? `Hello, I want to place this order:\n\n🛒 *Order:*\n` 
        : `Hola, quiero hacer este pedido:\n\n🛒 *Pedido:*\n`;
    
    items.forEach(item => {
        const itemPrice = Number(item.price) * item.quantity;
        const prefix = lang === 'en' ? '' : '$';
        message += `• ${item.name} (x${item.quantity}) - ${prefix}${formatPriceConfig(itemPrice, lang)}\n`;
    });
    
    if (lang === 'en') {
        message += `\nSize / Color (if applicable): \n`;
        message += `\n*Total: ${formatPriceConfig(total, 'en')}*\n\nMy name is: \nAddress: \nPayment method: `;
    } else {
        message += `\nTalla / Color (si aplica): \n`;
        message += `\n*Total: $${formatPriceConfig(total, 'es')}*\n\nMi nombre es: \nDirección: \nMétodo de pago: `;
    }
    
    return message;
};

export const getWhatsAppUrl = (phone: string, message: string): string => {
    const cleanPhone = (phone || '').replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};
