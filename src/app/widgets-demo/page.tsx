'use client';

import { useEffect } from 'react';

export default function WidgetsDemoPage() {
    useEffect(() => {
        // SNIPPET 1: CREATIENDAS STORE BUILDER
        const loadCreatiendasWidget = () => {
            const CREATIENDAS_URL = 'https://creatiendas.co';

            // Check if already exists to prevent duplicates on re-renders
            if (document.getElementById('creatiendas-widget-btn')) return;

            const btn = document.createElement('button');
            btn.id = 'creatiendas-widget-btn';
            btn.innerHTML = '🏪 Crear Tienda';
            btn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #1877F2 0%, #0866FF 100%);
        color: white;
        border: none;
        padding: 15px 25px;
        border-radius: 50px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        z-index: 9998;
        box-shadow: 0 4px 15px rgba(24, 119, 242, 0.3);
        transition: all 0.3s ease;
      `;

            btn.onmouseover = () => {
                btn.style.transform = 'scale(1.05)';
                btn.style.boxShadow = '0 6px 20px rgba(24, 119, 242, 0.5)';
            };

            btn.onmouseout = () => {
                btn.style.transform = 'scale(1)';
                btn.style.boxShadow = '0 4px 15px rgba(24, 119, 242, 0.3)';
            };

            const modal = document.createElement('div');
            modal.id = 'creatiendas-widget-modal';
            modal.style.cssText = `
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
        z-index: 9999;
        backdrop-filter: blur(5px);
      `;

            const container = document.createElement('div');
            container.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 20px;
        box-shadow: 0 10px 50px rgba(0,0,0,0.3);
        width: 95%;
        max-width: 1200px;
        height: 90vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      `;

            const header = document.createElement('div');
            header.style.cssText = `
        background: linear-gradient(135deg, #1877F2 0%, #0866FF 100%);
        color: white;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      `;
            header.innerHTML = `
        <h3 style="margin: 0; font-size: 20px;">🏪 Creatiendas - Constructor de Tiendas</h3>
        <button id="close-creatiendas" style="
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18px;
        ">×</button>
      `;

            const iframe = document.createElement('iframe');
            iframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
      `;
            iframe.src = `${CREATIENDAS_URL}/builder`;

            container.appendChild(header);
            container.appendChild(iframe);
            modal.appendChild(container);
            document.body.appendChild(btn);
            document.body.appendChild(modal);

            btn.onclick = () => {
                modal.style.display = 'flex';
            };

            const closeBtn = document.getElementById('close-creatiendas');
            if (closeBtn) {
                closeBtn.onclick = () => {
                    modal.style.display = 'none';
                };
            }

            modal.onclick = (e) => {
                if (e.target === modal) modal.style.display = 'none';
            };
        };

        // SNIPPET 2: B2BCHAT + MONEDERO
        const loadB2BChatWidget = () => {
            const B2BCHAT_URL = 'https://creatiendas.co';

            if (document.getElementById('b2bchat-widget-btn')) return;

            const btn = document.createElement('button');
            btn.id = 'b2bchat-widget-btn';
            btn.innerHTML = '💬 B2BChat';
            btn.style.cssText = `
        position: fixed;
        bottom: 90px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 15px 25px;
        border-radius: 50px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        z-index: 9998;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        transition: all 0.3s ease;
      `;

            btn.onmouseover = () => {
                btn.style.transform = 'scale(1.05)';
                btn.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
            };

            btn.onmouseout = () => {
                btn.style.transform = 'scale(1)';
                btn.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
            };

            const modal = document.createElement('div');
            modal.id = 'b2bchat-widget-modal';
            modal.style.cssText = `
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
        z-index: 9999;
        backdrop-filter: blur(5px);
      `;

            const container = document.createElement('div');
            container.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 20px;
        box-shadow: 0 10px 50px rgba(0,0,0,0.3);
        width: 90%;
        max-width: 450px;
        max-height: 90vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      `;

            const header = document.createElement('div');
            header.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      `;
            header.innerHTML = `
        <h3 style="margin: 0; font-size: 20px;">💬 B2BChat + Monedero</h3>
        <button id="close-b2bchat" style="
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18px;
        ">×</button>
      `;

            const nav = document.createElement('div');
            nav.style.cssText = `
        display: flex;
        border-bottom: 1px solid #e0e0e0;
        background: #f8f9fa;
      `;
            nav.innerHTML = `
        <button class="b2b-tab active" data-tab="chat" style="
          flex: 1;
          padding: 15px;
          border: none;
          background: white;
          cursor: pointer;
          font-weight: 600;
          border-bottom: 3px solid #667eea;
        ">Chat</button>
        <button class="b2b-tab" data-tab="wallet" style="
          flex: 1;
          padding: 15px;
          border: none;
          background: transparent;
          cursor: pointer;
          border-bottom: 3px solid transparent;
        ">Monedero</button>
        <button class="b2b-tab" data-tab="enterprise" style="
          flex: 1;
          padding: 15px;
          border: none;
          background: transparent;
          cursor: pointer;
          border-bottom: 3px solid transparent;
        ">Tienda</button>
      `;

            const content = document.createElement('div');
            content.style.cssText = `
        flex: 1;
        overflow: hidden;
        position: relative;
      `;

            const iframe = document.createElement('iframe');
            iframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
      `;
            iframe.src = `${B2BCHAT_URL}/b2chat/B2Chat-main`;

            content.appendChild(iframe);
            container.appendChild(header);
            container.appendChild(nav);
            container.appendChild(content);
            modal.appendChild(container);
            document.body.appendChild(btn);
            document.body.appendChild(modal);

            btn.onclick = () => {
                modal.style.display = 'flex';
            };

            const closeBtn = document.getElementById('close-b2bchat');
            if (closeBtn) {
                closeBtn.onclick = () => {
                    modal.style.display = 'none';
                };
            }

            modal.onclick = (e) => {
                if (e.target === modal) modal.style.display = 'none';
            };

            document.querySelectorAll('.b2b-tab').forEach(tab => {
                // @ts-ignore
                tab.onclick = function () {
                    document.querySelectorAll('.b2b-tab').forEach(t => {
                        t.classList.remove('active');
                        // @ts-ignore
                        t.style.background = 'transparent';
                        // @ts-ignore
                        t.style.borderBottom = '3px solid transparent';
                    });

                    // @ts-ignore
                    this.classList.add('active');
                    // @ts-ignore
                    this.style.background = 'white';
                    // @ts-ignore
                    this.style.borderBottom = '3px solid #667eea';

                    // @ts-ignore
                    const tabName = this.dataset.tab;
                    const urls: Record<string, string> = {
                        chat: `${B2BCHAT_URL}/b2chat/B2Chat-main`,
                        wallet: `${B2BCHAT_URL}/wallet`,
                        enterprise: `${B2BCHAT_URL}/enterprise`
                    };
                    iframe.src = urls[tabName];
                };
            });
        };

        loadCreatiendasWidget();
        loadB2BChatWidget();

        // Cleanup function
        return () => {
            const w1 = document.getElementById('creatiendas-widget-btn');
            const m1 = document.getElementById('creatiendas-widget-modal');
            const w2 = document.getElementById('b2bchat-widget-btn');
            const m2 = document.getElementById('b2bchat-widget-modal');

            if (w1) w1.remove();
            if (m1) m1.remove();
            if (w2) w2.remove();
            if (m2) m2.remove();
        };
    }, []);

    return (
        <div style={{
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
        }}>
            <div style={{
                background: "white",
                borderRadius: "20px",
                padding: "40px",
                maxWidth: "800px",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)"
            }}>
                <h1 style={{ color: "#333", marginBottom: "10px", fontSize: "2.5rem" }}>🚀 Creatiendas Widgets</h1>
                <p style={{ color: "#666", marginBottom: "30px", fontSize: "1.1rem" }}>Dos widgets poderosos para tu sitio web</p>

                <div style={{
                    background: "#f8f9fa",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "20px",
                    borderLeft: "4px solid #1877F2"
                }}>
                    <h3 style={{ color: "#1877F2", marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>🏪 Widget 1: Constructor de Tiendas</h3>
                    <p style={{ color: "#555", lineHeight: "1.6" }}><strong>Ubicación:</strong> Botón azul inferior derecha</p>
                    <p style={{ color: "#555", lineHeight: "1.6" }}><strong>Funcionalidad:</strong></p>
                    <ul style={{ marginTop: "10px", marginLeft: "20px", color: "#555" }}>
                        <li style={{ marginBottom: "5px" }}>Constructor visual de tiendas WhatsApp</li>
                        <li style={{ marginBottom: "5px" }}>Personalización completa de productos</li>
                        <li style={{ marginBottom: "5px" }}>Integración directa con WhatsApp</li>
                        <li style={{ marginBottom: "5px" }}>Vista previa en tiempo real</li>
                    </ul>
                </div>

                <div style={{
                    background: "#f8f9fa",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "20px",
                    borderLeft: "4px solid #667eea"
                }}>
                    <h3 style={{ color: "#667eea", marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>💬 Widget 2: B2BChat + Monedero</h3>
                    <p style={{ color: "#555", lineHeight: "1.6" }}><strong>Ubicación:</strong> Botón morado superior al azul</p>
                    <p style={{ color: "#555", lineHeight: "1.6" }}><strong>Funcionalidad:</strong></p>
                    <ul style={{ marginTop: "10px", marginLeft: "20px", color: "#555" }}>
                        <li style={{ marginBottom: "5px" }}><strong>Chat:</strong> Mensajería empresarial B2B</li>
                        <li style={{ marginBottom: "5px" }}><strong>Monedero:</strong> Billetera digital con PayPal</li>
                        <li style={{ marginBottom: "5px" }}><strong>Tienda:</strong> Vista integrada de productos</li>
                    </ul>
                </div>

                <div style={{
                    background: "#fff3cd",
                    border: "1px solid #ffc107",
                    borderRadius: "8px",
                    padding: "15px",
                    marginTop: "30px"
                }}>
                    <h4 style={{ color: "#856404", marginBottom: "10px" }}>📋 Instrucciones de Uso:</h4>
                    <p style={{ color: "#856404", fontSize: "0.95rem" }}>
                        1. Haz clic en cualquiera de los botones flotantes en la esquina inferior derecha<br />
                        2. El widget se abrirá en un modal elegante<br />
                        3. Navega entre las diferentes funcionalidades<br />
                        4. Cierra con la X o haciendo clic fuera del modal
                    </p>
                </div>
            </div>

            <button
                onClick={() => alert('¡Los widgets están activos! Mira los botones flotantes en la esquina inferior derecha →')}
                style={{
                    position: "fixed",
                    bottom: "20px",
                    left: "20px",
                    background: "#28a745",
                    color: "white",
                    border: "none",
                    padding: "12px 20px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(40, 167, 69, 0.3)",
                    transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(40, 167, 69, 0.4)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.3)';
                }}
            >
                ℹ️ Ver Ayuda
            </button>
        </div>
    );
}
