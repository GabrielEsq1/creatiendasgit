"use client";

import React, { useState } from 'react';
import { StoreData, Product } from '@/lib/store-service';

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

    const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

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
                                {uniqueCategories.map(cat => (
                                    <div key={cat} className="category-pill">
                                        <div className="category-icon">
                                            <span>{cat[0].toUpperCase()}</span>
                                        </div>
                                        <div className="category-label">{cat}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* PRODUCTS */}
                        <div className="store-products">
                            {products.map(product => (
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
                                        <div className="product-name">{product.name}</div>
                                        <div className="product-desc">{product.description}</div>
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
