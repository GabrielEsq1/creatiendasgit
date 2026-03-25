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
    const [showMobileWarning, setShowMobileWarning] = useState(false);
    const [forceDesktopViewport, setForceDesktopViewport] = useState(false);

    // Show warning if user enters on mobile
    useEffect(() => {
        if (typeof window !== 'undefined' && window.innerWidth <= 900) {
            setShowMobileWarning(true);
        }
    }, []);

    // Handle Viewport manipulation for Desktop Simulation
    useEffect(() => {
        if (typeof window === 'undefined') return;

        let viewportMeta = document.querySelector('meta[name="viewport"]');
        if (!viewportMeta) {
            viewportMeta = document.createElement('meta');
            viewportMeta.setAttribute('name', 'viewport');
            document.head.appendChild(viewportMeta);
        }

        if (forceDesktopViewport) {
            viewportMeta.setAttribute('content', 'width=1200, user-scalable=yes');
        } else {
            viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=5');
        }

        // Cleanup: ALWAYS reset to mobile native layout when leaving the builder component
        return () => {
            if (document.querySelector('meta[name="viewport"]')) {
                document.querySelector('meta[name="viewport"]')?.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=5');
            }
        };
    }, [forceDesktopViewport]);

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
    const [prodForm, setProdForm] = useState({
        name: '',
        desc: '',
        category: '',
        price: '',
        tags: '',
        images: [] as string[]
    });

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


    // Helper to upload a file to the DATABASE (Works on Vercel!)
    const uploadImageToServer = async (base64OrFile: string | File): Promise<string> => {
        let base64: string;
        let mimeType = "image/jpeg";

        if (typeof base64OrFile === 'string') {
            base64 = base64OrFile;
            if (base64.startsWith('data:')) {
                const match = base64.match(/^data:([^;]+);base64,/);
                if (match) mimeType = match[1];
            }
        } else {
            // Convert file to base64
            const reader = new FileReader();
            base64 = await new Promise((resolve) => {
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.readAsDataURL(base64OrFile);
            });
            mimeType = base64OrFile.type;
        }

        const currentStoreId = storeData.id || editSlug || "new-store";

        const res = await fetch('/api/image/uploaddb', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                storeId: currentStoreId,
                content: base64,
                mimeType: mimeType,
                type: 'generic'
            }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'No se pudo subir la imagen al servidor');
        }

        const data = await res.json();
        return data.url;
    };

    const handleImageUpload = async (field: string, e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsLoading(true); // Show loading while uploading
            try {
                // 1. Compress
                const base64 = await compressImage(file, 800, 0.7);
                // 2. Upload to get a URL instead of storage-heavy base64
                const url = await uploadImageToServer(base64);
                setStoreData(prev => ({ ...prev, [field]: url }));
            } catch (err) {
                console.error('Error uploading image:', err);
                alert('Error al subir la imagen. Intenta de nuevo.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleGalleryUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setIsLoading(true);
            const newUrls: string[] = [];
            for (let i = 0; i < files.length; i++) {
                try {
                    const base64 = await compressImage(files[i], 800, 0.7);
                    const url = await uploadImageToServer(base64);
                    newUrls.push(url);
                } catch (err) {
                    console.error('Error uploading gallery image:', err);
                }
            }
            setStoreData(prev => ({
                ...prev,
                about: { ...prev.about, gallery: [...prev.about.gallery, ...newUrls] }
            }));
            setIsLoading(false);
        }
    };

    const PRODUCT_LIMIT = 1000;

    const handleSaveProduct = async () => {
        if (!prodForm.name || !prodForm.price) return alert('Nombre y precio requeridos');

        let updatedProduct: Product;
        let newProductsList: Product[];

        if (editingProductId) {
            // Edit existing product in state
            updatedProduct = {
                id: editingProductId,
                name: prodForm.name,
                description: prodForm.desc,
                category: prodForm.category,
                price: prodForm.price,
                tags: prodForm.tags ? (typeof prodForm.tags === 'string' ? prodForm.tags.split(',').map(t => t.trim()) : prodForm.tags) : [],
                images: prodForm.images,
                image: prodForm.images[0] || null
            };
            newProductsList = products.map(p => p.id === editingProductId ? updatedProduct : p);
        } else {
            // Max limit check
            if (products.length >= PRODUCT_LIMIT) {
                return alert(`Has alcanzado el límite de ${PRODUCT_LIMIT} productos por tienda.`);
            }
            updatedProduct = {
                id: Date.now(),
                name: prodForm.name,
                description: prodForm.desc,
                category: prodForm.category,
                price: prodForm.price,
                tags: prodForm.tags ? (typeof prodForm.tags === 'string' ? prodForm.tags.split(',').map(t => t.trim()) : prodForm.tags) : [],
                images: prodForm.images,
                image: prodForm.images[0] || null
            };
            newProductsList = [...products, updatedProduct];
        }

        // UPDATE LOCAL STATE FIRST
        setProducts(newProductsList);
        setProdForm({ name: '', desc: '', category: '', price: '', tags: '', images: [] });
        setEditingProductId(null);

        // INCREMENTAL SAVE TO DATABASE
        // If the store already exists (we have an ID or are in edit mode), save this product immediately
        const storeIdToUse = storeData.id || editSlug;
        if (storeIdToUse) {
            try {
                const res = await fetch(`/api/stores/${storeIdToUse}/products`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ product: updatedProduct })
                });

                if (!res.ok) {
                    console.error('Failed to save product incrementally');
                } else {
                    console.log('✅ Product saved incrementally to DB');
                }
            } catch (err) {
                console.error('Network error during incremental product save:', err);
            }
        }
    };

    const handleDeleteProduct = async (productId: number) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;

        // 1. Update local state
        setProducts(products.filter(p => p.id !== productId));

        // 2. Incremental delete from DB
        const storeIdToUse = storeData.id || editSlug;
        if (storeIdToUse) {
            try {
                await fetch(`/api/stores/${storeIdToUse}/products?id=${productId}`, {
                    method: 'DELETE'
                });
                console.log('✅ Product deleted incrementally from DB');
            } catch (err) {
                console.error('Failed to delete product from DB:', err);
            }
        }
    };

    const handleEditProduct = (product: Product) => {
        setProdForm({
            name: product.name,
            desc: product.description,
            category: product.category,
            price: product.price,
            tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
            images: product.images || (product.image ? [product.image] : [])
        });
        setEditingProductId(product.id);
    };

    const handleCancelEdit = () => {
        setProdForm({ name: '', desc: '', category: '', price: '', tags: '', images: [] });
        setEditingProductId(null);
    };

    const handleSave = async () => {
        if (isSaving) return;
        setIsSaving(true);
        setPublicUrl(null);

        try {
            // STEP 1: ENTERPRISE PROTECTION - MIGRATE BASE64 TO URLS
            // This is critical for stores like Magis Store with 1000 products.
            // We scan everything for Base64 and upload to server before saving metadata.

            const migrationProducts = [...products];
            let migrationStoreData = { ...storeData };
            let migratedCount = 0;

            // 1a. Migrate Products
            for (let i = 0; i < migrationProducts.length; i++) {
                const p = migrationProducts[i];
                // Check multiple images
                if (p.images && p.images.length > 0) {
                    const newImages = [...p.images];
                    let changed = false;
                    for (let j = 0; j < newImages.length; j++) {
                        if (newImages[j]?.startsWith('data:image/')) {
                            newImages[j] = await uploadImageToServer(newImages[j]);
                            changed = true;
                            migratedCount++;
                        }
                    }
                    if (changed) {
                        migrationProducts[i] = { ...p, images: newImages, image: newImages[0] };
                    }
                } else if (p.image?.startsWith('data:image/')) {
                    // Check legacy single image
                    const url = await uploadImageToServer(p.image);
                    migrationProducts[i] = { ...p, image: url, images: [url] };
                    migratedCount++;
                }
            }

            // 1b. Migrate Store Identity
            if (migrationStoreData.logo?.startsWith('data:image/')) {
                migrationStoreData.logo = await uploadImageToServer(migrationStoreData.logo);
                migratedCount++;
            }
            if (migrationStoreData.heroBg?.startsWith('data:image/')) {
                migrationStoreData.heroBg = await uploadImageToServer(migrationStoreData.heroBg);
                migratedCount++;
            }
            if (migrationStoreData.about?.gallery?.length > 0) {
                const newGallery = [...migrationStoreData.about.gallery];
                let changed = false;
                for (let i = 0; i < newGallery.length; i++) {
                    if (newGallery[i]?.startsWith('data:image/')) {
                        newGallery[i] = await uploadImageToServer(newGallery[i]);
                        changed = true;
                        migratedCount++;
                    }
                }
                if (changed) {
                    migrationStoreData.about = { ...migrationStoreData.about, gallery: newGallery };
                }
            }

            if (migratedCount > 0) {
                console.log(`✅ Migrated ${migratedCount} images to server URLs`);
                setProducts(migrationProducts);
                setStoreData(migrationStoreData);
            }

            // Determine if this is an update (existing store) or create (new store)
            const isUpdate = !!editSlug || !!storeData.id;

            // Only generate new slug for NEW stores, not for updates
            let slug: string;
            if (isUpdate) {
                slug = editSlug || storeData.slug || '';
            } else {
                slug = storeData.name.toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')
                    .replace(/-+/g, '-') + '-' + Date.now().toString(36);
            }

            const endpoint = isUpdate ? `/api/stores/${editSlug || storeData.id}` : '/api/stores';
            const method = isUpdate ? 'PUT' : 'POST';

            const payload = JSON.stringify({
                name: migrationStoreData.name,
                slug,
                data: migrationStoreData,
                products: migrationProducts,
                id: migrationStoreData.id
            });

            // PAYLOAD SIZE CHECK (Vercel limit is 4.5MB, we use 4MB as safety margin)
            // After migration to URLs, this should NEVER be hit even with 1000 products.
            const payloadSizeMB = payload.length / (1024 * 1024);
            if (payloadSizeMB > 4.2) {
                setIsSaving(false);
                alert(`⚠️ LA TIENDA ES DEMASIADO GRANDE (${payloadSizeMB.toFixed(2)}MB)\n\nIncluso tras optimizar, hay demasiados datos de texto. Intenta:\n1. Reducir el número de productos (máximo 1000).\n2. Acortar las descripciones muy largas.`);
                return;
            }

            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: payload
            });

            if (!res.ok) {
                if (res.status === 413) {
                    throw new Error('La tienda contiene demasiados datos. Por favor, intenta reducir el número de productos o descripciones.');
                }

                const contentType = res.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const json = await res.json();
                    if (res.status === 401) {
                        alert('Debes iniciar sesión para guardar tu tienda.');
                        window.location.href = '/auth/login';
                        return;
                    }
                    if (res.status === 403) {
                        const limitMessage = json.message || 'Has alcanzado el límite de tiendas.';
                        const detailedMessage = `${limitMessage}\n\nPlan actual: ${json.plan || 'FREE'}\nTiendas actuales: ${json.currentStores || 0}\nLímite: ${json.limit || 1}`;
                        alert(detailedMessage);
                        if (confirm('¿Deseas hablar con un asesor para actualizar tu plan?')) {
                            window.open(`https://wa.me/573026687991?text=${encodeURIComponent("Hola, quiero actualizar mi plan.")}`, '_blank');
                        }
                        return;
                    }
                    throw new Error(json.message || json.error || 'Error desconocido');
                } else {
                    throw new Error(`Error del servidor: ${res.status}. El contenido es demasiado grande.`);
                }
            }

            const json = await res.json();
            if (json.success) {
                const rawUrl = json.url || json.publicUrl;
                const finalUrl = normalizeUrl(rawUrl);
                setPublicUrl(finalUrl);
                setHasUnsavedChanges(false);
                if (json.id) {
                    setStoreData(prev => ({ ...prev, id: json.id }));
                }

                if (!editSlug) {
                    setHasUnsavedChanges(false);
                    let finalSlug = json.slug || slug || storeData.slug;
                    window.location.href = `/builder/share?slug=${finalSlug}&storeName=${encodeURIComponent(storeData.name)}`;
                } else {
                    alert(`¡Cambios guardados con éxito!\n\nTu tienda está actualizada y optimizada en el servidor.`);
                }
            } else {
                throw new Error(json.message || 'Error inesperado');
            }
        } catch (e: any) {
            console.error('Save error:', e);
            alert(`No se pudo guardar la tienda.\n${e.message || 'Error de conexión.'}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="app-container">
            {/* LEFT PANEL */}
            <aside className="builder-panel">
                <div className="panel-header">
                    <a href="/dashboard" style={{ marginBottom: '0.5rem', display: 'inline-block', color: '#2196F3', textDecoration: 'none', fontSize: '0.9rem' }}>← Volver al Panel</a>
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
                        <label>Moneda Base</label>
                        <select value={storeData.currency || 'COP'} onChange={e => handleInputChange(null, 'currency', e.target.value)} className="w-full p-2 border rounded">
                            <option value="COP">Pesos Colombianos (COP)</option>
                            <option value="USD">Dólares (USD)</option>
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
                    <h3>
                        5. Agregar / Editar Productos
                        <span className={`product-count-badge ${products.length >= 1000 ? 'product-count-badge--max' :
                                products.length >= 800 ? 'product-count-badge--warn' :
                                    'product-count-badge--ok'
                            }`}>
                            {products.length} / 1000
                        </span>
                    </h3>
                    <div className="form-group"><label>Nombre del Producto *</label><input value={prodForm.name} onChange={e => setProdForm({ ...prodForm, name: e.target.value })} /></div>
                    <div className="form-group"><label>Descripción *</label><textarea value={prodForm.desc} onChange={e => setProdForm({ ...prodForm, desc: e.target.value })} /></div>
                    <div className="form-group"><label>Categoría *</label><input value={prodForm.category} onChange={e => setProdForm({ ...prodForm, category: e.target.value })} /></div>
                    <div className="form-group"><label>Precio *</label><input type="number" value={prodForm.price} onChange={e => setProdForm({ ...prodForm, price: e.target.value })} /></div>
                    <div className="form-group"><label>Etiquetas (separadas por coma)</label><input value={prodForm.tags} onChange={e => setProdForm({ ...prodForm, tags: e.target.value })} placeholder="Ej: Running, Outdoor, Oferta" /></div>
                    <div className="form-group">
                        <ImageUploader
                            label="Fotos del Producto (Máximo 5)"
                            currentImages={prodForm.images}
                            multiple={true}
                            maxImages={5}
                            showPreview={true}
                            onRemoveImage={(index) => {
                                setProdForm(prev => ({
                                    ...prev,
                                    images: prev.images.filter((_, i) => i !== index)
                                }));
                            }}
                            onImageSelected={async e => {
                                const files = e.target.files;
                                if (files) {
                                    const processedUrls: string[] = [];
                                    setIsLoading(true);
                                    for (let i = 0; i < files.length; i++) {
                                        try {
                                            const base64 = await compressImage(files[i], 800, 0.7);
                                            const url = await uploadImageToServer(base64);
                                            processedUrls.push(url);
                                        } catch (err) {
                                            console.error('Error uploading product image:', err);
                                        }
                                    }
                                    setProdForm(prev => ({
                                        ...prev,
                                        images: [...prev.images, ...processedUrls].slice(0, 5)
                                    }));
                                    setIsLoading(false);
                                }
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            className="btn btn-secondary"
                            onClick={handleSaveProduct}
                            disabled={!editingProductId && products.length >= 1000}
                            title={!editingProductId && products.length >= 1000 ? 'Límite de 1000 productos alcanzado' : undefined}
                        >
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
                                    {p.images && p.images.length > 0 ? (
                                        <div className="product-thumb-stack">
                                            <img src={p.images[0]} className="product-thumb" alt={p.name} />
                                            {p.images.length > 1 && (
                                                <span className="thumb-count">+{p.images.length - 1}</span>
                                            )}
                                        </div>
                                    ) : p.image ? (
                                        <img src={p.image} className="product-thumb" alt={p.name} />
                                    ) : (
                                        <div className="product-thumb" style={{ background: '#ccc' }} />
                                    )}
                                    <div>
                                        <strong>{p.name}</strong><br />
                                        <small>{p.category} · ${p.price}</small>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.35rem' }}>
                                    <button className="btn btn-secondary" onClick={() => handleEditProduct(p)} title="Editar producto">✏️</button>
                                    <button className="btn btn-danger" onClick={() => handleDeleteProduct(p.id)} title="Eliminar producto">🗑️</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="form-section" style={{ position: 'sticky', bottom: 0, zIndex: 10 }}>
                    <button className="btn btn-primary" onClick={handleSave} disabled={isSaving || isLoading} style={{ marginBottom: '1rem' }}>
                        {isSaving ? 'Guardando...' : (editSlug ? '💾 Actualizar Tienda' : '🚀 Validar / Crear Tienda')}
                    </button>
                    {editSlug && (
                        <a
                            href={`/builder/share?slug=${editSlug || ''}&storeName=${encodeURIComponent(storeData.name || 'Mi Tienda')}`}
                            className="btn btn-primary"
                            style={{ display: 'block', width: '100%', textAlign: 'center', marginBottom: '1rem', textDecoration: 'none', background: '#25D366', borderColor: '#25D366' }}
                        >
                            📤 Compartir / QR
                        </a>
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

            {/* SUCCESS MODAL */}
            {publicUrl && (
                <div className="success-modal-overlay">
                    <div className="success-modal-content">
                        <div className="success-modal-icon">🎉</div>
                        <h2 className="success-modal-title">¡Tienda lista!</h2>
                        <p className="success-modal-desc">
                            Tu tienda ha sido {editSlug ? 'actualizada' : 'creada'} con éxito y ya puedes compartirla.
                        </p>

                        <div className="url-copy-box">
                            <input readOnly value={publicUrl} />
                        </div>

                        <div className="success-modal-actions">
                            <button
                                className="btn btn-secondary"
                                onClick={() => {
                                    navigator.clipboard.writeText(publicUrl);
                                    alert('¡Enlace copiado! 📋');
                                }}
                            >
                                📋 Copiar enlace
                            </button>
                            <a
                                href={publicUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                                style={{ textDecoration: 'none' }}
                            >
                                👁️ Visitar tienda →
                            </a>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setPublicUrl(null)}
                                style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#4b5563' }}
                            >
                                ✏️ Seguir editando
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MOBILE WARNING MODAL */}
            {showMobileWarning && (
                <div className="success-modal-overlay" style={{ zIndex: 100000 }}>
                    <div className="success-modal-content" style={{ padding: '30px 20px' }}>
                        <div className="success-modal-icon" style={{ fontSize: '3.5rem', marginBottom: '15px' }}>
                            💻📱
                        </div>
                        <h2 className="success-modal-title" style={{ color: '#111', fontSize: '1.4rem' }}>
                            ¡Mejor experiencia en PC!
                        </h2>
                        <p className="success-modal-desc" style={{ marginBottom: '25px', color: '#555', fontSize: '0.95rem' }}>
                            Para una <strong>mejor experiencia de edición</strong>, crea o modifica tu tienda desde un computador.
                            <br /><br />
                            Tu tienda se verá <strong>perfectamente optimizada en celulares</strong> cuando la compartas con tus clientes, pero a la hora de construirla, tendrás muchas más ventajas en PC.
                        </p>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setShowMobileWarning(false);
                                setForceDesktopViewport(true);
                            }}
                            style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold' }}
                        >
                            ¡Entendido!
                        </button>
                    </div>
                </div>
            )}
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
