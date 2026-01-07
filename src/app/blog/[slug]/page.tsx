import React from 'react';
import { notFound } from 'next/navigation';
import ArticleLayout from '@/components/ArticleLayout';
import BlogSchema from '@/components/BlogSchema';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { blogPosts } from '@/data/blogPosts';
import { Metadata } from 'next';

interface BlogPageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
    const post = blogPosts.find((p) => p.slug === params.slug);
    if (!post) return {};

    const isLandingPage = ['crear-tienda-online-gratis', 'vender-por-whatsapp'].includes(params.slug);
    const canonicalPath = isLandingPage ? `/${params.slug}` : `/blog/${params.slug}`;

    return {
        title: `${post.title} | Blog Creatiendas`,
        description: post.excerpt,
        alternates: {
            canonical: `https://creatiendas.co${canonicalPath}`,
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: [post.image],
            type: 'article',
            publishedTime: post.publishDate,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [post.image],
        },
    };
}

export default function BlogPostPage({ params }: BlogPageProps) {
    const post = blogPosts.find((p) => p.slug === params.slug);

    if (!post) {
        notFound();
    }

    return (
        <>
            <BlogSchema post={post} />
            <BreadcrumbSchema
                items={[
                    { name: 'Inicio', item: '/' },
                    { name: post.title, item: `/blog/${post.slug}` }
                ]}
            />
            <ArticleLayout
                title={post.title}
                heroImage={post.image}
            >
                {post.content}
            </ArticleLayout>
        </>
    );
}

export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}
