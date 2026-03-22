"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { StoreData, Product } from '@/lib/store-service';
import { searchProducts } from '@/lib/search-engine';

interface StorePreviewProps {
    data: StoreData;
    products: Product[];
    viewMode?: 'desktop' | 'mobile';
    readOnly?: boolean;
}

const formatPrice = (value: string | number) => {
    const num = Number(value || 0);
    return num.toLocaleString("en-US", {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).replace('$', '$'); // Keeping $ symbol, formatting might need adjustment based on preference
};

export default function StorePreviewEN({ data, products, viewMode = 'desktop', readOnly = false }: StorePreviewProps) {
    const [activeView, setActiveView] = useState<'catalogo' | 'about' | 'careers'>('catalogo');
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
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

    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

    // Helper for keyword highlighting
    const HighlightMatch = ({ text, keywords }: { text: string; keywords: string[] }) => {
        if (!text || !keywords || keywords.length === 0) return <span>{text}</span>;
        const pattern = keywords.map(kw => kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
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

    const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

    const searchResults = useMemo(() => {
        if (!Array.isArray(products)) return [];
        const categoryFiltered = !activeCategory 
            ? products 
            : products.filter(p => p.category === activeCategory);
        return searchProducts(categoryFiltered, searchQuery, { boostBySales: true, boostByViews: true });
    }, [products, searchQuery, activeCategory]);

    const cleanPhone = (phone: string) => phone.replace(/\D/g, '');

    return (
        <>
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Lato:wght@400;700&family=Merriweather:wght@400;700&family=Montserrat:wght@400;600;700&family=Nunito:wght@400;600;700&family=Open+Sans:wght@400;600;700&family=Oswald:wght@400;600&family=Playfair+Display:wght@400;600;700&family=Poppins:wght@400;600;700&family=Raleway:wght@400;600;700&family=Roboto:wght@400;500;700&display=swap');
            `}</style>
            <div className={containerClass} style={{
                maxWidth: viewMode === 'mobile' ? '430px' : '100%',
                fontFamily: data.font || 'Inter, sans-serif',
                '--border-radius': data.borderRadius || '8px'
            } as React.CSSProperties}>
                {/* TOPBAR */}
                <div className="store-topbar">
                    <div className="store-topbar-inner">
                        <div className="topbar-left">
                            <div className="topbar-logo-small" style={{ borderColor: data.color, color: data.color }}>
                                {data.logo ? (
                                    <img src={data.logo} alt="Logo" />
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
                                Catalog
                            </button>
                            <button
                                className={`store-nav-item ${activeView === 'about' ? 'active-view' : ''}`}
                                onClick={() => setActiveView('about')}
                            >
                                About Us
                            </button>
                            <button
                                className={`store-nav-item ${activeView === 'careers' ? 'active-view' : ''}`}
                                onClick={() => setActiveView('careers')}
                            >
                                Work with Us
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

                {/* VIEWS */}
                {activeView === 'catalogo' && (
                    <div className="view-section" style={{ display: 'block' }}>
                        {/* CATEGORIES */}
                        {uniqueCategories.length > 0 && (
                            <div className="store-categories">
                                <button 
                                    className={`category-pill ${!activeCategory ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(null)}
                                    style={!activeCategory ? { borderColor: data.color, background: `${data.color}11` } : {}}
                                >
                                    All
                                </button>
                                {uniqueCategories.map(cat => (
                                    <button 
                                        key={cat} 
                                        className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                                        onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                                        style={activeCategory === cat ? { borderColor: data.color, background: `${data.color}11` } : {}}
                                    >
                                        <div className="category-label">{cat}</div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* SEARCH BAR */}
                        <div className="store-search-wrapper" style={{ margin: '1rem 0' }} ref={searchRef}>
                            <div className="store-search-inner" style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    className="store-search-input"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={e => {
                                        setSearchQuery(e.target.value);
                                        setShowSuggestions(true);
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            setShowSuggestions(false);
                                            (e.target as HTMLInputElement).blur();
                                        }
                                    }}
                                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: data.borderRadius || '8px', border: '1px solid #ccc' }}
                                />
                                {searchQuery && (
                                    <button 
                                        onClick={() => {
                                            setSearchQuery('');
                                            setShowSuggestions(false);
                                        }}
                                        style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                                    >
                                        &times;
                                    </button>
                                )}
                                
                                {/* Suggestions Dropdown */}
                                {showSuggestions && searchQuery.trim().length > 1 && searchQuery.length < 50 && (
                                    <div className="search-suggestions" style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 1000, padding: '0.5rem' }}>
                                        {searchProducts(products, searchQuery, { limit: 6, threshold: 10 })
                                            .map(({ product, matchedKeywords }) => (
                                                <button
                                                    key={product.id}
                                                    onClick={() => {
                                                        setSearchQuery(product.name || '');
                                                        setShowSuggestions(false);
                                                        if (activeCategory && product.category !== activeCategory) {
                                                            setActiveCategory(null);
                                                        }
                                                    }}
                                                    style={{ display: 'flex', width: '100%', padding: '0.5rem', alignItems: 'center', gap: '0.75rem', border: 'none', background: 'none', borderBottom: '1px solid #eee', cursor: 'pointer', textAlign: 'left' }}
                                                >
                                                    <div style={{ width: '40px', height: '40px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                                                        {product.image && <img src={product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                                            <HighlightMatch text={product.name} keywords={matchedKeywords} />
                                                        </div>
                                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>{product.category}</div>
                                                    </div>
                                                    <div style={{ fontSize: '0.9rem', color: data.color }}>{product.price}</div>
                                                </button>
                                            ))
                                        }
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* PRODUCTS */}
                        <div className="store-products">
                            {searchResults.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem' }}>No products found matching your search.</div>
                            ) : searchResults.map(({ product, matchedKeywords }) => (
                                <div key={product.id} className="product-card">
                                    <div className="product-image">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        ) : (
                                            <div style={{ color: '#ccc' }}>No Image</div>
                                        )}
                                    </div>
                                    <div className="product-details">
                                        <div className="product-category">{product.category}</div>
                                        <div className="product-name">
                                            <HighlightMatch text={product.name} keywords={matchedKeywords} />
                                        </div>
                                        <div className="product-desc">
                                            <HighlightMatch text={product.description} keywords={matchedKeywords} />
                                        </div>
                                        <div className="product-price" suppressHydrationWarning>{product.price}</div>

                                        <a
                                            href={`https://wa.me/${cleanPhone(data.whatsapp)}?text=${encodeURIComponent(`Hello, I want to order: ${product.name}`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-whatsapp"
                                            style={{ backgroundColor: data.color }}
                                        >
                                            <span>📱</span> Buy on WhatsApp
                                        </a>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeView === 'about' && (
                    <section className="about-section view-section" style={{ display: 'block' }}>
                        <div className="about-inner">
                            <div>
                                <p className="about-block-title">Who we are</p>
                                <h2 className="about-hero-title">{data.about.heroTitle}</h2>
                                <p className="about-hero-subtitle">{renderMultiline(data.about.heroSubtitle)}</p>

                                {data.about.mission && (
                                    <div>
                                        <p className="about-block-title">Our purpose / mission</p>
                                        <p className="about-text">{data.about.mission}</p>
                                    </div>
                                )}

                                {data.about.vision && (
                                    <div>
                                        <p className="about-block-title">Vision</p>
                                        <p className="about-text">{data.about.vision}</p>
                                    </div>
                                )}

                                {data.about.values.length > 0 && (
                                    <div>
                                        <p className="about-block-title">Values</p>
                                        {renderList(data.about.values, 'dot')}
                                    </div>
                                )}

                                {data.about.diff.length > 0 && (
                                    <div>
                                        <p className="about-block-title">What sets us apart</p>
                                        <ul className="about-diff-list">
                                            {data.about.diff.map((item, i) => <li key={i}>{item}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {data.about.team && (
                                    <div>
                                        <p className="about-block-title">Team and culture</p>
                                        <p className="about-text">{data.about.team}</p>
                                    </div>
                                )}

                                <div className="about-cta">
                                    <button onClick={() => setActiveView('catalogo')} style={{ background: data.color, border: 'none', color: 'white', padding: '0.65rem 1.1rem', borderRadius: '999px', fontWeight: 600, cursor: 'pointer' }}>
                                        {data.about.ctaText || 'Learn more'}
                                    </button>
                                </div>
                            </div>

                            {data.about.timeline.length > 0 && (
                                <div>
                                    <p className="about-block-title">Our History</p>
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

                            {data.about.gallery.length > 0 && (
                                <div className="about-gallery">
                                    <p className="about-gallery-title">Gallery</p>
                                    <div className="about-gallery-grid">
                                        {data.about.gallery.map((img, i) => (
                                            <img
                                                key={i}
                                                src={img}
                                                alt={`Company photo ${i}`}
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
                            <h2 className="careers-title">{data.careers.title}</h2>
                            <p className="careers-desc">{data.careers.desc}</p>
                            {data.careers.benefits.length > 0 && (
                                <ul className="careers-benefits">
                                    {data.careers.benefits.map((b, i) => (
                                        <li key={i} style={{ '--primary-color': data.color } as any}>{b}</li>
                                    ))}
                                </ul>
                            )}
                            <div className="careers-cta">
                                <a
                                    href={`https://wa.me/${cleanPhone(data.whatsapp)}?text=${encodeURIComponent('Hello, I am interested in working with you.')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ backgroundColor: data.color }}
                                >
                                    <span>💼</span> {data.careers.ctaText}
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
                                        <img src={data.logo} alt="Logo" />
                                    </div>
                                ) : (
                                    data.name ? data.name.substring(0, 1).toUpperCase() : 'T'
                                )}
                            </div>
                        </div>
                        <div className="footer-column">
                            <h4>About Us</h4>
                            <ul>
                                <li><button onClick={() => setActiveView('about')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, fontSize: 'inherit' }}>Who we are</button></li>
                                <li><button onClick={() => setActiveView('catalogo')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, fontSize: 'inherit' }}>Our Products</button></li>
                                <li><button onClick={() => setActiveView('careers')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, fontSize: 'inherit' }}>Work with Us</button></li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h4>Promotions</h4>
                            <ul>
                                <li><a href="#">Promotions</a></li>
                                <li><a href="#">News</a></li>
                                <li><a href="#">Online Store</a></li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h4>Contact</h4>
                            <div className="store-contact">
                                {data.socials.phone && <p>📞 {data.socials.phone}</p>}
                                {data.socials.email && <p>✉️ {data.socials.email}</p>}
                            </div>
                            <div className="store-socials">
                                {data.socials.instagram && <a href={data.socials.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>}
                                {data.socials.facebook && <a href={data.socials.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>}
                                {data.socials.tiktok && <a href={data.socials.tiktok} target="_blank" rel="noopener noreferrer">TikTok</a>}
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        &copy; {new Date().getFullYear()} {data.name} - Automatically generated store
                    </div>
                </footer>
            </div>

            {/* LIGHTBOX */}
            {lightboxImage && (
                <div id="galleryPopup" style={{ display: 'flex' }} onClick={() => setLightboxImage(null)}>
                    <span id="closePopup">&times;</span>
                    <div id="popupImageContainer">
                        <img id="popupImage" src={lightboxImage} alt="Expanded view" onClick={(e) => e.stopPropagation()} />
                    </div>
                </div>
            )}
        </>
    );
}
