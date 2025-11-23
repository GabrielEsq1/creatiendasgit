"use client";

import React from 'react';
import StorePreview from '@/components/StorePreview';
import { StoreData, Product } from '@/lib/store-service';

// Static test data for local testing without affecting production logic
const TEST_DATA: StoreData = {
    title: 'Test Store',
    name: 'Tienda de Prueba',
    desc: 'Descripción de prueba',
    whatsapp: '123456789',
    color: '#00aaff',
    font: 'Inter',
    logo: null,
    heroBg: null,
    slug: 'test-store',
    socials: {
        instagram: 'https://instagram.com/test',
        facebook: 'https://facebook.com/test',
        tiktok: 'https://tiktok.com/@test',
        email: 'test@example.com',
        phone: '555-1234'
    },
    about: {
        heroTitle: 'Bienvenido',
        heroSubtitle: 'Lo mejor en pruebas',
        mission: 'Misión de prueba',
        vision: 'Visión de prueba',
        values: ['Calidad', 'Innovación'],
        timeline: ['2020 - Fundado', '2022 - Crecimiento'],
        diff: ['Diferente 1', 'Diferente 2'],
        team: 'Equipo de prueba',
        ctaText: 'Comprar ahora',
        gallery: []
    },
    careers: {
        title: 'Únete a nuestro equipo',
        desc: 'Descripción de carrera',
        benefits: ['Beneficio 1', 'Beneficio 2'],
        ctaText: 'Contactar'
    }
};

const TEST_PRODUCTS: Product[] = [
    {
        id: 1,
        name: 'Producto A',
        description: 'Descripción del producto A',
        category: 'Categoría A',
        price: '10000',
        image: null
    },
    {
        id: 2,
        name: 'Producto B',
        description: 'Descripción del producto B',
        category: 'Categoría B',
        price: '15000',
        image: null
    }
];

export default function BuilderTestPage() {
    return (
        <div className="app-container">
            <main className="preview-panel">
                <StorePreview data={TEST_DATA} products={TEST_PRODUCTS} viewMode="desktop" />
            </main>
        </div>
    );
}
