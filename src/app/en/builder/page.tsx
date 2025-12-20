"use client";

import React, { useState, ChangeEvent, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import StorePreview from '@/components/en/StorePreviewEN';
import StoreQRCode from '@/components/StoreQRCode';
import { StoreData, Product } from '@/lib/store-service';
import { compressImage } from '@/lib/image-utils';
import '../../styles/builder.css'; // Path adjusted for /en/builder

export const dynamic = "force-dynamic";

// Initial store data structure
const INITIAL_DATA: StoreData = {
    title: 'My New Store',
    name: 'My New Store',
    desc: 'Short description of the store',
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
        name: 'Special Combo',
        description: 'Our star combo with drink and side.',
        category: 'Combos',
        price: '10900',
        image: null
    },
    {
        id: 2,
        name: 'House Dessert',
        description: 'Delicious creamy dessert to finish with a flourish.',
        category: 'Desserts',
        price: '8900',
        image: null
    }
];

function BuilderContentEN() {
    const searchParams = useSearchParams();
    const editSlug = searchParams?.get('edit');

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
                        setStoreData({ ...data.data, id: data.id });
                        if (data.products) setProducts(data.products);
                    } else {
                        alert('Could not load store for editing');
                    }
                })
                .catch(err => {
                    console.error('Error loading store:', err);
                    alert('Error loading store');
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
            const timer = setTimeout(() => {
                setHasUnsavedChanges(true);
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [storeData, products, isLoading, isSaving]);

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

    const handleImageUpload = async (field: string, e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const base64 = await compressImage(file, 600, 0.6);
                setStoreData(prev => ({ ...prev, [field]: base64 }));
            } catch (err) {
                console.error('Error compressing image:', err);
                alert('Error processing image. Try a smaller one.');
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
        if (!prodForm.name || !prodForm.price) return alert('Name and price required');

        if (editingProductId) {
            // Edit Mode
            setProducts(products.map(p =>
                p.id === editingProductId
                    ? { ...p, name: prodForm.name, description: prodForm.desc, category: prodForm.category, price: prodForm.price, image: prodForm.image }
                    : p
            ));
            setEditingProductId(null);
        } else {
            // Create Mode
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
            const slug = storeData.name.toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
                .replace(/-+/g, '-') + '-' + Date.now().toString(36);

            const method = storeData.id ? 'PUT' : 'POST';
            const url = storeData.id ? `/api/stores/${storeData.id}` : '/api/stores';

            const payload = {
                name: storeData.name,
                slug,
                data: storeData,
                products
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                if (res.status === 413) {
                    throw new Error('The store contains too much data or images are too heavy. Please try reducing image size or removing some.');
                }

                const contentType = res.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const json = await res.json();
                    if (res.status === 401) {
                        alert('You must log in to save your store.');
                        window.location.href = '/en/auth/login';
                        return;
                    }
                    if (res.status === 403 && json.upgradeUrl) {
                        alert(`${json.message}\n\nYou will be redirected to WhatsApp for personalized advice.`);
                        window.location.href = json.upgradeUrl;
                        return;
                    }
                    throw new Error(json.message || 'Unknown server error');
                } else {
                    throw new Error(`Server error: ${res.status} ${res.statusText}. Content might be too large.`);
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
                alert(`Store saved successfully!\n\nYour store is ready at:\n${finalUrl}`);
                if (!editSlug) {
                    window.open(finalUrl, '_blank');
                }
            } else {
                throw new Error(json.message || 'Unexpected error');
            }
        } catch (e: any) {
            console.error('Save error:', e);
            alert(`Could not save store.\n${e.message || 'Connection error. Try reducing image size.'}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="app-container">
            {/* LEFT PANEL */}
            <aside className="builder-panel">
                <div className="panel-header">
                    <Link href="/en/dashboard" style={{ marginBottom: '0.5rem', display: 'inline-block', color: '#2196F3', textDecoration: 'none', fontSize: '0.9rem' }}>← Back to Dashboard</Link>
                    <h2>{editSlug ? '✏️ Edit Store' : '🛠️ Store Builder'}</h2>
                    <p>{editSlug ? 'Modify your store and save changes.' : 'Configure your store, add products, and see changes in real-time.'}</p>
                    {isLoading && <p style={{ color: '#2196F3', fontWeight: 'bold' }}>🔄 Loading store data...</p>}
                </div>

                {/* 1. Identidad */}
                <section className="form-section">
                    <h3>1. Store Identity</h3>
                    <div className="form-group">
                        <label>Main Title</label>
                        <input value={storeData.title} onChange={e => handleInputChange(null, 'title', e.target.value)} placeholder="Ex: Daily Specials" />
                    </div>
                    <div className="form-group">
                        <label>Store Name *</label>
                        <input value={storeData.name} onChange={e => handleInputChange(null, 'name', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Short Description</label>
                        <textarea value={storeData.desc} onChange={e => handleInputChange(null, 'desc', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>WhatsApp Number *</label>
                        <input value={storeData.whatsapp} onChange={e => handleInputChange(null, 'whatsapp', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Main Color</label>
                        <div className="color-picker-wrapper">
                            <input type="color" value={storeData.color} onChange={e => handleInputChange(null, 'color', e.target.value)} />
                            <span>{storeData.color}</span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Typography</label>
                        <select value={storeData.font || 'Inter'} onChange={e => handleInputChange(null, 'font', e.target.value)} className="w-full p-2 border rounded">
                            <option value="Inter">Inter (Standard)</option>
                            <option value="Roboto">Roboto (Classic)</option>
                            <option value="Open Sans">Open Sans (Readable)</option>
                            <option value="Lato">Lato (Elegant)</option>
                            <option value="Montserrat">Montserrat (Geometric)</option>
                            <option value="Poppins">Poppins (Modern)</option>
                            <option value="Playfair Display">Playfair Display (Luxury/Serif)</option>
                            <option value="Merriweather">Merriweather (Editorial)</option>
                            <option value="Raleway">Raleway (Sophisticated)</option>
                            <option value="Oswald">Oswald (Urban/Title)</option>
                            <option value="Nunito">Nunito (Friendly)</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Border Style</label>
                        <select value={storeData.borderRadius || '16px'} onChange={e => handleInputChange(null, 'borderRadius', e.target.value)} className="w-full p-2 border rounded">
                            <option value="0px">Square (0px)</option>
                            <option value="4px">Subtle (4px)</option>
                            <option value="8px">Standard (8px)</option>
                            <option value="16px">Modern (16px)</option>
                            <option value="24px">Very Rounded (24px)</option>
                            <option value="30px">Curved (30px)</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Logo</label>
                        <input type="file" accept="image/*" onChange={e => handleImageUpload('logo', e)} />
                    </div>
                    <div className="form-group">
                        <label>Header Background Image (optional)</label>
                        <input type="file" accept="image/*" onChange={e => handleImageUpload('heroBg', e)} />
                    </div>
                </section>

                {/* 2. Redes */}
                <section className="form-section">
                    <h3>2. Social Media & Contact</h3>
                    <div className="form-group"><label>Instagram</label><input value={storeData.socials.instagram} onChange={e => handleInputChange('socials', 'instagram', e.target.value)} /></div>
                    <div className="form-group"><label>Facebook</label><input value={storeData.socials.facebook} onChange={e => handleInputChange('socials', 'facebook', e.target.value)} /></div>
                    <div className="form-group"><label>TikTok</label><input value={storeData.socials.tiktok} onChange={e => handleInputChange('socials', 'tiktok', e.target.value)} /></div>
                    <div className="form-group"><label>Email</label><input value={storeData.socials.email} onChange={e => handleInputChange('socials', 'email', e.target.value)} /></div>
                    <div className="form-group"><label>Phone</label><input value={storeData.socials.phone} onChange={e => handleInputChange('socials', 'phone', e.target.value)} /></div>
                </section>

                {/* 3. Sobre Nosotros */}
                <section className="form-section">
                    <h3>3. About Us (Microsite)</h3>
                    <div className="form-group"><label>Hero Header – title</label><input value={storeData.about.heroTitle} onChange={e => handleInputChange('about', 'heroTitle', e.target.value)} /></div>
                    <div className="form-group"><label>Hero Header – short phrase</label><textarea value={storeData.about.heroSubtitle} onChange={e => handleInputChange('about', 'heroSubtitle', e.target.value)} /></div>
                    <div className="form-group"><label>Our Purpose / Mission</label><textarea value={storeData.about.mission} onChange={e => handleInputChange('about', 'mission', e.target.value)} /></div>
                    <div className="form-group"><label>Vision</label><textarea value={storeData.about.vision} onChange={e => handleInputChange('about', 'vision', e.target.value)} /></div>
                    <div className="form-group"><label>Values (one per line)</label><textarea value={storeData.about.values.join('\\n')} onChange={e => handleArrayChange('about', 'values', e.target.value)} rows={3} /></div>
                    <div className="form-group"><label>History / Timeline (one milestone per line)</label><textarea value={storeData.about.timeline.join('\\n')} onChange={e => handleArrayChange('about', 'timeline', e.target.value)} rows={3} /></div>
                    <div className="form-group"><label>What sets us apart (one per line)</label><textarea value={storeData.about.diff.join('\\n')} onChange={e => handleArrayChange('about', 'diff', e.target.value)} rows={3} /></div>
                    <div className="form-group"><label>Team or Culture</label><textarea value={storeData.about.team} onChange={e => handleInputChange('about', 'team', e.target.value)} /></div>
                    <div className="form-group"><label>Call to Action (button text)</label><input value={storeData.about.ctaText} onChange={e => handleInputChange('about', 'ctaText', e.target.value)} /></div>
                    <div className="form-group"><label>Company Image Gallery</label><input type="file" accept="image/*" multiple onChange={handleGalleryUpload} />
                        <div className="about-gallery-mini">{storeData.about.gallery.map((img, i) => (<img key={i} src={img} alt="Gallery" />))}</div>
                    </div>
                </section>

                {/* 4. Trabaja con Nosotros */}
                <section className="form-section">
                    <h3>4. Work with Us</h3>
                    <div className="form-group"><label>Title "Work with Us"</label><input value={storeData.careers.title} onChange={e => handleInputChange('careers', 'title', e.target.value)} /></div>
                    <div className="form-group"><label>Description / Invitation</label><textarea value={storeData.careers.desc} onChange={e => handleInputChange('careers', 'desc', e.target.value)} /></div>
                    <div className="form-group"><label>Benefits (one per line)</label><textarea value={storeData.careers.benefits.join('\\n')} onChange={e => handleArrayChange('careers', 'benefits', e.target.value)} rows={3} /></div>
                    <div className="form-group"><label>Button Text (WhatsApp)</label><input value={storeData.careers.ctaText} onChange={e => handleInputChange('careers', 'ctaText', e.target.value)} /></div>
                </section>

                {/* 5. Productos */}
                <section className="form-section">
                    <h3>5. Add / Edit Products</h3>
                    <div className="form-group"><label>Product Name *</label><input value={prodForm.name} onChange={e => setProdForm({ ...prodForm, name: e.target.value })} /></div>
                    <div className="form-group"><label>Description *</label><textarea value={prodForm.desc} onChange={e => setProdForm({ ...prodForm, desc: e.target.value })} /></div>
                    <div className="form-group"><label>Category *</label><input value={prodForm.category} onChange={e => setProdForm({ ...prodForm, category: e.target.value })} /></div>
                    <div className="form-group"><label>Price *</label><input type="number" value={prodForm.price} onChange={e => setProdForm({ ...prodForm, price: e.target.value })} /></div>
                    <div className="form-group"><label>Product Image</label><input type="file" accept="image/*" onChange={async e => {
                        const file = e.target.files?.[0];
                        if (file) {
                            try {
                                const base64 = await compressImage(file, 600, 0.6);
                                setProdForm({ ...prodForm, image: base64 });
                            } catch (err) {
                                console.error('Error compressing product image:', err);
                                alert('Error processing image');
                            }
                        }
                    }} /></div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-secondary" onClick={handleSaveProduct}>
                            {editingProductId ? '💾 Update Product' : '➕ Add Product'}
                        </button>
                        {editingProductId && (
                            <button className="btn btn-danger" onClick={handleCancelEdit}>❌ Cancel</button>
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
                                    <button className="btn btn-secondary" onClick={() => handleEditProduct(p)} title="Edit product">✏️</button>
                                    <button className="btn btn-danger" onClick={() => setProducts(products.filter(x => x.id !== p.id))} title="Delete product">🗑️</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="form-section" style={{ position: 'sticky', bottom: 0, zIndex: 10 }}>
                    <button className="btn btn-primary" onClick={handleSave} disabled={isSaving || isLoading} style={{ marginBottom: '1rem' }}>
                        {isSaving ? 'Saving...' : (editSlug ? '🔄 Update Store' : '🔄 Validate / Create Store')}
                    </button>
                    {editSlug && publicUrl && (
                        <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ display: 'block', textAlign: 'center', marginBottom: '1rem', textDecoration: 'none' }}>
                            👁️ View Store
                        </a>
                    )}
                    {publicUrl && (
                        <div className="public-url-box" style={{ marginTop: '1rem', padding: '1.5rem', background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)', borderRadius: '16px', border: '2px solid #c8e6c9' }}>
                            <p style={{ margin: '0 0 1rem 0', fontWeight: 'bold', color: '#2e7d32', fontSize: '1.1rem', textAlign: 'center' }}>✅ Your store is ready!</p>

                            {/* URL Section */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: '#1b5e20' }}>Store Link:</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input readOnly value={publicUrl} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #a5d6a7', background: 'white', fontSize: '0.9rem' }} />
                                    <button className="btn btn-secondary" onClick={() => { navigator.clipboard.writeText(publicUrl); alert('✅ URL copied to clipboard!'); }} style={{ padding: '0.75rem 1.5rem', whiteSpace: 'nowrap' }}>
                                        📋 Copy
                                    </button>
                                </div>
                                <a href={publicUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '0.5rem', color: '#2e7d32', textDecoration: 'underline', fontSize: '0.9rem' }}>👁️ Visit store →</a>
                            </div>

                            {/* QR Code Section */}
                            <div style={{ borderTop: '1px solid #c8e6c9', paddingTop: '1.5rem' }}>
                                <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: '600', color: '#1b5e20', textAlign: 'center' }}>QR Code to share:</p>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <StoreQRCode url={publicUrl} size={180} storeName={storeData.name} />
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </aside>

            {/* RIGHT PANEL */}
            <main className="preview-panel">
                <div className="device-toggle">
                    <button className={`device-btn ${viewMode === 'desktop' ? 'active' : ''}`} onClick={() => setViewMode('desktop')}>🖥 Desktop View</button>
                    <button className={`device-btn ${viewMode === 'mobile' ? 'active' : ''}`} onClick={() => setViewMode('mobile')}>📱 Mobile View</button>
                </div>
                <StorePreview data={storeData} products={products} viewMode={viewMode} />
            </main>
        </div>
    );
}

export default function BuilderPageEN() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BuilderContentEN />
        </Suspense>
    );
}
