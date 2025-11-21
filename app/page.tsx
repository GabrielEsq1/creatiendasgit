"use client";

import React, { useState, ChangeEvent } from 'react';
import StorePreview from '@/components/StorePreview';
import { StoreData, Product } from '@/lib/store-service';
import './styles/builder.css';

const INITIAL_DATA: StoreData = {
    title: 'Especiales del día',
    name: 'Mi Tienda Bonita',
    desc: 'Personaliza esta descripción con lo mejor de tu negocio.',
    whatsapp: '573001234567',
    color: '#25D366',
    logo: null,
    heroBg: null,
    slug: '',
    socials: {
        instagram: 'https://instagram.com/mitiendabonita',
        facebook: '',
        tiktok: '',
        email: 'hola@mitiendabonita.com',
        phone: '+57 300 123 4567'
    },
    about: {
        heroTitle: 'Creamos momentos que se disfrutan en familia',
        heroSubtitle: 'Somos una marca cercana que combina buen servicio, productos de calidad y precios justos.',
        mission: 'Ofrecer productos deliciosos y accesibles que hagan el día de nuestros clientes más fácil y feliz.',
        vision: 'Ser la tienda de referencia de nuestro barrio, reconocida por su servicio cálido y humano.',
        values: [
            'Servicio cercano y respetuoso',
            'Calidad constante en cada producto',
            'Transparencia en precios y procesos'
        ],
        timeline: [
            '2019 — Nace Mi Tienda Bonita',
            '2021 — Lanzamos servicio a domicilio',
            '2023 — Integramos pedidos por WhatsApp'
        ],
        diff: [
            'Preparaciones al momento',
            'Resolvemos pedidos por WhatsApp en minutos',
            'Escuchamos a nuestros clientes para mejorar cada día'
        ],
        team: 'Somos un equipo pequeño pero apasionado por el servicio y el detalle en cada pedido.',
        ctaText: 'Conócenos más',
        gallery: []
    },
    careers: {
        title: 'Únete a nuestro equipo',
        desc: 'Buscamos personas responsables, con buena actitud y ganas de aprender para crecer junto a nosotros.',
        benefits: [
            'Ambiente de trabajo cercano y respetuoso',
            'Descuentos especiales en productos',
            'Oportunidad de crecimiento dentro de la tienda'
        ],
        ctaText: 'Postular por WhatsApp'
    }
};

const INITIAL_PRODUCTS: Product[] = [
    {
        id: 1,
        name: 'Combo Especial',
        description: 'Nuestro combo estrella con bebida y acompañamiento.',
        category: 'Combos',
        price: '10900',
        image: null
    },
    {
        id: 2,
        name: 'Postre de la Casa',
        description: 'Delicioso postre cremoso para cerrar con broche de oro.',
        category: 'Postres',
        price: '8900',
        image: null
    }
];

export default function BuilderPage() {
    const [storeData, setStoreData] = useState<StoreData>(INITIAL_DATA);
    const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [isSaving, setIsSaving] = useState(false);
    const [publicUrl, setPublicUrl] = useState<string | null>(null);

    // Product Form State
    const [prodForm, setProdForm] = useState({
        name: '',
        desc: '',
        category: '',
        price: '',
        image: null as string | null
    });

    // Helpers
    const handleInputChange = (section: keyof StoreData | null, field: string, value: string) => {
        if (section) {
            setStoreData(prev => {
                const sectionKey = section as keyof StoreData;
                const previousSection = (prev[sectionKey] as unknown as Record<string, any>) ?? {};

                return {
                    ...prev,
                    [sectionKey]: {
                        ...previousSection,
                        [field]: value
                    }
                } as StoreData;
            });
        } else {
            setStoreData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleArrayChange = (section: 'about' | 'careers', field: string, value: string) => {
        setStoreData(prev => {
            const sectionKey = section as keyof StoreData;
            const previousSection = (prev[sectionKey] as Record<string, any>) ?? {};

            return {
                ...prev,
                [sectionKey]: {
                    ...previousSection,
                    [field]: value.split('\n')
                }
            } as StoreData;
        });
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const handleImageUpload = async (field: string, e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const base64 = await fileToBase64(file);
            setStoreData(prev => ({ ...prev, [field]: base64 }));
        }
    };

    const handleGalleryUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImages: string[] = [];
            for (let i = 0; i < files.length; i++) {
                const base64 = await fileToBase64(files[i]);
                newImages.push(base64);
            }
            setStoreData(prev => ({
                ...prev,
                about: {
                    ...prev.about,
                    gallery: [...prev.about.gallery, ...newImages]
                }
            }));
        }
    };

    const handleAddProduct = () => {
        if (!prodForm.name || !prodForm.price) return alert('Nombre y precio requeridos');

        const newProduct: Product = {
            id: Date.now(),
            name: prodForm.name,
            description: prodForm.desc,
            category: prodForm.category,
            price: prodForm.price,
            image: prodForm.image
        };

        setProducts([...products, newProduct]);
        setProdForm({ name: '', desc: '', category: '', price: '', image: null });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/stores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: storeData.name,
                    data: storeData,
                    products
                })
            });
            const json = await res.json();
            if (json.success) {
                alert(`Tienda creada! Ver en: ${json.publicUrl}`);
                setPublicUrl(json.publicUrl);
                // window.open(json.publicUrl, '_blank'); // Optional: auto-open
            } else {
                alert('Error: ' + json.message);
            }
        } catch (e) {
            alert('Error al guardar');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="app-container">
            {/* LEFT PANEL */}
            <aside className="builder-panel">
                <div className="panel-header">
                    <h2>🛠️ Constructor de Tienda</h2>
                    <p>Configura tu tienda, añade productos y ve los cambios en tiempo real.</p>
                </div>

                {/* 1. Identidad */}
                <section className="form-section">
                    <h3>1. Identidad de la Tienda</h3>
                    <div className="form-group">
                        <label>Título principal</label>
                        <input
                            value={storeData.title}
                            onChange={(e) => handleInputChange(null, 'title', e.target.value)}
                            placeholder="Ej: Especiales del día"
                        />
                    </div>
                    <div className="form-group">
                        <label>Nombre de la Tienda *</label>
                        <input
                            value={storeData.name}
                            onChange={(e) => handleInputChange(null, 'name', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Descripción corta</label>
                        <textarea
                            value={storeData.desc}
                            onChange={(e) => handleInputChange(null, 'desc', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Número de WhatsApp *</label>
                        <input
                            value={storeData.whatsapp}
                            onChange={(e) => handleInputChange(null, 'whatsapp', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Color Principal</label>
                        <div className="color-picker-wrapper">
                            <input
                                type="color"
                                value={storeData.color}
                                onChange={(e) => handleInputChange(null, 'color', e.target.value)}
                            />
                            <span>{storeData.color}</span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Logo</label>
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload('logo', e)} />
                    </div>
                    <div className="form-group">
                        <label>Imagen de fondo del encabezado (opcional)</label>
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload('heroBg', e)} />
                    </div>
                </section>

                {/* 2. Redes */}
                <section className="form-section">
                    <h3>2. Redes Sociales & Contacto</h3>
                    <div className="form-group">
                        <label>Instagram</label>
                        <input
                            value={storeData.socials.instagram}
                            onChange={(e) => handleInputChange('socials', 'instagram', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Facebook</label>
                        <input
                            value={storeData.socials.facebook}
                            onChange={(e) => handleInputChange('socials', 'facebook', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>TikTok</label>
                        <input
                            value={storeData.socials.tiktok}
                            onChange={(e) => handleInputChange('socials', 'tiktok', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            value={storeData.socials.email}
                            onChange={(e) => handleInputChange('socials', 'email', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Teléfono</label>
                        <input
                            value={storeData.socials.phone}
                            onChange={(e) => handleInputChange('socials', 'phone', e.target.value)}
                        />
                    </div>
                </section>

                {/* 3. Sobre Nosotros */}
                <section className="form-section">
                    <h3>3. Sobre Nosotros (Micrositio)</h3>
                    <div className="form-group">
                        <label>Encabezado Hero – título</label>
                        <input
                            value={storeData.about.heroTitle}
                            onChange={(e) => handleInputChange('about', 'heroTitle', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Encabezado Hero – frase corta</label>
                        <textarea
                            value={storeData.about.heroSubtitle}
                            onChange={(e) => handleInputChange('about', 'heroSubtitle', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Nuestro Propósito / Misión</label>
                        <textarea
                            value={storeData.about.mission}
                            onChange={(e) => handleInputChange('about', 'mission', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Visión</label>
                        <textarea
                            value={storeData.about.vision}
                            onChange={(e) => handleInputChange('about', 'vision', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Valores (uno por línea)</label>
                        <textarea
                            value={storeData.about.values.join('\n')}
                            onChange={(e) => handleArrayChange('about', 'values', e.target.value)}
                            rows={3}
                        />
                    </div>
                    <div className="form-group">
                        <label>Historia / Timeline (un hito por línea)</label>
                        <textarea
                            value={storeData.about.timeline.join('\n')}
                            onChange={(e) => handleArrayChange('about', 'timeline', e.target.value)}
                            rows={3}
                        />
                    </div>
                    <div className="form-group">
                        <label>Qué nos diferencia (uno por línea)</label>
                        <textarea
                            value={storeData.about.diff.join('\n')}
                            onChange={(e) => handleArrayChange('about', 'diff', e.target.value)}
                            rows={3}
                        />
                    </div>
                    <div className="form-group">
                        <label>Equipo o cultura</label>
                        <textarea
                            value={storeData.about.team}
                            onChange={(e) => handleInputChange('about', 'team', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Call to Action (texto del botón)</label>
                        <input
                            value={storeData.about.ctaText}
                            onChange={(e) => handleInputChange('about', 'ctaText', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Galería de imágenes de la empresa</label>
                        <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} />
                        <div className="about-gallery-mini">
                            {storeData.about.gallery.map((img, i) => (
                                <img key={i} src={img} alt="Gallery" />
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. Trabaja con Nosotros */}
                <section className="form-section">
                    <h3>4. Trabaja con Nosotros</h3>
                    <div className="form-group">
                        <label>Título "Trabaja con nosotros"</label>
                        <input
                            value={storeData.careers.title}
                            onChange={(e) => handleInputChange('careers', 'title', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Descripción / Invitación</label>
                        <textarea
                            value={storeData.careers.desc}
                            onChange={(e) => handleInputChange('careers', 'desc', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Beneficios (uno por línea)</label>
                        <textarea
                            value={storeData.careers.benefits.join('\n')}
                            onChange={(e) => handleArrayChange('careers', 'benefits', e.target.value)}
                            rows={3}
                        />
                    </div>
                    <div className="form-group">
                        <label>Texto del botón (WhatsApp)</label>
                        <input
                            value={storeData.careers.ctaText}
                            onChange={(e) => handleInputChange('careers', 'ctaText', e.target.value)}
                        />
                    </div>
                </section>

                {/* 5. Productos */}
                <section className="form-section">
                    <h3>5. Agregar / Editar Productos</h3>
                    <div className="form-group">
                        <label>Nombre del Producto *</label>
                        <input
                            value={prodForm.name}
                            onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Descripción *</label>
                        <textarea
                            value={prodForm.desc}
                            onChange={(e) => setProdForm({ ...prodForm, desc: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Categoría *</label>
                        <input
                            value={prodForm.category}
                            onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Precio *</label>
                        <input
                            type="number"
                            value={prodForm.price}
                            onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Imagen del Producto</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const base64 = await fileToBase64(file);
                                    setProdForm({ ...prodForm, image: base64 });
                                }
                            }}
                        />
                    </div>
                    <button className="btn btn-secondary" onClick={handleAddProduct}>➕ Agregar Producto</button>

                    <div className="product-list-mini">
                        {products.map(p => (
                            <div key={p.id} className="product-item-mini">
                                <div className="product-info-mini">
                                    {p.image ? (
                                        <img src={p.image} className="product-thumb" alt={p.name} />
                                    ) : (
                                        <div className="product-thumb" style={{ background: '#ccc' }}></div>
                                    )}
                                    <div>
                                        <strong>{p.name}</strong><br />
                                        <small>{p.category} · ${p.price}</small>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.35rem' }}>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => setProducts(products.filter(x => x.id !== p.id))}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="form-section" style={{ position: 'sticky', bottom: 0, zIndex: 10 }}>
                    <button className="btn btn-primary" onClick={handleSave} disabled={isSaving} style={{ marginBottom: '1rem' }}>
                        {isSaving ? 'Guardando...' : '🔄 Validar / Actualizar Tienda'}
                    </button>

                    {publicUrl && (
                        <div className="public-url-box" style={{ marginTop: '1rem', padding: '1rem', background: '#e8f5e9', borderRadius: '8px', border: '1px solid #c8e6c9' }}>
                            <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#2e7d32' }}>✅ ¡Tu tienda está lista!</p>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    readOnly
                                    value={publicUrl}
                                    style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        navigator.clipboard.writeText(publicUrl);
                                        alert('URL copiada!');
                                    }}
                                    style={{ padding: '0.5rem 1rem' }}
                                >
                                    Copiar
                                </button>
                            </div>
                            <a href={publicUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: '0.5rem', color: '#2e7d32', textDecoration: 'underline' }}>
                                Visitar tienda &rarr;
                            </a>
                        </div>
                    )}
                </section>
            </aside>

            {/* RIGHT PANEL */}
            <main className="preview-panel">
                <div className="device-toggle">
                    <button
                        className={`device-btn ${viewMode === 'desktop' ? 'active' : ''}`}
                        onClick={() => setViewMode('desktop')}
                    >
                        🖥 Vista escritorio
                    </button>
                    <button
                        className={`device-btn ${viewMode === 'mobile' ? 'active' : ''}`}
                        onClick={() => setViewMode('mobile')}
                    >
                        📱 Vista móvil
                    </button>
                </div>
                <StorePreview
                    data={storeData}
                    products={products}
                    viewMode={viewMode}
                />
            </main>
        </div>
    );
}
