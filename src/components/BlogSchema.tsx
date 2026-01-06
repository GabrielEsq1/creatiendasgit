import React from 'react';

interface BlogSchemaProps {
    post: {
        title: string;
        excerpt: string;
        image: string;
        slug: string;
        publishDate: string;
    }
}

export default function BlogSchema({ post }: BlogSchemaProps) {
    const baseUrl = 'https://creatiendas.co';
    const schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "image": `${baseUrl}${post.image}`,
        "author": {
            "@type": "Organization",
            "name": "Creatiendas Team"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Creatiendas",
            "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}/favicon.png`
            }
        },
        "datePublished": post.publishDate,
        "url": `${baseUrl}/blog/${post.slug}`
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
