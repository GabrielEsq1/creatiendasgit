"use client";

import React from 'react';
import { StoreData, Product } from '@/lib/store-service';

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

    return (
        <div className={containerClass} style={{ maxWidth: viewMode === 'mobile' ? '430px' : '100%' }}>
            {/* TOPBAR */}
            <div className="store-topbar">
                <div className="store-topbar-inner">
                    <div className="topbar-left">
                        <div className="topbar-logo-small" style={{ borderColor: data.color, color: data.color }}>
                            {data.logo ? (
                                <img src={data.logo} alt="Logo" />
                            ) : (
                                data.name.substring(0, 2).toUpperCase()
                            )}
                        </div>
                        <div className="topbar-store-name">{data.name}</div>
                    </div>
                    <div className="topbar-right">
                        <button className="store-nav-item active-view">Catálogo</button>
                        <button className="store-nav-item">Nosotros</button>
                        <button className="store-nav-item">Empleo</button>
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

            {/* CATEGORIES */}
            <div className="store-categories">
                {/* Extract unique categories */}
                {Array.from(new Set(products.map(p => p.category))).map(cat => (
                    <div key={cat} className="category-pill">
                        <div className="category-icon">
                            <span>{cat[0].toUpperCase()}</span>
                        </div>
                        <div className="category-label">{cat}</div>
                    </div>
                ))}
            </div>

            {/* PRODUCTS */}
            <div className="store-products">
                {products.map(product => (
                    <div key={product.id} className="product-card">
                        <div className="product-image">
                            {product.image ? (
                                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <i className="fa-solid fa-image" style={{ fontSize: '2rem' }}></i>
                            )}
                        </div>
                        <div className="product-details">
                            <div className="product-category">{product.category}</div>
                            <div className="product-name">{product.name}</div>
                            <div className="product-desc">{product.description}</div>
                            <div className="product-price" suppressHydrationWarning>${formatPrice(product.price)}</div>

                            <a
                                href={`https://wa.me/${data.whatsapp}?text=Hola, quiero pedir: ${product.name}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-whatsapp"
                                style={{ backgroundColor: data.color }}
                            >
                                <i className="fa-brands fa-whatsapp"></i> Pedir
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* ABOUT SECTION */}
            <section className="about-section">
                <div className="about-inner">
                    <h2 className="about-hero-title">{data.about.heroTitle}</h2>
                    <p className="about-hero-subtitle">{renderMultiline(data.about.heroSubtitle)}</p>

                    {data.about.mission && (
                        <div>
                            <div className="about-block-title">Misión</div>
                            <p className="about-text">{data.about.mission}</p>
                        </div>
                    )}

                    {data.about.values.length > 0 && (
                        <div>
                            <div className="about-block-title">Nuestros Valores</div>
                            {renderList(data.about.values, 'dot')}
                        </div>
                    )}

                    {data.about.gallery.length > 0 && (
                        <div className="about-gallery">
                            <div className="about-gallery-title">Galería</div>
                            <div className="about-gallery-grid">
                                {data.about.gallery.map((img, i) => (
                                    <img key={i} src={img} alt={`Gallery ${i}`} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* CAREERS SECTION */}
            <section className="careers-section">
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
                        <a href="#" style={{ backgroundColor: data.color }}>
                            <i className="fa-brands fa-whatsapp"></i> {data.careers.ctaText}
                        </a>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="store-footer">
                <div className="footer-inner">
                    <div className="footer-brand">
                        <div className="footer-logo-circle" style={{ borderColor: data.color, color: data.color }}>
                            {data.logo ? <img src={data.logo} alt="Logo" style={{ borderRadius: '50%' }} /> : data.name.substring(0, 1)}
                        </div>
                    </div>

                    <div className="footer-column">
                        <h4>Contacto</h4>
                        <div className="store-contact">
                            {data.socials.email && <p><i className="fa-regular fa-envelope"></i> {data.socials.email}</p>}
                            {data.socials.phone && <p><i className="fa-solid fa-phone"></i> {data.socials.phone}</p>}
                        </div>
                        <div className="store-socials">
                            {data.socials.instagram && <a href={data.socials.instagram}><i className="fa-brands fa-instagram"></i></a>}
                            {data.socials.facebook && <a href={data.socials.facebook}><i className="fa-brands fa-facebook"></i></a>}
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    &copy; {new Date().getFullYear()} {data.name}. Creado con StoreBuilder.
                </div>
            </footer>
        </div>
    );
}
