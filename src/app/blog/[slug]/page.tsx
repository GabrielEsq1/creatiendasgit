import React from 'react';
import { notFound } from 'next/navigation';
import ArticleLayout from '@/components/ArticleLayout';
import BlogSchema from '@/components/BlogSchema';
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

    return {
        title: `${post.title} | Blog Creatiendas`,
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

export default function BlogPostPage({ params }: BlogPageProps) {
    const post = blogPosts.find((p) => p.slug === params.slug);

    if (!post) {
        notFound();
    }

    return (
        <>
            <BlogSchema post={post} />
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
