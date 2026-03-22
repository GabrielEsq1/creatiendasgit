'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { StoreData, Product } from '@/lib/store-service';
import StoreViralFooter from '../StoreViralFooter';
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

// Fixed conversion rate COP -> USD
const COP_USD_RATE = 4000;

const formatPrice = (value: string | number) => {
    if (typeof value === 'undefined' || value === null) return '$0';
    // Remove dots/commas to ensure proper number parsing (common separators)
    const sanitized = typeof value === 'string' 
        ? value.replace(/\./g, '').replace(/,/g, '') 
        : value;
    const num = Number(sanitized || 0);
    // Automatic conversion for English version (COP to USD)
    const usdValue = num / COP_USD_RATE;
    return usdValue.toLocaleString("en-US", {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
};

export default function StorePreviewEN({ data, products, viewMode = 'desktop', readOnly = false }: StorePreviewProps) {
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

    // Sync selected product with URL for sharing
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

    // Build unique categories
    const categoryData = Array.isArray(products)
        ? Array.from(
            products.reduce((map, p) => {
                const category = p.category?.trim() || '';
                if (!category) return map;
                
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

    const handleNextProduct = useCallback(() => {
        if (!selectedProduct) return;
        const currentIndex = filteredProducts.findIndex(p => p.id === selectedProduct.id);
        const nextIndex = (currentIndex + 1) % filteredProducts.length;
        setSelectedProduct(filteredProducts[nextIndex]);
    }, [selectedProduct, filteredProducts]);

    const handlePrevProduct = useCallback(() => {
        if (!selectedProduct) return;
        const currentIndex = filteredProducts.findIndex(p => p.id === selectedProduct.id);
        const prevIndex = (currentIndex - 1 + filteredProducts.length) % filteredProducts.length;
        setSelectedProduct(filteredProducts[prevIndex]);
    }, [selectedProduct, filteredProducts]);

    const containerClass = readOnly
        ? 'store-live'
        : `store-preview-container ${viewMode === 'mobile' ? 'device-mobile' : ''}`;

    const renderMultiline = (text: string) => {
        if (!text) return null;
        return text.split('\n').map((line, i) => (
            <React.Fragment key={i}>
                {line}
                <br />
            </React.Fragment>
        ));
    };

    const HighlightMatch = ({ text, keywords }: { text: string; keywords: string[] }) => {
        if (!text || !keywords || keywords.length === 0) return <span>{text}</span>;

        const pattern = keywords
            .map(kw => kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) 
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
        setCurrentPage(1);
    };

    const cleanPhone = (phone: string | null | undefined) => (phone || '').replace(/\D/g, '');

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
                            <button className={`store-nav-item ${activeView === 'catalogo' ? 'active-view' : ''}`} onClick={() => setActiveView('catalogo')}>Catalog</button>
                            <button className={`store-nav-item ${activeView === 'about' ? 'active-view' : ''}`} onClick={() => setActiveView('about')}>About us</button>
                            <button className={`store-nav-item ${activeView === 'careers' ? 'active-view' : ''}`} onClick={() => setActiveView('careers')}>Work with us</button>
                        </div>
                    </div>
                </div>

                <header className="store-header" style={{
                    backgroundColor: data.color,
                    backgroundImage: data.heroBg ? `url(${data.heroBg})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}>
                    <div className="store-header-inner">
                        {data.logo && <img src={data.logo} alt="Logo" className="store-logo" />}
                        <div className="store-title">{data.title}</div>
                        <h1 className="store-name">{data.name}</h1>
                        <p className="store-desc">{data.desc}</p>
                    </div>
                </header>

                {activeView === 'catalogo' && (
                    <div className="view-section" style={{ display: 'block' }}>
                        {categoryData.length > 0 && (
                            <div className="store-categories">
                                <button
                                    key="all"
                                    className={`category-pill ${!activeCategory ? 'category-pill--active' : ''}`}
                                    onClick={() => handleCategoryClick(null)}
                                    style={!activeCategory ? { borderColor: data.color } : {}}
                                >
                                    <div className="category-icon category-icon--all" style={!activeCategory ? { background: data.color } : {}}>
                                        <span>✦</span>
                                    </div>
                                    <div className="category-label">All</div>
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
                                            <div className="category-icon" style={!image ? { background: data.color } : {}}>
                                                {image ? (
                                                    <img src={image} alt={display} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                                ) : (
                                                    <span style={{ color: '#fff' }}>{display[0].toUpperCase()}</span>
                                                )}
                                            </div>
                                            <div className="category-label" style={isActive ? { color: data.color, fontWeight: 700 } : {}}>{display}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        <div className="store-filters-search" ref={searchRef}>
                            <div className="store-search-wrapper">
                                <div className="store-search-inner">
                                    <svg className="store-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                                    </svg>
                                    <input
                                        type="text"
                                        className="store-search-input"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); setCurrentPage(1); }}
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
                                        <button className="store-search-clear" onClick={() => { setSearchQuery(''); setShowSuggestions(false); }} aria-label="Clear search" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                                    )}

                                    {showSuggestions && searchQuery.trim().length > 1 && searchQuery.length < 50 && (
                                        <div className="search-suggestions">
                                            {searchProducts(products, searchQuery, { limit: 6, threshold: 10 })
                                                .map(({ product, matchedKeywords }) => (
                                                    <button key={product.id} className="suggestion-item" onClick={() => { setSearchQuery(product.name || ''); setShowSuggestions(false); if (activeCategory && product.category?.toLowerCase() !== activeCategory) setActiveCategory(null); }}>
                                                        <div className="suggestion-img-wrap">
                                                            {product.image ? <img src={product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div className="suggestion-img-placeholder">🔍</div>}
                                                        </div>
                                                        <div className="suggestion-content">
                                                            <span className="suggestion-text"><HighlightMatch text={product.name} keywords={matchedKeywords} /></span>
                                                            <span className="suggestion-price">{formatPrice(product.price)}</span>
                                                        </div>
                                                        <span className="suggestion-cat-tag">{product.category || 'Various'}</span>
                                                    </button>
                                                ))
                                            }
                                            <div className="suggestion-footer">Results for "{searchQuery}"</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="store-products">
                            {filteredProducts.length === 0 ? (
                                <div className="store-empty-state"><span className="store-empty-icon">🔍</span><p>No products found</p><small>Try another name or category</small></div>
                            ) : (
                                <>
                                    {searchResults
                                        .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
                                        .map(({ product, matchedKeywords }, index) => (
                                            <div key={product.id} className="product-card">
                                                <div className="product-image" style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }} onClick={() => setSelectedProduct(product)}>
                                                    {product.image ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} loading={index < 4 ? "eager" : "lazy"} decoding="async" /> : <div style={{ color: '#ccc' }}>No Image</div>}
                                                </div>
                                                <div className="product-details">
                                                    <div className="product-category">{product.category}</div>
                                                    <div className="product-name" style={{ cursor: 'pointer' }} onClick={() => setSelectedProduct(product)}><HighlightMatch text={product.name} keywords={matchedKeywords} /></div>
                                                    <div className="product-desc"><HighlightMatch text={product.description} keywords={matchedKeywords} /></div>
                                                    <div className="product-price" suppressHydrationWarning>{formatPrice(product.price)}</div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                                                        <a
                                                            href={`https://wa.me/${cleanPhone(data.whatsapp)}?text=${encodeURIComponent(`Hello, I want to order this product:\n\n🛍️ *${product.name}*\nPrice: ${formatPrice(product.price)}\n\nSize / Color (if applicable): \n\nMy name is:\nAddress:\nPayment method:`)}`}
                                                            target="_blank" rel="noopener noreferrer" className="btn-whatsapp" style={{ backgroundColor: data.color || '#25D366', color: '#fff', textAlign: 'center', padding: '10px', borderRadius: '8px', fontWeight: 'bold' }}>
                                                            <span>📱</span> Buy now
                                                        </a>
                                                        <button
                                                            onClick={() => { 
                                                                const sanitizedPrice = typeof product.price === 'string' 
                                                                    ? product.price.replace(/\./g, '').replace(/,/g, '') 
                                                                    : product.price;
                                                                addItem({ id: String(product.id), name: product.name, price: Number(sanitizedPrice), image: product.image, quantity: 1, storeSlug: data.id ? String(data.id) : 'preview' }); trackEvent('add_to_cart', { product_name: product.name, price: product.price }); alert('Product added to cart 🛒'); 
                                                            }}
                                                            style={{ backgroundColor: 'transparent', color: data.color || '#333', border: `1.5px solid ${data.color || '#ccc'}`, textAlign: 'center', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                                                            Add to cart
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                    {filteredProducts.length > productsPerPage && (
                                        <div className="store-pagination" style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '40px', paddingBottom: '20px' }}>
                                            <button disabled={currentPage === 1} onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 300, behavior: 'smooth' }); }} className="pagination-btn" style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}>&larr;</button>
                                            {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }).map((_, i) => {
                                                const pageNum = i + 1;
                                                const isActive = currentPage === pageNum;
                                                const showPage = pageNum === 1 || pageNum === Math.ceil(filteredProducts.length / productsPerPage) || (pageNum >= currentPage - 2 && pageNum <= currentPage + 2);
                                                if (!showPage) { if (pageNum === currentPage - 3 || pageNum === currentPage + 3) return <span key={pageNum}>...</span>; return null; }
                                                return (
                                                    <button key={pageNum} onClick={() => { setCurrentPage(pageNum); window.scrollTo({ top: 300, behavior: 'smooth' }); }} style={{ width: '40px', height: '40px', borderRadius: '8px', border: isActive ? `2px solid ${data.color}` : '1px solid #ddd', background: isActive ? data.color : '#fff', color: isActive ? '#fff' : '#333', fontWeight: isActive ? 'bold' : 'normal', cursor: 'pointer' }}>{pageNum}</button>
                                                );
                                            })}
                                            <button disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)} onClick={() => { setCurrentPage(p => Math.min(Math.ceil(filteredProducts.length / productsPerPage), p + 1)); window.scrollTo({ top: 300, behavior: 'smooth' }); }} className="pagination-btn" style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', cursor: currentPage === Math.ceil(filteredProducts.length / productsPerPage) ? 'not-allowed' : 'pointer', opacity: currentPage === Math.ceil(filteredProducts.length / productsPerPage) ? 0.5 : 1 }}>&rarr;</button>
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
                                <p className="about-block-title">Who we are</p>
                                <h2 className="about-hero-title">{data.about?.heroTitle}</h2>
                                <p className="about-hero-subtitle">{renderMultiline(data.about?.heroSubtitle || '')}</p>
                                {data.about?.mission && (<div><p className="about-block-title">Our purpose / mission</p><p className="about-text">{data.about?.mission}</p></div>)}
                                {data.about?.vision && (<div><p className="about-block-title">Vision</p><p className="about-text">{data.about?.vision}</p></div>)}
                                {data.about?.values && data.about.values.length > 0 && (<div><p className="about-block-title">Values</p>{renderList(data.about.values, 'dot')}</div>)}
                                {data.about?.diff && data.about.diff.length > 0 && (<div><p className="about-block-title">What makes us different</p><ul className="about-diff-list">{data.about.diff.map((item, i) => <li key={i}>{item}</li>)}</ul></div>)}
                                {data.about?.team && (<div><p className="about-block-title">Team and culture</p><p className="about-text">{data.about?.team}</p></div>)}
                                <div className="about-cta">
                                    <button onClick={() => setActiveView('catalogo')} style={{ background: data.color, border: 'none', color: 'white', padding: '0.65rem 1.1rem', borderRadius: '999px', fontWeight: 600, cursor: 'pointer' }}>{data.about?.ctaText || 'Find out more'}</button>
                                </div>
                            </div>
                            {data.about?.timeline && data.about.timeline.length > 0 && (
                                <div><p className="about-block-title">Our history</p><div className="about-timeline">{data.about.timeline.map((item, i) => { const parts = item.split('—'); if (parts.length > 1) { return (<div key={i} className="about-timeline-item"><strong>{parts[0].trim()}</strong><span>{parts.slice(1).join('—').trim()}</span></div>); } return <div key={i} className="about-timeline-item"><span>{item}</span></div>; })}</div></div>
                            )}
                            {data.about?.gallery && data.about.gallery.length > 0 && (
                                <div className="about-gallery"><p className="about-gallery-title">Gallery</p><div className="about-gallery-grid">{data.about.gallery.map((img, i) => (<img key={i} src={img} alt={`Culture ${i}`} loading="lazy" onClick={() => setLightboxImage(img)} />))}</div></div>
                            )}
                        </div>
                    </section>
                )}

                {activeView === 'careers' && (
                    <section className="careers-section view-section" style={{ display: 'block' }}>
                        <div className="careers-inner">
                            <h2 className="careers-title">{data.careers?.title}</h2>
                            <p className="careers-desc">{data.careers?.desc}</p>
                            {data.careers?.benefits && data.careers.benefits.length > 0 && (<ul className="careers-benefits">{data.careers.benefits.map((b, i) => (<li key={i} style={{ '--primary-color': data.color } as any}>{b}</li>))}</ul>)}
                            <div className="careers-cta">
                                <a href={`https://wa.me/${cleanPhone(data.whatsapp || '')}?text=${encodeURIComponent('Hello, I\'m interested in working with you.')}`} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: data.color }}><span>💼</span> {data.careers?.ctaText || 'Work with us'}</a>
                            </div>
                        </div>
                    </section>
                )}

                <footer className="store-footer">
                    <div className="footer-inner">
                        <div className="footer-column footer-brand">
                            <div className="footer-logo-circle" style={{ borderColor: data.color, color: data.color }}>
                                {data.logo ? (<div className="footer-logo-img-wrap"><img src={data.logo} alt="Logo" loading="lazy" /></div>) : (data.name ? data.name.substring(0, 1).toUpperCase() : 'T')}
                            </div>
                        </div>
                        <div className="footer-column">
                            <h4>About us</h4>
                            <ul>
                                <li><button onClick={() => setActiveView('about')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, fontSize: 'inherit' }}>Who we are</button></li>
                                <li><button onClick={() => setActiveView('catalogo')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, fontSize: 'inherit' }}>Our products</button></li>
                                <li><button onClick={() => setActiveView('careers')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, fontSize: 'inherit' }}>Work with us</button></li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h4>Promotions</h4>
                            <ul>
                                <li><a href="#">Promotions</a></li>
                                <li><a href="#">New arrivals</a></li>
                                <li><a href="#">Online store</a></li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h4>Contact</h4>
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
                        &copy; {new Date().getFullYear()} {data.name} - Auto-generated store
                    </div>
                </footer>
                <StoreViralFooter />
            </div>

            <FloatingCartButton storeSlug={data.id || 'preview'} styleColor={data.color} />
            <CartDrawer lang="en" storeSlug={data.id || 'preview'} storeName={data.name || 'Store'} whatsapp={data.whatsapp || ''} styleColor={data.color} />

            {selectedProduct && (
                <div className="product-detail-overlay" onClick={() => setSelectedProduct(null)}>
                    <div className="product-detail-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="product-detail-close" onClick={() => setSelectedProduct(null)}>×</button>
                        <div className="product-detail-image-side">
                            {selectedProduct.image ? <img src={selectedProduct.image} alt={selectedProduct.name} /> : <div style={{ color: '#ccc' }}>No Image</div>}
                            <button className="nav-arrow prev-arrow" onClick={handlePrevProduct}>&larr;</button>
                            <button className="nav-arrow next-arrow" onClick={handleNextProduct}>&rarr;</button>
                        </div>
                        <div className="product-detail-info-side">
                            <div className="detail-category">{selectedProduct.category}</div>
                            <h2 className="detail-name">{selectedProduct.name}</h2>
                            <div className="detail-price">{formatPrice(selectedProduct.price)}</div>
                            <div className="detail-desc">{renderMultiline(selectedProduct.description || '')}</div>
                            <div className="detail-actions">
                                <a href={`https://wa.me/${cleanPhone(data.whatsapp)}?text=${encodeURIComponent(`Hello, I want to order this product:\n\n🛍️ *${selectedProduct.name}*\nPrice: ${formatPrice(selectedProduct.price)}\n\nSize / Color (if applicable): \n\nMy name is:\nAddress:\nPayment method:`)}`} target="_blank" rel="noopener noreferrer" className="btn-detail-cart" style={{ backgroundColor: data.color }}>
                                    <span>📱</span> Order on WhatsApp
                                </a>
                                <button className="btn-detail-cart" style={{ background: 'transparent', color: data.color, border: `2px solid ${data.color}` }} onClick={() => { 
                                    const sanitizedPrice = typeof selectedProduct.price === 'string' 
                                        ? selectedProduct.price.replace(/\./g, '').replace(/,/g, '') 
                                        : selectedProduct.price;
                                    addItem({ id: String(selectedProduct.id), name: selectedProduct.name, price: Number(sanitizedPrice), image: selectedProduct.image, quantity: 1, storeSlug: data.id ? String(data.id) : 'preview' }); alert('Added to cart 🛒'); 
                                }}>
                                    Add to cart
                                </button>
                                <button className="btn-detail-close-mobile" onClick={() => setSelectedProduct(null)}>Back to catalog</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
