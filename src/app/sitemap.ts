import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://creatiendas.co'

    // High-priority landing pages (top-level)
    const landingPages = [
        { url: 'crear-tienda-online-gratis', priority: 0.9 },
        { url: 'vender-por-whatsapp', priority: 0.9 },
    ];

    // Blog specific posts
    const blogPosts = [
        'shopify-vs-creatiendas',
        'pasarelas-pago-vs-whatsapp',
        'whatsapp-commerce-2025',
        'errores-vender-por-whatsapp',
        'como-crear-tienda-online-2026',
        'tendencias-ecommerce-2026',
        'seo-tiendas-online-2026'
    ];

    const landingEntries = landingPages.map(page => ({
        url: `${baseUrl}/${page.url}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: page.priority,
    }));

    const blogEntries = blogPosts.map(slug => ({
        url: `${baseUrl}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/auth/login`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/auth/register`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        ...landingEntries,
        ...blogEntries,
    ];
}
