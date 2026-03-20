'use client';

import React, { useState } from 'react';
import { StoreData, Product } from '@/lib/store-service';
import StoreViralFooter from './StoreViralFooter';
import { useAnalytics } from '@/components/Analytics';
import FloatingCartButton from '@/components/store/FloatingCartButton';
import CartDrawer from '@/components/store/CartDrawer';
import { useCartStore } from '@/store/cartStore';

interface StorePreviewProps {
    data: StoreData;
    products: Product[];
    viewMode?: 'desktop' | 'mobile';
    readOnly?: boolean;
}

const formatPrice = (value: string | number) => {
    const num = Number(value || 0);
    return num.toLocaleString("es-CO", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
};

export default function StorePreview({ data, products, viewMode = 'desktop', readOnly = false }: StorePreviewProps) {
    const [activeView, setActiveView] = useState<'catalogo' | 'about' | 'careers'>('catalogo');
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { trackEvent } = useAnalytics();
    const { addItem } = useCartStore();

    const containerClass = `store-preview-container ${viewMode === 'mobile' ? 'device-mobile' : ''}`;

    // Helper to handle line breaks in textareas
    const renderMultiline = (text: string) => {
        if (!text) return null;
        return text.split('\n').map((line, i) => (
            <React.Fragment key={i}>
                {line}
                <br />
            </React.Fragment>
        ));
    };

    // Helper for lists
    const renderList = (items: string[], iconClass: string) => {
        if (!items || items.length === 0) return null;
        return (
            <ul className={iconClass === 'check' ? 'careers-benefits' : 'about-values-list'}>
                {items.map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
            </ul>
        );
    };

    // Build unique categories (CASE-INSENSITIVE grouping)
    // We group by lowercased name but keep the first version we found for display
    const categoryData = Array.isArray(products)
        ? Array.from(
            products.reduce((map, p) => {
                const category = p.category?.trim() || '';
                if (!category) return map;
                
                const key = category.toLowerCase();
                if (!map.has(key)) {
                    map.set(key, { 
                        display: category, 
                        image: p.image || null 
                    });
                }
                return map;
            }, new Map<string, { display: string; image: string | null }>()),
            ([key, data]) => ({ key, ...data })
        )
        : [];

    // Combined filter: category + intelligent multi-term search query
    const filteredProducts = Array.isArray(products)
        ? products
            .filter(p => !activeCategory || p.category?.toLowerCase() === activeCategory)
            .filter(p => {
                if (!searchQuery.trim()) return true;

                // Split query into individual terms for "intelligent" multi-word search
                const terms = searchQuery.toLowerCase().trim().split(/\s+/);
                const searchStr = `${p.name || ''} ${p.description || ''} ${p.category || ''}`.toLowerCase();

                // All terms must be present somewhere in the product string
                return terms.every(term => searchStr.includes(term));
            })
        : [];

    const handleCategoryClick = (catKey: string | null) => {
        setActiveCategory(catKey);
        trackEvent('click', {
            action: 'category_filter_click',
            category: catKey || 'all',
            store_name: data.name
        });
    };

    const cleanPhone = (phone: string | null | undefined) => (phone || '').replace(/\D/g, '');

    // OPTIMIZATION: Only load the font that is actually used
    const getGoogleFontUrl = (fontString: string | undefined) => {
        if (!fontString) return null;
        const fontName = fontString.split(',')[0].replace(/['"]/g, '').trim();
        const supported = ['Inter', 'Lato', 'Merriweather', 'Montserrat', 'Nunito', 'Open Sans', 'Oswald', 'Playfair Display', 'Poppins', 'Raleway', 'Roboto'];
        if (supported.includes(fontName)) {
            return `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@300;400;500;600;700&display=swap`;
        }
        return null;
    };

    const activeFontUrl = getGoogleFontUrl(data.font);

    return (
        <>
            {activeFontUrl && (
                <link href={activeFontUrl} rel="stylesheet" />
            )}

            <div className={containerClass} style={{
                maxWidth: viewMode === 'mobile' ? '430px' : 'none',
                width: '100%',
                fontFamily: data.font || 'Inter, sans-serif',
                '--border-radius': data?.borderRadius || '8px',
                margin: '0 auto'
            } as React.CSSProperties}>
                {/* TOPBAR */}
                <div className="store-topbar">
                    <div className="store-topbar-inner">
                        <div className="topbar-left">
                            <div className="topbar-logo-small" style={{ borderColor: data.color, color: data.color }}>
                                {data.logo ? (
                                    <img src={data.logo} alt="Logo" loading="lazy" width={36} height={36} />
                                ) : (
                                    data.name ? data.name.substring(0, 1).toUpperCase() : 'T'
                                )}
                            </div>
                            <div className="topbar-store-name">{data.name}</div>
                        </div>
                        <div className="topbar-right">
                            <button
                                className={`store-nav-item ${activeView === 'catalogo' ? 'active-view' : ''}`}
                                onClick={() => setActiveView('catalogo')}
                            >
                                Catálogo
                            </button>
                            <button
                                className={`store-nav-item ${activeView === 'about' ? 'active-view' : ''}`}
                                onClick={() => setActiveView('about')}
                            >
                                Sobre nosotros
                            </button>
                            <button
                                className={`store-nav-item ${activeView === 'careers' ? 'active-view' : ''}`}
                                onClick={() => setActiveView('careers')}
                            >
                                Trabaja con nosotros
                            </button>
                        </div>
                    </div>
                </div>

                {/* HERO */}
                <header
                    className="store-header"
                    style={{
                        backgroundColor: data.color,
                        backgroundImage: data.heroBg ? `url(${data.heroBg})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className="store-header-inner">
                        {data.logo && <img src={data.logo} alt="Logo" className="store-logo" />}
                        <div className="store-title">{data.title}</div>
                        <h1 className="store-name">{data.name}</h1>
                        <p className="store-desc">{data.desc}</p>
                    </div>
                </header>

                {/* CATALOG VIEW */}
                {activeView === 'catalogo' && (
                    <div className="view-section" style={{ display: 'block' }}>

                        {/* CATEGORY PILLS — interactive with product image */}
                        {categoryData.length > 0 && (
                            <div className="store-categories">
                                {/* "All" pill */}
                                <button
                                    key="all"
                                    className={`category-pill ${!activeCategory ? 'category-pill--active' : ''}`}
                                    onClick={() => handleCategoryClick(null)}
                                    style={!activeCategory ? { borderColor: data.color } : {}}
                                >
                                    <div className="category-icon category-icon--all" style={!activeCategory ? { background: data.color } : {}}>
                                        <span>✦</span>
                                    </div>
                                    <div className="category-label">Todos</div>
                                </button>

                                {categoryData.map(({ key, display, image }) => {
                                    const isActive = activeCategory === key;
                                    return (
                                        <button
                                            key={key}
                                            className={`category-pill ${isActive ? 'category-pill--active' : ''}`}
                                            onClick={() => handleCategoryClick(isActive ? null : key)}
                                            style={isActive ? { borderColor: data.color } : {}}
                                        >
                                            <div
                                                className="category-icon"
                                                style={!image ? { background: data.color } : {}}
                                            >
                                                {image ? (
                                                    <img
                                                        src={image}
                                                        alt={display}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                                                    />
                                                ) : (
                                                    <span style={{ color: '#fff' }}>{display[0].toUpperCase()}</span>
                                                )}
                                            </div>
                                            <div className="category-label" style={isActive ? { color: data.color, fontWeight: 700 } : {}}>
                                                {display}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* SEARCH BAR with Suggestions */}
                        <div className="store-search-wrapper" style={{ position: 'relative', zIndex: 10 }}>
                            <div className="store-search-inner">
                                <svg className="store-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.35-4.35" />
                                </svg>
                                <input
                                    type="text"
                                    className="store-search-input"
                                    placeholder="¿Qué estás buscando hoy?"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    autoComplete="off"
                                />
                                {searchQuery && (
                                    <button
                                        className="store-search-clear"
                                        onClick={() => setSearchQuery('')}
                                        aria-label="Limpiar búsqueda"
                                    >
                                        ×
                                    </button>
                                )}

                                {/* Suggestions Dropdown (Store-wide search) */}
                                {searchQuery.trim().length > 1 && searchQuery.length < 40 && (
                                    <div className="search-suggestions">
                                        {products
                                            .filter(p => {
                                                const q = searchQuery.toLowerCase().trim();
                                                const nameMatched = p.name?.toLowerCase().includes(q);
                                                const descMatched = p.description?.toLowerCase().includes(q);
                                                const catMatched = p.category?.toLowerCase().includes(q);
                                                return nameMatched || descMatched || catMatched;
                                            })
                                            .slice(0, 6)
                                            .map(p => (
                                                <button
                                                    key={p.id}
                                                    className="suggestion-item"
                                                    onClick={() => {
                                                        setSearchQuery(p.name);
                                                        // Auto-clear category if we selected a suggested product to ensure it shows up
                                                        if (activeCategory && p.category !== activeCategory) {
                                                            setActiveCategory(null);
                                                        }
                                                        trackEvent('click', { action: 'autocomplete_select', item: p.name });
                                                    }}
                                                >
                                                    <div className="suggestion-img-wrap">
                                                        {p.image ? <img src={p.image} alt="" /> : <span>🔍</span>}
                                                    </div>
                                                    <div className="suggestion-content">
                                                        <span className="suggestion-text">{p.name}</span>
                                                        <span className="suggestion-price">{data.currency || '$'}{formatPrice(p.price)}</span>
                                                    </div>
                                                    <span className="suggestion-cat-tag">{p.category}</span>
                                                </button>
                                            ))
                                        }
                                        {/* "Ver todos" option if results found but hidden from list */}
                                        <div className="suggestion-footer">
                                            Mostrando resultados para "{searchQuery}"
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* PRODUCTS GRID */}
                        <div className="store-products">
                            {filteredProducts.length === 0 ? (
                                <div className="store-empty-state">
                                    <span className="store-empty-icon">🔍</span>
                                    <p>No encontramos productos</p>
                                    <small>Intenta con otro nombre o categoría</small>
                                </div>
                            ) : (
                                filteredProducts.map((product, index) => (
                                    <div key={product.id} className="product-card">
                                        <div className="product-image" style={{ position: 'relative', overflow: 'hidden' }}>
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                    loading={index < 4 ? "eager" : "lazy"}
                                                    decoding="async"
                                                />
                                            ) : (
                                                <div style={{ color: '#ccc' }}>Sin Imagen</div>
                                            )}
                                        </div>
                                        <div className="product-details">
                                            <div className="product-category">{product.category}</div>
                                            <div className="product-name">{product.name}</div>
                                            <div className="product-desc">{product.description}</div>
                                            <div className="product-price" suppressHydrationWarning>${formatPrice(product.price)}</div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                                                <a
                                                    href={`https://wa.me/${cleanPhone(data.whatsapp)}?text=${encodeURIComponent(`Hola, quiero este producto:\n\n🛍️ *${product.name}*\nPrecio: $${formatPrice(product.price)}\n\nMi nombre es:\nDirección:\nMétodo de pago:`)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn-whatsapp"
                                                    style={{ backgroundColor: data.color || '#25D366', color: '#fff', textAlign: 'center', padding: '10px', borderRadius: '8px', fontWeight: 'bold' }}
                                                    onClick={() => {
                                                        trackEvent('whatsapp_open', {
                                                            product_name: product.name,
                                                            store_name: data.name,
                                                            price: product.price
                                                        });
                                                    }}
                                                >
                                                    <span>📱</span> Comprar ahora
                                                </a>
                                                <button
                                                    onClick={() => {
                                                        addItem({
                                                            id: String(product.id),
                                                            name: product.name,
                                                            price: Number(product.price),
                                                            image: product.image,
                                                            quantity: 1,
                                                            storeSlug: data.id ? String(data.id) : 'preview'
                                                        });
                                                        trackEvent('add_to_cart', {
                                                            product_name: product.name,
                                                            price: product.price
                                                        });
                                                        alert('Producto agregado al carrito 🛒');
                                                    }}
                                                    style={{
                                                        backgroundColor: 'transparent',
                                                        color: data.color || '#333',
                                                        border: `1.5px solid ${data.color || '#ccc'}`,
                                                        textAlign: 'center',
                                                        padding: '10px',
                                                        borderRadius: '8px',
                                                        fontWeight: 'bold',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Agregar al carrito
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}


                {activeView === 'about' && (
                    <section className="about-section view-section" style={{ display: 'block' }}>
                        <div className="about-inner">
                            <div>
                                <p className="about-block-title">Quiénes somos</p>
                                <h2 className="about-hero-title">{data.about?.heroTitle}</h2>
                                <p className="about-hero-subtitle">{renderMultiline(data.about?.heroSubtitle || '')}</p>

                                {data.about?.mission && (
                                    <div>
                                        <p className="about-block-title">Nuestro propósito / misión</p>
                                        <p className="about-text">{data.about?.mission}</p>
                                    </div>
                                )}

                                {data.about?.vision && (
                                    <div>
                                        <p className="about-block-title">Visión</p>
                                        <p className="about-text">{data.about?.vision}</p>
                                    </div>
                                )}

                                {data.about?.values && data.about.values.length > 0 && (
                                    <div>
                                        <p className="about-block-title">Valores</p>
                                        {renderList(data.about.values, 'dot')}
                                    </div>
                                )}

                                {data.about?.diff && data.about.diff.length > 0 && (
                                    <div>
                                        <p className="about-block-title">Qué nos diferencia</p>
                                        <ul className="about-diff-list">
                                            {data.about.diff.map((item, i) => <li key={i}>{item}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {data.about?.team && (
                                    <div>
                                        <p className="about-block-title">Equipo y cultura</p>
                                        <p className="about-text">{data.about?.team}</p>
                                    </div>
                                )}

                                <div className="about-cta">
                                    <button onClick={() => setActiveView('catalogo')} style={{ background: data.color, border: 'none', color: 'white', padding: '0.65rem 1.1rem', borderRadius: '999px', fontWeight: 600, cursor: 'pointer' }}>
                                        {data.about?.ctaText || 'Conócenos más'}
                                    </button>
                                </div>
                            </div>

                            {data.about?.timeline && data.about.timeline.length > 0 && (
                                <div>
                                    <p className="about-block-title">Nuestra historia</p>
                                    <div className="about-timeline">
                                        {data.about.timeline.map((item, i) => {
                                            const parts = item.split('—');
                                            if (parts.length > 1) {
                                                return (
                                                    <div key={i} className="about-timeline-item">
                                                        <strong>{parts[0].trim()}</strong>
                                                        <span>{parts.slice(1).join('—').trim()}</span>
                                                    </div>
                                                );
                                            }
                                            return <div key={i} className="about-timeline-item"><span>{item}</span></div>;
                                        })}
                                    </div>
                                </div>
                            )}

                            {data.about?.gallery && data.about.gallery.length > 0 && (
                                <div className="about-gallery">
                                    <p className="about-gallery-title">Galería</p>
                                    <div className="about-gallery-grid">
                                        {data.about.gallery.map((img, i) => (
                                            <img
                                                key={i}
                                                src={img}
                                                alt={`Foto empresa ${i}`}
                                                loading="lazy"
                                                onClick={() => setLightboxImage(img)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {activeView === 'careers' && (
                    <section className="careers-section view-section" style={{ display: 'block' }}>
                        <div className="careers-inner">
                            <h2 className="careers-title">{data.careers?.title}</h2>
                            <p className="careers-desc">{data.careers?.desc}</p>
                            {data.careers?.benefits && data.careers.benefits.length > 0 && (
                                <ul className="careers-benefits">
                                    {data.careers.benefits.map((b, i) => (
                                        <li key={i} style={{ '--primary-color': data.color } as any}>{b}</li>
                                    ))}
                                </ul>
                            )}
                            <div className="careers-cta">
                                <a
                                    href={`https://wa.me/${cleanPhone(data.whatsapp || '')}?text=${encodeURIComponent('Hola, me interesa trabajar con ustedes.')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ backgroundColor: data.color }}
                                >
                                    <span>💼</span> {data.careers?.ctaText || 'Trabaja con nosotros'}
                                </a>
                            </div>
                        </div>
                    </section>
                )}

                {/* FOOTER */}
                <footer className="store-footer">
                    <div className="footer-inner">
                        <div className="footer-column footer-brand">
                            <div className="footer-logo-circle" style={{ borderColor: data.color, color: data.color }}>
                                {data.logo ? (
                                    <div className="footer-logo-img-wrap">
                                        <img src={data.logo} alt="Logo" loading="lazy" />
                                    </div>
                                ) : (
                                    data.name ? data.name.substring(0, 1).toUpperCase() : 'T'
                                )}
                            </div>
                        </div>
                        <div className="footer-column">
                            <h4>Sobre Nosotros</h4>
                            <ul>
                                <li><button onClick={() => setActiveView('about')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, fontSize: 'inherit' }}>Quiénes somos</button></li>
                                <li><button onClick={() => setActiveView('catalogo')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, fontSize: 'inherit' }}>Nuestros productos</button></li>
                                <li><button onClick={() => setActiveView('careers')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, fontSize: 'inherit' }}>Trabaja con nosotros</button></li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h4>Promociones</h4>
                            <ul>
                                <li><a href="#">Promociones</a></li>
                                <li><a href="#">Novedades</a></li>
                                <li><a href="#">Tienda online</a></li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h4>Contacto</h4>
                            <div className="store-contact">
                                {data.socials?.phone && <p>📞 {data.socials.phone}</p>}
                                {data.socials?.email && <p>✉️ {data.socials.email}</p>}
                            </div>
                            <div className="store-socials">
                                {data.socials?.instagram && <a href={data.socials.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>}
                                {data.socials?.facebook && <a href={data.socials.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>}
                                {data.socials?.tiktok && <a href={data.socials.tiktok} target="_blank" rel="noopener noreferrer">TikTok</a>}
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        &copy; {new Date().getFullYear()} {data.name} - Tienda generada automáticamente
                    </div>
                </footer>

                {/* VIRAL FOOTER - Converts store visitors into Creatiendas users */}
                <StoreViralFooter />
            </div>

            {/* Cart System */ }
            <FloatingCartButton storeSlug={data.id || 'preview'} styleColor={data.color} />
            {isCartOpenState => <CartDrawer storeSlug={data.id || 'preview'} storeName={data.name || 'Tienda'} whatsapp={data.whatsapp || ''} styleColor={data.color} />}
            <CartDrawer storeSlug={data.id || 'preview'} storeName={data.name || 'Tienda'} whatsapp={data.whatsapp || ''} styleColor={data.color} />

            {/* LIGHTBOX */}
            {lightboxImage && (
                <div id="galleryPopup" style={{ display: 'flex' }} onClick={() => setLightboxImage(null)}>
                    <span id="closePopup">&times;</span>
                    <div id="popupImageContainer">
                        <img id="popupImage" src={lightboxImage} alt="Vista ampliada" onClick={(e) => e.stopPropagation()} />
                    </div>
                </div>
            )}
        </>
    );
}
