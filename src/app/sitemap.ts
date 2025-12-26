import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://creatiendasgit1.vercel.app'

    const posts = [
        'crear-tienda-online-gratis',
        'vender-por-whatsapp',
        'shopify-vs-creatiendas',
        'pasarelas-pago-vs-whatsapp',
        'whatsapp-commerce-2025',
        'errores-vender-por-whatsapp'
    ];

    const blogEntries = posts.map(slug => ({
        url: `${baseUrl}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: `${baseUrl}/auth/login`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/auth/register`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        ...blogEntries,
    ];
}
