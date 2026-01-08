import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "../components/Navbar";
import { Providers } from "./providers";
import WhatsAppButton from "../components/WhatsAppButton";
import { AnalyticsTracker } from "../components/Analytics";
import TranslationPrompt from "../components/TranslationPrompt";
import LayoutWrapper from "@/components/LayoutWrapper";
import OrganizationSchema from "@/components/OrganizationSchema";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    metadataBase: new URL('https://creatiendas.co'),
    title: {
        default: "Creatiendas - Tu Tienda Online por WhatsApp Gratis",
        template: "%s | Creatiendas"
    },
    description: "Crea tu tienda online por WhatsApp en minutos. Sin comisiones, 100% gratis. Diseñado para emprendedores en LATAM.",
    keywords: ["tienda online", "WhatsApp", "gratis", "minutos", "SaaS", "e-commerce WhatsApp"],
    authors: [{ name: "Creatiendas Team" }],
    creator: "Creatiendas",
    publisher: "Creatiendas",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: 'website',
        locale: 'es_LA',
        url: 'https://creatiendas.co',
        siteName: 'Creatiendas',
        title: 'Creatiendas - Tu Tienda Online por WhatsApp Gratis',
        description: 'Vende tus productos directamente por WhatsApp sin pagar comisiones. Setup en solo 2 minutos.',
        images: [
            {
                url: '/og-image.png', // We'll assume this exists or user will add it
                width: 1200,
                height: 630,
                alt: 'Creatiendas - Vende por WhatsApp',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Creatiendas - Tu Tienda Online por WhatsApp Gratis',
        description: 'Vende tus productos directamente por WhatsApp sin pagar comisiones.',
        images: ['/og-image.png'],
    },
    alternates: {
        canonical: 'https://creatiendas.co',
    },
    icons: {
        icon: '/favicon.png',
        apple: '/apple-icon.png',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <head>
                <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#2563eb" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=0.5, maximum-scale=5.0, user-scalable=yes" />
            </head>
            <body className={inter.className}>
                <Providers>
                    <AnalyticsTracker />
                    <LayoutWrapper>
                        <OrganizationSchema />
                        {children}
                    </LayoutWrapper>
                    <WhatsAppButton />
                    <TranslationPrompt />
                </Providers>
            </body>
        </html>
    );
}
