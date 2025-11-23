"use client";

import React, { useState, ChangeEvent, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import StorePreview from '@/components/StorePreview';
import { StoreData, Product } from '@/lib/store-service';
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
                        setStoreData({ ...data.store.data, id: data.store.id });
                        if (data.store.products) setProducts(data.store.products);
                    } else if (data && data.data) {
                        // Fallback for potential legacy API structure
                        setStoreData({ ...data.data, id: data.id });
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

    const fileToBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

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
        setIsSaving(true);
        setPublicUrl(null);
        try {
            const res = await fetch('/api/stores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: storeData.name, data: storeData, products, id: storeData.id })
            });
            const json = await res.json();
            if (res.ok && json.success) {
                const rawUrl = json.url || json.publicUrl;
                const finalUrl = normalizeUrl(rawUrl);
                setPublicUrl(finalUrl);
                setHasUnsavedChanges(false); // Mark as saved
                alert(`¡Tienda guardada con éxito!\n\nTu tienda está lista en:\n${finalUrl}`);
                if (!editSlug) {
                    window.open(finalUrl, '_blank');
                }
            } else {
                if (res.status === 401) {
                    alert('Debes iniciar sesión para guardar tu tienda.');
                    window.location.href = '/auth/login';
                    return;
                }
                if (res.status === 403 && json.upgradeUrl) {
                    if (confirm(`${json.message}\n\n¿Deseas ver los planes disponibles?`)) {
                        window.location.href = json.upgradeUrl;
                    }
                    return;
                }
                const msg = json.message || 'Error desconocido en el servidor';
                alert(`No se pudo guardar la tienda.\nDetalle: ${msg}`);
            }
        } catch (e) {
            console.error('Save error:', e);
            alert('Ocurrió un error de conexión al intentar guardar. Por favor intenta de nuevo.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="app-container">
            {/* LEFT PANEL */}
            <aside className="builder-panel">
                <div className="panel-header">
                    <Link href="/dashboard" style={{ marginBottom: '0.5rem', display: 'inline-block', color: '#2196F3', textDecoration: 'none', fontSize: '0.9rem' }}>← Back to Dashboard</Link>
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
                            <option value="Inter">Inter (Moderna)</option>
                            <option value="Roboto">Roboto (Clásica)</option>
                            <option value="Open Sans">Open Sans (Legible)</option>
                            <option value="Lato">Lato (Elegante)</option>
                            <option value="Montserrat">Montserrat (Geométrica)</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Logo</label>
                        <input type="file" accept="image/*" onChange={e => handleImageUpload('logo', e)} />
                    </div>
                    <div className="form-group">
                        <label>Imagen de fondo del encabezado (opcional)</label>
                        <input type="file" accept="image/*" onChange={e => handleImageUpload('heroBg', e)} />
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
                    <div className="form-group"><label>Imagen del Producto</label><input type="file" accept="image/*" onChange={async e => {
                        const file = e.target.files?.[0];
                        if (file) {
                            const base64 = await fileToBase64(file);
                            setProdForm({ ...prodForm, image: base64 });
                        }
                    }} /></div>
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
                                        <small>{p.category} · ${p.price}</small>
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
                        {isSaving ? 'Guardando...' : (editSlug ? '🔄 Actualizar Tienda' : '🔄 Validar / Crear Tienda')}
                    </button>
                    {editSlug && publicUrl && (
                        <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ display: 'block', textAlign: 'center', marginBottom: '1rem', textDecoration: 'none' }}>
                            👁️ Ver Tienda
                        </a>
                    )}
                    {publicUrl && (
                        <div className="public-url-box" style={{ marginTop: '1rem', padding: '1rem', background: '#e8f5e9', borderRadius: '8px', border: '1px solid #c8e6c9' }}>
                            <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#2e7d32' }}>✅ ¡Tu tienda está lista!</p>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input readOnly value={publicUrl} style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                                <button className="btn btn-secondary" onClick={() => { navigator.clipboard.writeText(publicUrl); alert('URL copiada!'); }} style={{ padding: '0.5rem 1rem' }}>Copiar</button>
                            </div>
                            <a href={publicUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: '0.5rem', color: '#2e7d32', textDecoration: 'underline' }}>Visitar tienda →</a>
                        </div>
                    )}
                </section>
            </aside>

            {/* RIGHT PANEL */}
            <main className="preview-panel">
                <div className="device-toggle">
                    <button className={`device-btn ${viewMode === 'desktop' ? 'active' : ''}`} onClick={() => setViewMode('desktop')}>🖥 Vista escritorio</button>
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
