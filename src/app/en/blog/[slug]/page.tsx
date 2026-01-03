import React from 'react';
import { notFound } from 'next/navigation';
import ArticleLayoutEN from '@/components/en/ArticleLayoutEN';
import BlogSchema from '@/components/BlogSchema';
import { blogPostsEN } from '@/data/blogPostsEN';
import { Metadata } from 'next';

interface BlogPageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
    const post = blogPostsEN.find((p) => p.slug === params.slug);
    if (!post) return {};

    return {
        title: `${post.title} | Creatiendas Blog`,
        description: post.excerpt,
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

export default function BlogPostPageEN({ params }: BlogPageProps) {
    const post = blogPostsEN.find((p) => p.slug === params.slug);

    if (!post) {
        notFound();
    }

    return (
        <>
            <BlogSchema post={post as any} />
            <ArticleLayoutEN
                title={post.title}
                heroImage={post.image}
            >
                {post.content}
            </ArticleLayoutEN>
        </>
    );
}

export async function generateStaticParams() {
    return blogPostsEN.map((post) => ({
        slug: post.slug,
    }));
}
