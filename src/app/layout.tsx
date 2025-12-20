import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { Providers } from "./providers";
import WhatsAppButton from "../components/WhatsAppButton";
import { AnalyticsTracker } from "../components/Analytics";
import GA4Professional from "../components/GA4Professional";
import TranslationPrompt from "../components/TranslationPrompt";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Creatiendas - Constructor de Tienda WhatsApp",
    description: "Crea tu tienda online en minutos",
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
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
            </head>
            <body className={inter.className}>
                <Providers>
                    <GA4Professional />
                    <AnalyticsTracker />
                    <Navbar />
                    <main className="pt-16">
                        {children}
                    </main>
                    <WhatsAppButton />
                    <TranslationPrompt />
                    {/* B2Chat Widget - Adjust path if necessary based on B2Chat-main contents */}
                    <script src="/b2chat/B2Chat-main/widget.js" async></script>
                </Providers>
            </body>
        </html>
    );
}
