"use client";

import React, { useState, ChangeEvent, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import StorePreview from '@/components/StorePreview';
import StoreQRCode from '@/components/StoreQRCode';
import { StoreData, Product } from '@/lib/store-service';
import { compressImage } from '@/lib/image-utils';
import { useAnalytics } from '@/components/Analytics';
import { getStoreUrl } from '@/lib/utils';
import ImageUploader from '@/components/ImageUploader';
import '../styles/builder.css';

export const dynamic = "force-dynamic";

// Initial store data structure
// Helper to ensure URL is valid
const normalizeUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
};

const INITIAL_DATA: StoreData = {
    title: 'Mi Nueva Tienda',
    name: 'Mi Nueva Tienda',
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
    const router = useRouter();
    const editSlug = searchParams?.get('edit');
    const { trackEvent } = useAnalytics();

    const [storeData, setStoreData] = useState<StoreData>(INITIAL_DATA);
    const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [publicUrl, setPublicUrl] = useState<string | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [editingProductId, setEditingProductId] = useState<number | null>(null);
    const [showQr, setShowQr] = useState(false);

    // Refs for session persistence and race condition prevention
    const isSavingRef = useRef(false);
    const slugRef = useRef<string | null>(null);
    const idRef = useRef<string | null>(null);

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
                    if (data && (data.store || data.data)) {
                        const rawData = data.store ? data.store.data : data.data;
                        const storeId = data.store ? data.store.id : data.id;
                        const storeSlug = data.store ? data.store.slug : data.slug;

                        if (!rawData) {
                            console.error('Invalid store data format:', data);
                            throw new Error('Formato de datos de tienda inválido');
                        }

                        // Deep merge with INITIAL_DATA to ensure structure
                        const mergedData: StoreData = {
                            ...INITIAL_DATA,
                            ...rawData,
                            // Safety checks for critical fields
                            name: rawData.name || INITIAL_DATA.name,
                            desc: rawData.desc || INITIAL_DATA.desc,
                            whatsapp: rawData.whatsapp || INITIAL_DATA.whatsapp,
                            color: rawData.color || INITIAL_DATA.color,
                            id: storeId,
                            socials: {
                                ...INITIAL_DATA.socials,
                                ...(rawData.socials || {})
                            },
                            about: {
                                ...INITIAL_DATA.about,
                                ...(rawData.about || {})
                            },
                            careers: {
                                ...INITIAL_DATA.careers,
                                ...(rawData.careers || {})
                            }
                        };

                        setStoreData(mergedData);
                        idRef.current = storeId;
                        slugRef.current = storeSlug;

                        const actualProducts = data.store?.products || data.products || [];
                        setProducts(actualProducts || INITIAL_PRODUCTS);
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

    // Auto-save logic
    useEffect(() => {
        if (!isLoading && !isSaving && hasUnsavedChanges) {
            const timer = setTimeout(() => {
                handleSave(true); // silent save
            }, 3000); // 3 seconds debounce
            return () => clearTimeout(timer);
        }
    }, [storeData, products, hasUnsavedChanges, isLoading, isSaving]);

    // Mark as having unsaved changes when data changes
    useEffect(() => {
        if (!isLoading && !isSaving) {
            // Check if data actually changed from INITIAL_DATA to avoid false positives on mount
            const isDefault = JSON.stringify(storeData) === JSON.stringify(INITIAL_DATA) &&
                JSON.stringify(products) === JSON.stringify(INITIAL_PRODUCTS);

            if (!isDefault) {
                setHasUnsavedChanges(true);
            }
        }
    }, [storeData, products, isLoading, isSaving]);

    // Product form state
    const [prodForm, setProdForm] = useState({ name: '', desc: '', category: '', price: '', image: null as string | null });



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

        if (prodForm.price && isNaN(Number(prodForm.price))) {
            alert('El precio debe ser un número');
            return;
        }
        // Haptic feedback
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(50);
        }

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

    const deleteProduct = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            // Haptic feedback
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(50);
            }
            setProducts(products.filter(p => p.id !== id));
            setHasUnsavedChanges(true);
        }
    };

    const handleSave = async (silent: boolean = false) => {
        // PREVENTION: Don't save if already in progress (Race Condition Lock)
        if (isSavingRef.current) return;

        setIsSaving(true);
        isSavingRef.current = true;
        console.log('Starting save process...', { silent });

        if (!silent) setPublicUrl(null);
        try {
            // SLUG STABILIZATION
            if (!slugRef.current && !editSlug) {
                const namePart = storeData.name.toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')
                    .replace(/-+/g, '-');

                if (!namePart && !silent) {
                    throw new Error('Por favor ingresa un nombre para tu tienda antes de publicar.');
                }

                slugRef.current = (namePart || 'tienda') + '-' + Math.random().toString(36).substring(2, 7);
            }

            const currentSlug = slugRef.current || storeData.slug || editSlug;

            if (!currentSlug && !silent) {
                throw new Error('Error de enlace: No se pudo determinar la dirección de la tienda.');
            }

            const currentId = idRef.current || storeData.id;

            // Determine method and URL based on persistent ID
            const method = currentId ? 'PUT' : 'POST';
            const url = currentId ? `/api/stores/${currentId}` : '/api/stores';

            const payload = {
                name: storeData.name,
                slug: currentSlug,
                data: storeData,
                products
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                // ... (existing error handling remains same)
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
                        alert(`${json.message || json.error}\n\nSerás redirigido a WhatsApp para recibir asesoría personalizada.`);
                        window.location.href = json.upgradeUrl;
                        return;
                    }
                    throw new Error(json.message || json.error || 'Error desconocido en el servidor');
                } else {
                    throw new Error(`Error del servidor: ${res.status} ${res.statusText}. Es posible que el contenido sea demasiado grande.`);
                }
            }

            const json = await res.json();
            if (json.success) {
                // ID PERSISTENCE: Immediately store the ID to convert subsequent POSTs to PUTs
                if (json.id || json.store?.id) {
                    const newId = json.id || json.store?.id;
                    idRef.current = newId;
                    setStoreData(prev => ({ ...prev, id: newId }));
                }

                const finalUrl = getStoreUrl(currentSlug);
                console.log('Save successful, public URL:', finalUrl);
                setPublicUrl(finalUrl);
                setHasUnsavedChanges(false);

                // TRACK CONVERSION
                trackEvent('store_publish_success', { store_name: storeData.name });

                if (!silent) {
                    // Manual publish/update: Redirect to success landing to show QR and Share options
                    console.log('Redirecting to success page with slug:', currentSlug);
                    router.push(`/builder/success?slug=${currentSlug}`);
                }
            } else {
                throw new Error(json.message || 'Error inesperado');
            }
        } catch (e: any) {
            console.error('Save error:', e);
            if (!silent) alert(`No se pudo guardar la tienda.\n${e.message || 'Error de conexión.'}`);
        } finally {
            setIsSaving(false);
            isSavingRef.current = false;
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
                    <div className="form-group md:col-span-2">
                        <label>Logo</label>
                        <ImageUploader
                            onImageSelected={e => handleImageUpload('logo', e)}
                            currentImage={storeData.logo}
                            showPreview
                        />
                    </div>
                    <div className="form-group md:col-span-2">
                        <label>Imagen de fondo del encabezado (opcional)</label>
                        <ImageUploader
                            onImageSelected={e => handleImageUpload('heroBg', e)}
                            currentImage={storeData.heroBg}
                            showPreview
                        />
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
                    <div className="form-group">
                        <label>Galería de imágenes de la empresa</label>
                        <ImageUploader
                            onImageSelected={handleGalleryUpload}
                            multiple
                        />
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
                <section className="form-section products-section">
                    <h3>5. Agregar / Editar Productos</h3>
                    <div className="form-group"><label>Nombre del Producto *</label><input value={prodForm.name} onChange={e => setProdForm({ ...prodForm, name: e.target.value })} /></div>
                    <div className="form-group"><label>Descripción *</label><textarea value={prodForm.desc} onChange={e => setProdForm({ ...prodForm, desc: e.target.value })} /></div>
                    <div className="form-group"><label>Categoría *</label><input value={prodForm.category} onChange={e => setProdForm({ ...prodForm, category: e.target.value })} /></div>
                    <div className="form-group"><label>Precio *</label><input type="number" value={prodForm.price} onChange={e => setProdForm({ ...prodForm, price: e.target.value })} /></div>
                    <div className="form-group">
                        <label>Imagen del Producto</label>
                        <ImageUploader
                            onImageSelected={async e => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    try {
                                        const base64 = await compressImage(file, 600, 0.6);
                                        setProdForm({ ...prodForm, image: base64 });
                                    } catch (err) {
                                        console.error('Error compressing product image:', err);
                                        alert('Error al procesar la imagen');
                                    }
                                }
                            }}
                            currentImage={prodForm.image}
                            showPreview
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-secondary" onClick={handleSaveProduct}>
                            {editingProductId ? '💾 Actualizar Producto' : '➕ Agregar Producto'}
                        </button>
                        {editingProductId && (
                            <button className="btn btn-secondary" style={{ backgroundColor: '#ff5252', color: 'white' }} onClick={() => {
                                setEditingProductId(null);
                                setProdForm({ name: '', price: '', desc: '', image: null, category: '' });
                            }}>
                                Cancelar
                            </button>
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
                    <button className="btn btn-primary" onClick={() => handleSave(false)} disabled={isSaving || isLoading} style={{ marginBottom: '1rem' }}>
                        {isSaving ? '💾 Guardando...' : (hasUnsavedChanges ? '💾 Guardar Cambios' : (editSlug ? '✅ Cambios Guardados' : '🚀 Crear Tienda'))}
                    </button>

                    {publicUrl && (
                        <div className="flex flex-col gap-2 mb-4">
                            <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary w-full text-center py-4 bg-green-50 border-green-200 text-green-700 font-black rounded-xl hover:bg-green-100 transition-all flex items-center justify-center gap-2">
                                👁️ Ver Tienda Online
                            </a>
                            <button
                                onClick={() => router.push(`/builder/success?slug=${slugRef.current || storeData.slug}`)}
                                className="btn btn-secondary w-full text-center py-4 bg-purple-50 border-purple-200 text-purple-700 font-black rounded-xl hover:bg-purple-100 transition-all flex items-center justify-center gap-2"
                            >
                                🔗 Gestionar QR y Compartir
                            </button>
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
