'use client';

import React from 'react';
import styles from '../../app/enterprise/enterprise.module.css';

interface StoreSectionProps {
    onOpenWallet: () => void;
}

export default function StoreSection({ onOpenWallet }: StoreSectionProps) {
    const addToCart = (productName: string) => {
        alert(`🛒 ${productName}\n\n¡Agregado al carrito exitosamente!`);
    };

    const buyNow = (productName: string, price: number) => {
        const formattedPrice = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(price);

        const confirm = window.confirm(
            `💳 Confirmar compra\n\n` +
            `Producto: ${productName}\n` +
            `Precio: ${formattedPrice}\n\n` +
            `¿Deseas pagar con tu Monedero?`
        );

        if (confirm) {
            onOpenWallet();
            setTimeout(() => {
                alert(`✅ ¡Compra exitosa!\n\n${productName}\n${formattedPrice}\n\nGracias por tu compra en Creatiendas!`);
            }, 500);
        }
    };

    const shareProduct = (name: string, price: string) => {
        // Dispatch custom event for ChatSection to listen to
        const event = new CustomEvent('shareProduct', {
            detail: { name, price }
        });
        window.dispatchEvent(event);
    };

    return (
        <div className={styles.storeSection}>
            <div className={styles.storeHeader}>
                <div className={styles.storeLogo}>
                    <div className={styles.logoIcon}>C</div>
                    <div className={styles.logoText}>
                        <h1>Creatiendas</h1>
                        <p>Tu tienda online</p>
                    </div>
                </div>

                <div className={styles.storeSearch}>
                    <input type="text" placeholder="Buscar productos, categorías..." />
                    <span className={styles.searchIcon}>🔍</span>
                </div>

                <div className={styles.storeActions}>
                    <button className={styles.btnHeader}>
                        🛒 Carrito <span className={styles.cartBadge}>3</span>
                    </button>
                    <button className={`${styles.btnHeader} ${styles.btnWalletOpen}`} onClick={onOpenWallet}>
                        💰 $420.500
                    </button>
                </div>
            </div>

            <div className={styles.storeContent}>
                <div className={styles.categoryNav}>
                    <button className={`${styles.categoryBtn} ${styles.categoryBtnActive}`}>🔥 Destacados</button>
                    <button className={styles.categoryBtn}>👔 Ropa</button>
                    <button className={styles.categoryBtn}>📱 Electrónica</button>
                    <button className={styles.categoryBtn}>🏠 Hogar</button>
                    <button className={styles.categoryBtn}>⚽ Deportes</button>
                    <button className={styles.categoryBtn}>📚 Libros</button>
                    <button className={styles.categoryBtn}>🎮 Gaming</button>
                </div>

                <div className={styles.productsGrid}>
                    <div className={styles.productCard} onClick={() => shareProduct('Camisa Casual Premium', '$85.000')}>
                        <div className={styles.productImage}>
                            <div className={`${styles.productBadge} ${styles.productBadgeNew}`}>NUEVO</div>
                        </div>
                        <div className={styles.productInfo}>
                            <div className={styles.productCategory}>Ropa</div>
                            <div className={styles.productName}>Camisa Casual Premium</div>
                            <div className={styles.productPrice}>$85.000</div>
                            <div className={styles.productActions}>
                                <button className={`${styles.btnProduct} ${styles.btnCart}`} onClick={(e) => { e.stopPropagation(); addToCart('Camisa Casual Premium'); }}>🛒 Carrito</button>
                                <button className={`${styles.btnProduct} ${styles.btnBuy}`} onClick={(e) => { e.stopPropagation(); buyNow('Camisa Casual Premium', 85000); }}>Comprar</button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.productCard} onClick={() => shareProduct('Auriculares Bluetooth Pro', '$250.000')}>
                        <div className={styles.productImage} style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}></div>
                        <div className={styles.productInfo}>
                            <div className={styles.productCategory}>Electrónica</div>
                            <div className={styles.productName}>Auriculares Bluetooth Pro</div>
                            <div className={styles.productPrice}>$250.000</div>
                            <div className={styles.productActions}>
                                <button className={`${styles.btnProduct} ${styles.btnCart}`} onClick={(e) => { e.stopPropagation(); addToCart('Auriculares Bluetooth'); }}>🛒 Carrito</button>
                                <button className={`${styles.btnProduct} ${styles.btnBuy}`} onClick={(e) => { e.stopPropagation(); buyNow('Auriculares Bluetooth', 250000); }}>Comprar</button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.productCard} onClick={() => shareProduct('Zapatillas Running X1', '$320.000')}>
                        <div className={styles.productImage} style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}></div>
                        <div className={styles.productInfo}>
                            <div className={styles.productCategory}>Deportes</div>
                            <div className={styles.productName}>Zapatillas Running X1</div>
                            <div className={styles.productPrice}>$320.000</div>
                            <div className={styles.productActions}>
                                <button className={`${styles.btnProduct} ${styles.btnCart}`} onClick={(e) => { e.stopPropagation(); addToCart('Zapatillas Running'); }}>🛒 Carrito</button>
                                <button className={`${styles.btnProduct} ${styles.btnBuy}`} onClick={(e) => { e.stopPropagation(); buyNow('Zapatillas Running', 320000); }}>Comprar</button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.productCard} onClick={() => shareProduct('Reloj Inteligente Ultra', '$450.000')}>
                        <div className={styles.productImage} style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}></div>
                        <div className={styles.productInfo}>
                            <div className={styles.productCategory}>Electrónica</div>
                            <div className={styles.productName}>Reloj Inteligente Ultra</div>
                            <div className={styles.productPrice}>$450.000</div>
                            <div className={styles.productActions}>
                                <button className={`${styles.btnProduct} ${styles.btnCart}`} onClick={(e) => { e.stopPropagation(); addToCart('Reloj Inteligente'); }}>🛒 Carrito</button>
                                <button className={`${styles.btnProduct} ${styles.btnBuy}`} onClick={(e) => { e.stopPropagation(); buyNow('Reloj Inteligente', 450000); }}>Comprar</button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.productCard} onClick={() => shareProduct('Mochila Outdoor Pro', '$180.000')}>
                        <div className={styles.productImage} style={{ background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' }}></div>
                        <div className={styles.productInfo}>
                            <div className={styles.productCategory}>Accesorios</div>
                            <div className={styles.productName}>Mochila Outdoor Pro</div>
                            <div className={styles.productPrice}>$180.000</div>
                            <div className={styles.productActions}>
                                <button className={`${styles.btnProduct} ${styles.btnCart}`} onClick={(e) => { e.stopPropagation(); addToCart('Mochila Outdoor'); }}>🛒 Carrito</button>
                                <button className={`${styles.btnProduct} ${styles.btnBuy}`} onClick={(e) => { e.stopPropagation(); buyNow('Mochila Outdoor', 180000); }}>Comprar</button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.productCard} onClick={() => shareProduct('Libro Marketing Digital', '$65.000')}>
                        <div className={styles.productImage} style={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}></div>
                        <div className={styles.productInfo}>
                            <div className={styles.productCategory}>Libros</div>
                            <div className={styles.productName}>Libro Marketing Digital</div>
                            <div className={styles.productPrice}>$65.000</div>
                            <div className={styles.productActions}>
                                <button className={`${styles.btnProduct} ${styles.btnCart}`} onClick={(e) => { e.stopPropagation(); addToCart('Libro Marketing'); }}>🛒 Carrito</button>
                                <button className={`${styles.btnProduct} ${styles.btnBuy}`} onClick={(e) => { e.stopPropagation(); buyNow('Libro Marketing', 65000); }}>Comprar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
