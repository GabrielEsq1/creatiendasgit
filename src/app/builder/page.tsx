"use client";

import React, { useState, ChangeEvent, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import StorePreview from '@/components/StorePreview';
import { StoreData, Product } from '@/lib/store-service';
import { compressImage } from '@/lib/image-utils';
import ImageUploader from '@/components/ImageUploader';
import '../styles/builder.css';

export const dynamic = "force-dynamic";

// Initial store data structure
const INITIAL_DATA: StoreData = {
    title: 'Especiales del día',
    name: 'Mi Tienda Bonita',
    desc: 'Descripción corta de la tienda',
    whatsapp: '',
    color: '#ff0000',
    font: 'Inter',
    borderRadius: '16px',
    logo: null,
    heroBg: null,
    slug: '',
    socials: {
        instagram: '',
        facebook: '',
        tiktok: '',
        email: '',
        phone: ''
    },
    about: {
        heroTitle: '',
        heroSubtitle: '',
        mission: '',
        vision: '',
        values: [],
        timeline: [],
        diff: [],
        team: '',
        ctaText: '',
        gallery: []
    },
    careers: {
        title: '',
        desc: '',
        benefits: [],
        ctaText: ''
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

/**
 * Core builder UI without Suspense. This component contains all state handling and UI.
 */
function BuilderContent() {
    const searchParams = useSearchParams();
    const editSlug = searchParams.get('edit');

    const [storeData, setStoreData] = useState<StoreData>(INITIAL_DATA);
    const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [publicUrl, setPublicUrl] = useState<string | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [editingProductId, setEditingProductId] = useState<number | null>(null);

    // Load existing store data when editing
    useEffect(() => {
        if (editSlug) {
            setIsLoading(true);
            fetch(`/api/stores/${editSlug}`)
                .then(res => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        throw new Error('Failed to load store');
                    }
                })
                .then(data => {
                    if (data && data.store) {
                        // Deep merge to ensure all sections exist even if DB data is partial
                        const loadedData = data.store.data || {};
                        setStoreData({
                            ...INITIAL_DATA,
                            ...loadedData,
                            id: data.store.id,
                            slug: data.store.slug, // CRITICAL: Store slug for "Compartir / QR" button
                            socials: { ...INITIAL_DATA.socials, ...(loadedData.socials || {}) },
                            about: { ...INITIAL_DATA.about, ...(loadedData.about || {}) },
                            careers: { ...INITIAL_DATA.careers, ...(loadedData.careers || {}) }
                        });
                        if (data.store.products) setProducts(data.store.products);
                    } else if (data && data.data) {
                        // Fallback for legacy API
                        const loadedData = data.data || {};
                        setStoreData({
                            ...INITIAL_DATA,
                            ...loadedData,
                            id: data.id,
                            slug: data.slug || editSlug, // Store slug for "Compartir / QR" button
                            socials: { ...INITIAL_DATA.socials, ...(loadedData.socials || {}) },
                            about: { ...INITIAL_DATA.about, ...(loadedData.about || {}) },
                            careers: { ...INITIAL_DATA.careers, ...(loadedData.careers || {}) }
                        });
                        if (data.products) setProducts(data.products);
                    } else {
                        alert('No se pudo cargar la tienda para editar');
                    }
                })
                .catch(err => {
                    console.error('Error loading store:', err);
                    alert('Error al cargar la tienda');
                })
                .finally(() => setIsLoading(false));
        }
    }, [editSlug]);

    // Warn user about unsaved changes when leaving page
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);

    // Mark as having unsaved changes when data changes
    useEffect(() => {
        if (!isLoading && !isSaving) {
            // Add small delay to avoid marking as unsaved immediately after load
            const timer = setTimeout(() => {
                setHasUnsavedChanges(true);
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [storeData, products, isLoading, isSaving]);

    // Product form state
    const [prodForm, setProdForm] = useState({ name: '', desc: '', category: '', price: '', image: null as string | null });

    const normalizeUrl = (url: string) => url.replace('https://https://', 'https://');

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
            setStoreData(prev => ({ ...prev, [field]: value }));
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
                    [field]: value.split('\\n')
                }
            } as StoreData;
        });
    };

    // fileToBase64 removed in favor of compressImage utility


    const handleImageUpload = async (field: string, e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const base64 = await compressImage(file, 600, 0.6);
                setStoreData(prev => ({ ...prev, [field]: base64 }));
            } catch (err) {
                console.error('Error compressing image:', err);
                alert('Error al procesar la imagen. Intenta con una más pequeña.');
            }
        }
    };

    const handleGalleryUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImages: string[] = [];
            for (let i = 0; i < files.length; i++) {
                try {
                    const base64 = await compressImage(files[i], 600, 0.6);
                    newImages.push(base64);
                } catch (err) {
                    console.error('Error compressing gallery image:', err);
                }
            }
            setStoreData(prev => ({
                ...prev,
                about: { ...prev.about, gallery: [...prev.about.gallery, ...newImages] }
            }));
        }
    };

    const handleSaveProduct = () => {
        if (!prodForm.name || !prodForm.price) return alert('Nombre y precio requeridos');

        if (editingProductId) {
            // Modo edición
            setProducts(products.map(p =>
                p.id === editingProductId
                    ? { ...p, name: prodForm.name, description: prodForm.desc, category: prodForm.category, price: prodForm.price, image: prodForm.image }
                    : p
            ));
            setEditingProductId(null);
        } else {
            // Modo creación
            const newProduct: Product = {
                id: Date.now(),
                name: prodForm.name,
                description: prodForm.desc,
                category: prodForm.category,
                price: prodForm.price,
                image: prodForm.image
            };
            setProducts([...products, newProduct]);
        }

        setProdForm({ name: '', desc: '', category: '', price: '', image: null });
    };

    const handleEditProduct = (product: Product) => {
        setProdForm({
            name: product.name,
            desc: product.description,
            category: product.category,
            price: product.price,
            image: product.image
        });
        setEditingProductId(product.id);
    };

    const handleCancelEdit = () => {
        setProdForm({ name: '', desc: '', category: '', price: '', image: null });
        setEditingProductId(null);
    };

    const handleSave = async () => {
        if (isSaving) return;
        setIsSaving(true);
        setPublicUrl(null);
        try {
            // Determine if this is an update (existing store) or create (new store)
            const isUpdate = !!editSlug || !!storeData.id;

            // Only generate new slug for NEW stores, not for updates
            let slug: string;
            if (isUpdate) {
                // Use existing slug for updates
                slug = editSlug || storeData.slug || '';
            } else {
                // Generate new slug only for new stores
                slug = storeData.name.toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')
                    .replace(/-+/g, '-') + '-' + Date.now().toString(36);
            }

            // Use PUT for updates, POST for new stores
            const endpoint = isUpdate ? `/api/stores/${editSlug || storeData.id}` : '/api/stores';
            const method = isUpdate ? 'PUT' : 'POST';

            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: storeData.name, slug, data: storeData, products, id: storeData.id })
            });

            if (!res.ok) {
                if (res.status === 413) {
                    throw new Error('La tienda contiene demasiados datos o imágenes muy pesadas. Por favor, intenta reducir el tamaño de las imágenes o eliminar algunas.');
                }

                const contentType = res.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const json = await res.json();
                    if (res.status === 401) {
                        alert('Debes iniciar sesión para guardar tu tienda.');
                        window.location.href = '/auth/login';
                        return;
                    }
                    if (res.status === 403 && json.upgradeUrl) {
                        // This case should not be hit for edits anymore, but keeping for safety
                        alert(`${json.message}\n\nSerás redirigido a WhatsApp para recibir asesoría personalizada.`);
                        window.location.href = json.upgradeUrl;
                        return;
                    }
                    throw new Error(json.message || 'Error desconocido en el servidor');
                } else {
                    throw new Error(`Error del servidor: ${res.status} ${res.statusText}. Es posible que el contenido sea demasiado grande.`);
                }
            }

            const json = await res.json();
            if (json.success) {
                const rawUrl = json.url || json.publicUrl;
                const finalUrl = normalizeUrl(rawUrl);
                setPublicUrl(finalUrl);
                setHasUnsavedChanges(false); // Mark as saved
                // Store the returned id for future updates
                // Store the returned id for future updates
                if (json.id) {
                    setStoreData(prev => ({ ...prev, id: json.id }));
                }

                if (!editSlug) {
                    // NEW STORE: Redirect to Success Page immediately
                    setHasUnsavedChanges(false); // Ensure no popup on redirect
                    alert('¡Tienda creada con éxito! Vamos a compartirla.');
                    // Use local slug if server doesn't return it to ensure we never get "undefined"
                    let finalSlug = json.slug || slug || storeData.slug;

                    // CRITICAL SAFETY CHECK
                    if (!finalSlug || finalSlug === 'undefined' || finalSlug === 'null') {
                        console.error('CRITICAL: Slug missing in redirect', { jsonSlug: json.slug, localSlug: slug, stateSlug: storeData.slug });
                        // Emergency fallback: use name
                        if (storeData.name) {
                            finalSlug = storeData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                        } else {
                            alert('Error crítico: No se pudo generar el enlace de la tienda. Por favor contacta a soporte.');
                            return;
                        }
                    }

                    console.log('Redirecting to success with slug:', finalSlug);
                    window.location.href = `/builder/success?slug=${finalSlug}&storeName=${encodeURIComponent(storeData.name)}`;
                } else {
                    // EDITING: Stay on page but notify
                    alert(`¡Cambios guardados con éxito!\n\nTu tienda está actualizada.`);
                }
            } else {
                throw new Error(json.message || 'Error inesperado');
            }
        } catch (e: any) {
            console.error('Save error:', e);
            alert(`No se pudo guardar la tienda.\n${e.message || 'Error de conexión. Intenta reducir el tamaño de las imágenes.'}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="app-container">
            {/* LEFT PANEL */}
            <aside className="builder-panel">
                <div className="panel-header">
                    <Link href="/dashboard" style={{ marginBottom: '0.5rem', display: 'inline-block', color: '#2196F3', textDecoration: 'none', fontSize: '0.9rem' }}>← Volver al Panel</Link>
                    <h2>{editSlug ? '✏️ Editar Tienda' : '🛠️ Constructor de Tienda'}</h2>
                    <p>{editSlug ? 'Modifica tu tienda y guarda los cambios.' : 'Configura tu tienda, añade productos y ve los cambios en tiempo real.'}</p>
                    {isLoading && <p style={{ color: '#2196F3', fontWeight: 'bold' }}>🔄 Cargando datos de la tienda...</p>}
                </div>

                {/* 1. Identidad */}
                <section className="form-section">
                    <h3>1. Identidad de la Tienda</h3>
                    <div className="form-group">
                        <label>Título principal</label>
                        <input value={storeData.title} onChange={e => handleInputChange(null, 'title', e.target.value)} placeholder="Ej: Especiales del día" />
                    </div>
                    <div className="form-group">
                        <label>Nombre de la Tienda *</label>
                        <input value={storeData.name} onChange={e => handleInputChange(null, 'name', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Descripción corta</label>
                        <textarea value={storeData.desc} onChange={e => handleInputChange(null, 'desc', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Número de WhatsApp *</label>
                        <input value={storeData.whatsapp} onChange={e => handleInputChange(null, 'whatsapp', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Color Principal</label>
                        <div className="color-picker-wrapper">
                            <input type="color" value={storeData.color} onChange={e => handleInputChange(null, 'color', e.target.value)} />
                            <span>{storeData.color}</span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Tipografía</label>
                        <select value={storeData.font || 'Inter'} onChange={e => handleInputChange(null, 'font', e.target.value)} className="w-full p-2 border rounded">
                            <option value="Inter">Inter (Estándar)</option>
                            <option value="Roboto">Roboto (Clásica)</option>
                            <option value="Open Sans">Open Sans (Legible)</option>
                            <option value="Lato">Lato (Elegante)</option>
                            <option value="Montserrat">Montserrat (Geométrica)</option>
                            <option value="Poppins">Poppins (Moderna)</option>
                            <option value="Playfair Display">Playfair Display (Lujo/Serif)</option>
                            <option value="Merriweather">Merriweather (Editorial)</option>
                            <option value="Raleway">Raleway (Sofisticada)</option>
                            <option value="Oswald">Oswald (Urbano/Título)</option>
                            <option value="Nunito">Nunito (Amigable)</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Estilo de Bordes</label>
                        <select value={storeData.borderRadius || '16px'} onChange={e => handleInputChange(null, 'borderRadius', e.target.value)} className="w-full p-2 border rounded">
                            <option value="0px">Cuadrado (0px)</option>
                            <option value="4px">Sutil (4px)</option>
                            <option value="8px">Estándar (8px)</option>
                            <option value="16px">Moderno (16px)</option>
                            <option value="24px">Muy Redondeado (24px)</option>
                            <option value="30px">Curvo (30px)</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <ImageUploader label="Logo" onImageSelected={e => handleImageUpload('logo', e)} currentImage={storeData.logo} showPreview={true} />
                    </div>
                    <div className="form-group">
                        <ImageUploader label="Imagen de fondo del encabezado (opcional)" onImageSelected={e => handleImageUpload('heroBg', e)} currentImage={storeData.heroBg} showPreview={true} />
                    </div>
                </section>

                {/* 2. Redes */}
                <section className="form-section">
                    <h3>2. Redes Sociales &amp; Contacto</h3>
                    <div className="form-group"><label>Instagram</label><input value={storeData.socials.instagram} onChange={e => handleInputChange('socials', 'instagram', e.target.value)} /></div>
                    <div className="form-group"><label>Facebook</label><input value={storeData.socials.facebook} onChange={e => handleInputChange('socials', 'facebook', e.target.value)} /></div>
                    <div className="form-group"><label>TikTok</label><input value={storeData.socials.tiktok} onChange={e => handleInputChange('socials', 'tiktok', e.target.value)} /></div>
                    <div className="form-group"><label>Email</label><input value={storeData.socials.email} onChange={e => handleInputChange('socials', 'email', e.target.value)} /></div>
                    <div className="form-group"><label>Teléfono</label><input value={storeData.socials.phone} onChange={e => handleInputChange('socials', 'phone', e.target.value)} /></div>
                </section>

                {/* 3. Sobre Nosotros */}
                <section className="form-section">
                    <h3>3. Sobre Nosotros (Micrositio)</h3>
                    <div className="form-group"><label>Encabezado Hero – título</label><input value={storeData.about.heroTitle} onChange={e => handleInputChange('about', 'heroTitle', e.target.value)} /></div>
                    <div className="form-group"><label>Encabezado Hero – frase corta</label><textarea value={storeData.about.heroSubtitle} onChange={e => handleInputChange('about', 'heroSubtitle', e.target.value)} /></div>
                    <div className="form-group"><label>Nuestro Propósito / Misión</label><textarea value={storeData.about.mission} onChange={e => handleInputChange('about', 'mission', e.target.value)} /></div>
                    <div className="form-group"><label>Visión</label><textarea value={storeData.about.vision} onChange={e => handleInputChange('about', 'vision', e.target.value)} /></div>
                    <div className="form-group"><label>Valores (uno por línea)</label><textarea value={storeData.about.values.join('\\n')} onChange={e => handleArrayChange('about', 'values', e.target.value)} rows={3} /></div>
                    <div className="form-group"><label>Historia / Timeline (un hito por línea)</label><textarea value={storeData.about.timeline.join('\\n')} onChange={e => handleArrayChange('about', 'timeline', e.target.value)} rows={3} /></div>
                    <div className="form-group"><label>Qué nos diferencia (uno por línea)</label><textarea value={storeData.about.diff.join('\\n')} onChange={e => handleArrayChange('about', 'diff', e.target.value)} rows={3} /></div>
                    <div className="form-group"><label>Equipo o cultura</label><textarea value={storeData.about.team} onChange={e => handleInputChange('about', 'team', e.target.value)} /></div>
                    <div className="form-group"><label>Call to Action (texto del botón)</label><input value={storeData.about.ctaText} onChange={e => handleInputChange('about', 'ctaText', e.target.value)} /></div>
                    <div className="form-group"><label>Galería de imágenes de la empresa</label><input type="file" accept="image/*" multiple onChange={handleGalleryUpload} />
                        <div className="about-gallery-mini">{storeData.about.gallery.map((img, i) => (<img key={i} src={img} alt="Gallery" />))}</div>
                    </div>
                </section>

                {/* 4. Trabaja con Nosotros */}
                <section className="form-section">
                    <h3>4. Trabaja con Nosotros</h3>
                    <div className="form-group"><label>Título "Trabaja con nosotros"</label><input value={storeData.careers.title} onChange={e => handleInputChange('careers', 'title', e.target.value)} /></div>
                    <div className="form-group"><label>Descripción / Invitación</label><textarea value={storeData.careers.desc} onChange={e => handleInputChange('careers', 'desc', e.target.value)} /></div>
                    <div className="form-group"><label>Beneficios (uno por línea)</label><textarea value={storeData.careers.benefits.join('\\n')} onChange={e => handleArrayChange('careers', 'benefits', e.target.value)} rows={3} /></div>
                    <div className="form-group"><label>Texto del botón (WhatsApp)</label><input value={storeData.careers.ctaText} onChange={e => handleInputChange('careers', 'ctaText', e.target.value)} /></div>
                </section>

                {/* 5. Productos */}
                <section className="form-section">
                    <h3>5. Agregar / Editar Productos</h3>
                    <div className="form-group"><label>Nombre del Producto *</label><input value={prodForm.name} onChange={e => setProdForm({ ...prodForm, name: e.target.value })} /></div>
                    <div className="form-group"><label>Descripción *</label><textarea value={prodForm.desc} onChange={e => setProdForm({ ...prodForm, desc: e.target.value })} /></div>
                    <div className="form-group"><label>Categoría *</label><input value={prodForm.category} onChange={e => setProdForm({ ...prodForm, category: e.target.value })} /></div>
                    <div className="form-group"><label>Precio *</label><input type="number" value={prodForm.price} onChange={e => setProdForm({ ...prodForm, price: e.target.value })} /></div>
                    <div className="form-group">
                        <ImageUploader
                            label="Imagen del Producto"
                            currentImage={prodForm.image}
                            showPreview={true}
                            onImageSelected={async e => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    try {
                                        const base64 = await compressImage(file, 600, 0.6);
                                        setProdForm(prev => ({ ...prev, image: base64 }));
                                    } catch (err) {
                                        console.error('Error compressing product image:', err);
                                        alert('Error al procesar la imagen');
                                    }
                                }
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-secondary" onClick={handleSaveProduct}>
                            {editingProductId ? '💾 Actualizar Producto' : '➕ Agregar Producto'}
                        </button>
                        {editingProductId && (
                            <button className="btn btn-danger" onClick={handleCancelEdit}>❌ Cancelar</button>
                        )}
                    </div>
                    <div className="product-list-mini">
                        {/* Products list */}
                        {products.map(p => (
                            <div key={p.id} className="product-item-mini">
                                <div className="product-info-mini">
                                    {p.image ? (<img src={p.image} className="product-thumb" alt={p.name} />) : (<div className="product-thumb" style={{ background: '#ccc' }} />)}
                                    <div>
                                        <strong>{p.name}</strong><br />
                                        <small>{p.category} ┬À ${p.price}</small>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.35rem' }}>
                                    <button className="btn btn-secondary" onClick={() => handleEditProduct(p)} title="Editar producto">✏️</button>
                                    <button className="btn btn-danger" onClick={() => setProducts(products.filter(x => x.id !== p.id))} title="Eliminar producto">🗑️</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="form-section" style={{ position: 'sticky', bottom: 0, zIndex: 10 }}>
                    <button className="btn btn-primary" onClick={handleSave} disabled={isSaving || isLoading} style={{ marginBottom: '1rem' }}>
                        {isSaving ? 'Guardando...' : (editSlug ? '💾 Actualizar Tienda' : '🚀 Validar / Crear Tienda')}
                    </button>
                    {editSlug && publicUrl && (
                        <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ display: 'block', textAlign: 'center', marginBottom: '1rem', textDecoration: 'none' }}>
                            👁️ Ver Tienda
                        </a>
                    )}

                    {/* ALWAYS show Compartir/QR button in edit mode, even without publicUrl */}
                    {editSlug && (
                        <Link
                            href={`/builder/success?slug=${editSlug}&storeName=${encodeURIComponent(storeData.name)}`}
                            className="btn btn-primary"
                            style={{ display: 'block', textAlign: 'center', marginBottom: '1rem', textDecoration: 'none', background: '#25D366', borderColor: '#25D366' }}
                        >
                            📤 Compartir / QR
                        </Link>
                    )}

                    {publicUrl && (
                        <div className="public-url-box" style={{ marginTop: '1rem', padding: '1rem', background: '#e8f5e9', borderRadius: '8px', border: '1px solid #c8e6c9' }}>
                            <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#2e7d32' }}>✅ ¡Tu tienda está {editSlug ? 'actualizada' : 'lista'}!</p>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <input readOnly value={publicUrl} style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', minWidth: '150px' }} />
                                <button className="btn btn-secondary" onClick={() => { navigator.clipboard.writeText(publicUrl); alert('URL copiada!'); }} style={{ padding: '0.5rem 1rem' }}>Copiar</button>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <a href={publicUrl} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textAlign: 'center', color: '#2e7d32', textDecoration: 'underline', padding: '0.5rem', border: '1px solid #c8e6c9', borderRadius: '4px' }}>Visitar tienda →</a>
                            </div>
                        </div>
                    )}
                </section>
            </aside>

            {/* RIGHT PANEL */}
            <main className="preview-panel">
                <div className="device-toggle">
                    <button className={`device-btn ${viewMode === 'desktop' ? 'active' : ''}`} onClick={() => setViewMode('desktop')}>💻 Vista escritorio</button>
                    <button className={`device-btn ${viewMode === 'mobile' ? 'active' : ''}`} onClick={() => setViewMode('mobile')}>📱 Vista móvil</button>
                </div>
                <StorePreview data={storeData} products={products} viewMode={viewMode} />
            </main>
        </div>
    );
}

export default function BuilderPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BuilderContent />
        </Suspense>
    );
}
