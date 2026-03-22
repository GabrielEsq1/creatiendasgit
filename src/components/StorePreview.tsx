'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { StoreData, Product } from '@/lib/store-service';
import StoreViralFooter from './StoreViralFooter';
import { useAnalytics } from '@/components/Analytics';
import FloatingCartButton from '@/components/store/FloatingCartButton';
import CartDrawer from '@/components/store/CartDrawer';
import { useCartStore } from '@/store/cartStore';
import { searchProducts, SearchResult } from '@/lib/search-engine';

interface StorePreviewProps {
    data: StoreData;
    products: Product[];
    viewMode?: 'desktop' | 'mobile';
    readOnly?: boolean;
}

const formatPrice = (value: string | number, storeCurrency: 'COP' | 'USD' = 'COP') => {
    if (typeof value === 'undefined' || value === null) return '0';
    // Remove dots/commas to ensure proper number parsing
    const sanitized = typeof value === 'string' 
        ? value.replace(/\./g, '').replace(/,/g, '') 
        : value;
    let num = Number(sanitized || 0);

    // If the base currency is USD, we convert it to COP for the Spanish version
    if (storeCurrency === 'USD') {
        num = num * 4000;
    }

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
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = React.useRef<HTMLDivElement>(null);

    // Handle clicks outside search area
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 24;
    const { trackEvent } = useAnalytics();
    const { addItem } = useCartStore();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Sync selected product with URL for sharing (only on public pages)
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('p');
        
        if (productId && products.length > 0) {
            const found = products.find(p => String(p.id) === productId);
            if (found) setSelectedProduct(found);
        }
    }, [products]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const url = new URL(window.location.href);
        if (selectedProduct) {
            url.searchParams.set('p', String(selectedProduct.id));
        } else {
            url.searchParams.delete('p');
        }
        window.history.replaceState({}, '', url.toString());
    }, [selectedProduct]);

    // Build unique categories (CASE-INSENSITIVE grouping)
    // We group by normalized name but keep the first version we found for display
    const categoryData = Array.isArray(products)
        ? Array.from(
            products.reduce((map, p) => {
                const category = p.category?.trim() || '';
                if (!category) return map;
                
                // Aggressive normalization for the key
                const key = category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                if (!map.has(key)) {
                    map.set(key, { 
                        display: category, 
                        image: p.image || null,
                        originalKey: key
                    });
                }
                return map;
            }, new Map<string, { display: string; image: string | null; originalKey: string }>()),
            ([key, data]) => ({ ...data })
        )
        : [];

    // Advanced search results
    const searchResults = React.useMemo(() => {
        if (!Array.isArray(products)) return [];

        const categoryFiltered = !activeCategory 
            ? products 
            : products.filter(p => {
                const pCat = p.category?.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                return pCat === activeCategory;
            });

        return searchProducts(categoryFiltered, searchQuery, {
            boostBySales: true,
            boostByViews: true
        });
    }, [products, searchQuery, activeCategory]);

    const filteredProducts = searchResults.map(r => r.product);

    // When readOnly=true (live public store), use 'store-live' class - completely unconstrained.
    // When in builder preview, use 'store-preview-container' with its card/frame visuals.
    const containerClass = readOnly
        ? 'store-live'
        : `store-preview-container ${viewMode === 'mobile' ? 'device-mobile' : ''}`;


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

    // Helper for keyword highlighting
    const HighlightMatch = ({ text, keywords }: { text: string; keywords: string[] }) => {
        if (!text || !keywords || keywords.length === 0) return <span>{text}</span>;

        // Create regex for all keywords
        const pattern = keywords
            .map(kw => kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // escape regex chars
            .join('|');
        if (!pattern) return <span>{text}</span>;

        const regex = new RegExp(`(${pattern})`, 'gi');
        const parts = text.split(regex);

        return (
            <span>
                {parts.map((part, i) => (
                    regex.test(part) ? (
                        <mark key={i} style={{ background: `${data.color}22`, color: data.color, fontWeight: 700, padding: '0 2px', borderRadius: '2px' }}>
                            {part}
                        </mark>
                    ) : part
                ))}
            </span>
        );
    };

    // Helper to handle line breaks in textareas
    // ... rest of the file

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


    const handleCategoryClick = (catKey: string | null) => {
        setActiveCategory(catKey);
        setSearchQuery(''); 
        setCurrentPage(1); // Reset page on filter change
        trackEvent('click', {
            action: 'category_filter_click',
            category: catKey || 'all',
            store_name: data.name
        });
        if (process.env.NODE_ENV === 'development') {
            console.log('Filtering by category key:', catKey);
        }
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
                ...(readOnly ? {} : {
                    maxWidth: viewMode === 'mobile' ? '430px' : 'none',
                    margin: '0 auto',
                    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.08)',
                    borderRadius: '24px',
                }),
                width: '100%',
                fontFamily: data.font || 'Inter, sans-serif',
                '--border-radius': data?.borderRadius || '8px',
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

                                {categoryData.map(({ originalKey, display, image }) => {
                                    const isActive = activeCategory === originalKey;
                                    return (
                                        <button
                                            key={originalKey}
                                            className={`category-pill ${isActive ? 'category-pill--active' : ''}`}
                                            onClick={() => handleCategoryClick(isActive ? null : originalKey)}
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
                        <div className="store-filters-search" ref={searchRef}>
                        <div className="store-search-wrapper">
                            <div className="store-search-inner">
                                <svg className="store-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.35-4.35" />
                                </svg>
                                <input
                                    type="text"
                                    className="store-search-input"
                                    placeholder="Busca en el catálogo..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setShowSuggestions(true);
                                        setCurrentPage(1);
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            setShowSuggestions(false);
                                            (e.target as HTMLInputElement).blur();
                                        }
                                    }}
                                    autoComplete="off"
                                />
                                {searchQuery && (
                                    <button
                                        className="store-search-clear"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setShowSuggestions(false);
                                        }}
                                        aria-label="Limpiar búsqueda"
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        ×
                                    </button>
                                )}

                                {/* Suggestions Dropdown (Store-wide search) */}
                                {showSuggestions && searchQuery.trim().length > 1 && searchQuery.length < 50 && (
                                    <div className="search-suggestions">
                                        {searchProducts(products, searchQuery, { limit: 6, threshold: 10 })
                                            .map(({ product, matchedKeywords }) => (
                                                <button
                                                    key={product.id}
                                                    className="suggestion-item"
                                                    onClick={() => {
                                                        setSearchQuery(product.name || '');
                                                        setShowSuggestions(false);
                                                        // Normalize for comparison
                                                        const pCatKey = (product.category || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                                                        if (activeCategory && pCatKey !== activeCategory) {
                                                            setActiveCategory(null);
                                                        }
                                                        trackEvent('click', { action: 'autocomplete_select', item: product.name });
                                                    }}
                                                >
                                                    <div className="suggestion-img-wrap">
                                                        {product.image ? (
                                                            <img src={product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        ) : (
                                                            <div className="suggestion-img-placeholder">🔍</div>
                                                        )}
                                                    </div>
                                                    <div className="suggestion-content">
                                                        <span className="suggestion-text">
                                                            <HighlightMatch text={product.name} keywords={matchedKeywords} />
                                                        </span>
                                                        <span className="suggestion-price">{formatPrice(product.price, data.currency)}</span>
                                                    </div>
                                                    <span className="suggestion-cat-tag">{product.category || 'Varios'}</span>
                                                </button>
                                            ))
                                        }
                                        <div className="suggestion-footer">
                                            Resultados para "{searchQuery}"
                                        </div>
                                    </div>
                                )}
                            </div>
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
                                <>
                                    {searchResults
                                        .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
                                        .map(({ product, matchedKeywords }, index) => (
                                            <div key={product.id} className="product-card">
                                                <div
                                                    className="product-image"
                                                    style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
                                                    onClick={() => setSelectedProduct(product)}
                                                >
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
                                                    <div
                                                        className="product-name"
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => setSelectedProduct(product)}
                                                    >
                                                        <HighlightMatch text={product.name} keywords={matchedKeywords} />
                                                    </div>
                                                    <div className="product-desc">
                                                        <HighlightMatch text={product.description} keywords={matchedKeywords} />
                                                    </div>
                                                    <div className="product-price" suppressHydrationWarning>{formatPrice(product.price, data.currency)}</div>

                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                                                        <a
                                                            href={`https://wa.me/${cleanPhone(data.whatsapp)}?text=${encodeURIComponent(`Hola, quiero este producto:\n\n🛍️ *${product.name}*\nPrecio: ${formatPrice(product.price, data.currency)}\n\nTalla / Color (si aplica): \n\nMi nombre es:\nDirección:\nMétodo de pago:`)}`}
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
                                                                const sanitizedPrice = typeof product.price === 'string' 
                                                                    ? product.price.replace(/\./g, '').replace(/,/g, '') 
                                                                    : product.price;
                                                                addItem({
                                                                    id: String(product.id),
                                                                    name: product.name,
                                                                    price: Number(sanitizedPrice),
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
                                        ))}

                                    {/* Numbered Pagination Control */}
                                    {filteredProducts.length > productsPerPage && (
                                        <div className="store-pagination" style={{
                                            gridColumn: '1 / -1',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            gap: '8px',
                                            marginTop: '40px',
                                            paddingBottom: '20px'
                                        }}>
                                            <button
                                                disabled={currentPage === 1}
                                                onClick={() => {
                                                    setCurrentPage(p => Math.max(1, p - 1));
                                                    window.scrollTo({ top: 300, behavior: 'smooth' });
                                                }}
                                                className="pagination-btn"
                                                style={{
                                                    padding: '8px 12px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #ddd',
                                                    background: '#fff',
                                                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                                    opacity: currentPage === 1 ? 0.5 : 1
                                                }}
                                            >
                                                &larr;
                                            </button>

                                            {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }).map((_, i) => {
                                                const pageNum = i + 1;
                                                const isActive = currentPage === pageNum;
                                                
                                                // Responsive: only show close pages
                                                const showPage = pageNum === 1 || pageNum === Math.ceil(filteredProducts.length / productsPerPage) || (pageNum >= currentPage - 2 && pageNum <= currentPage + 2);

                                                if (!showPage) {
                                                    if (pageNum === currentPage - 3 || pageNum === currentPage + 3) return <span key={pageNum}>...</span>;
                                                    return null;
                                                }

                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => {
                                                            setCurrentPage(pageNum);
                                                            window.scrollTo({ top: 300, behavior: 'smooth' });
                                                        }}
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            borderRadius: '8px',
                                                            border: isActive ? `2px solid ${data.color}` : '1px solid #ddd',
                                                            background: isActive ? data.color : '#fff',
                                                            color: isActive ? '#fff' : '#333',
                                                            fontWeight: isActive ? 'bold' : 'normal',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}

                                            <button
                                                disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
                                                onClick={() => {
                                                    setCurrentPage(p => Math.min(Math.ceil(filteredProducts.length / productsPerPage), p + 1));
                                                    window.scrollTo({ top: 300, behavior: 'smooth' });
                                                }}
                                                className="pagination-btn"
                                                style={{
                                                    padding: '8px 12px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #ddd',
                                                    background: '#fff',
                                                    cursor: currentPage === Math.ceil(filteredProducts.length / productsPerPage) ? 'not-allowed' : 'pointer',
                                                    opacity: currentPage === Math.ceil(filteredProducts.length / productsPerPage) ? 0.5 : 1
                                                }}
                                            >
                                                &rarr;
                                            </button>
                                        </div>
                                    )}
                                </>
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

            {/* Cart System */}
            <FloatingCartButton storeSlug={data.id || 'preview'} styleColor={data.color} />
            <CartDrawer lang="es" storeCurrency={data.currency} storeSlug={data.id || 'preview'} storeName={data.name || 'Tienda'} whatsapp={data.whatsapp || ''} styleColor={data.color} />

            {/* PRODUCT DETAIL MODAL */}
            {selectedProduct && (
                <div className="product-detail-overlay" onClick={() => setSelectedProduct(null)}>
                    <div className="product-detail-modal" onClick={(e) => e.stopPropagation()}>
                        <button 
                            className="product-detail-close" 
                            onClick={() => setSelectedProduct(null)}
                            style={{
                                position: 'absolute',
                                right: '12px',
                                top: '12px',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'white',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px',
                                zIndex: 10,
                                border: 'none',
                                cursor: 'pointer',
                                color: '#333'
                            }}
                        >
                            &times;
                        </button>
                        
                        <div className="product-detail-image-side">
                            <div className="product-gallery-container flex flex-col gap-4">
                                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                                    <>
                                        <div className="main-image-wrapper relative aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                                            <img src={(selectedProduct as any).activeImage || selectedProduct.images[0]} alt={selectedProduct.name} className="w-full h-full object-cover transition-all duration-300" />
                                        </div>
                                        {selectedProduct.images.length > 1 && (
                                            <div className="thumbnails-grid grid grid-cols-5 gap-2">
                                                {selectedProduct.images.map((img, i) => (
                                                    <button 
                                                        key={i} 
                                                        onClick={() => setSelectedProduct({ ...selectedProduct, activeImage: img } as any)}
                                                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                                            ((selectedProduct as any).activeImage || selectedProduct.images[0]) === img ? 'border-green-500 scale-95' : 'border-transparent hover:border-gray-300'
                                                        }`}
                                                    >
                                                        <img src={img} alt={`${selectedProduct.name} ${i}`} className="w-full h-full object-cover" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="main-image-wrapper relative aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
                                        {selectedProduct.image ? (
                                            <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div style={{ color: '#ccc' }}>Sin Imagen</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="product-detail-info-side">
                            <span className="detail-category" style={{ color: data.color }}>{selectedProduct.category}</span>
                            <h2 className="detail-name">{selectedProduct.name}</h2>
                            <div className="detail-price" style={{ color: data.color }}>{formatPrice(selectedProduct.price, data.currency)}</div>
                            <p className="detail-desc">{selectedProduct.description}</p>
                            
                            <div className="detail-actions">
                                <a
                                    href={`https://wa.me/${cleanPhone(data.whatsapp)}?text=${encodeURIComponent(`Hola, quiero este producto:\n\n🛍️ *${selectedProduct.name}*\nPrecio: ${formatPrice(selectedProduct.price, data.currency)}\n\nTalla / Color (si aplica): \n\nMi nombre es:\nDirección:\nMétodo de pago:`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ 
                                        backgroundColor: data.color || '#25D366', 
                                        color: '#fff', 
                                        textAlign: 'center', 
                                        padding: '16px', 
                                        borderRadius: '12px', 
                                        fontWeight: 'bold',
                                        textDecoration: 'none',
                                        display: 'block'
                                    }}
                                    onClick={() => {
                                        trackEvent('whatsapp_open', {
                                            product_name: selectedProduct.name,
                                            store_name: data.name,
                                            price: selectedProduct.price
                                        });
                                    }}
                                >
                                    <span>📱</span> Comprar ahora
                                </a>
                                <button 
                                    onClick={() => {
                                        const sanitizedPrice = typeof selectedProduct.price === 'string' 
                                            ? selectedProduct.price.replace(/\./g, '').replace(/,/g, '') 
                                            : selectedProduct.price;
                                        addItem({
                                            id: String(selectedProduct.id),
                                            name: selectedProduct.name,
                                            price: Number(sanitizedPrice),
                                            image: (selectedProduct as any).activeImage || (selectedProduct.images && selectedProduct.images[0]) || selectedProduct.image,
                                            quantity: 1,
                                            storeSlug: data.id ? String(data.id) : 'preview'
                                        });
                                        trackEvent('add_to_cart', {
                                            product_name: selectedProduct.name,
                                            price: selectedProduct.price,
                                            source: 'modal'
                                        });
                                        alert('¡Agregado al carrito! 🛒');
                                    }}
                                    style={{
                                        backgroundColor: 'transparent',
                                        color: data.color || '#333',
                                        border: `2px solid ${data.color || '#ccc'}`,
                                        textAlign: 'center',
                                        padding: '16px',
                                        borderRadius: '12px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        width: '100%'
                                    }}
                                >
                                    Agregar al carrito
                                </button>
                                <button 
                                    onClick={() => setSelectedProduct(null)}
                                    style={{
                                        backgroundColor: '#f3f4f6',
                                        color: '#666',
                                        border: 'none',
                                        textAlign: 'center',
                                        padding: '12px',
                                        borderRadius: '12px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        width: '100%',
                                        marginTop: '12px',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    Volver al catálogo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
