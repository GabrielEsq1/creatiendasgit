'use client';

import React, { useState } from 'react';

const APP_OPTIONS = [
    { label: 'Creatiendas Home', url: 'http://localhost:3001' },
    { label: 'B2BChat Live', url: 'https://b2-chat-ruddy.vercel.app' },
    { label: 'Enterprise Interface', url: 'http://localhost:3001/enterprise' },
    { label: 'Test Store', url: 'http://localhost:3001/stores/mi-tienda-bonitaadmin-test-store-1' },
];

export default function DualPreviewPage() {
    const [leftApp, setLeftApp] = useState(APP_OPTIONS[0]);
    const [rightApp, setRightApp] = useState(APP_OPTIONS[1]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Temporary state for modal inputs
    const [tempLeftUrl, setTempLeftUrl] = useState(leftApp.url);
    const [tempRightUrl, setTempRightUrl] = useState(rightApp.url);
    const [tempLeftLabel, setTempLeftLabel] = useState(leftApp.label);
    const [tempRightLabel, setTempRightLabel] = useState(rightApp.label);

    const openModal = () => {
        setTempLeftUrl(leftApp.url);
        setTempRightUrl(rightApp.url);
        setTempLeftLabel(leftApp.label);
        setTempRightLabel(rightApp.label);
        setIsModalOpen(true);
    };

    const saveConfig = () => {
        setLeftApp({ label: tempLeftLabel, url: tempLeftUrl });
        setRightApp({ label: tempRightLabel, url: tempRightUrl });
        setIsModalOpen(false);
    };

    const handlePresetChange = (side: 'left' | 'right', url: string) => {
        const selectedOption = APP_OPTIONS.find(opt => opt.url === url);
        if (selectedOption) {
            if (side === 'left') {
                setTempLeftUrl(selectedOption.url);
                setTempLeftLabel(selectedOption.label);
            } else {
                setTempRightUrl(selectedOption.url);
                setTempRightLabel(selectedOption.label);
            }
        } else {
            // Custom URL case
            if (side === 'left') {
                setTempLeftUrl(url);
                setTempLeftLabel('Custom App');
            } else {
                setTempRightUrl(url);
                setTempRightLabel('Custom App');
            }
        }
    };

    return (
        <div style={{
            display: 'flex',
            gap: '10px',
            padding: '10px',
            height: '100vh',
            boxSizing: 'border-box',
            background: '#111',
            fontFamily: 'Arial, sans-serif',
            margin: 0,
            position: 'relative'
        }}>
            {/* Configuration Button */}
            <button
                onClick={openModal}
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 100,
                    padding: '10px 20px',
                    background: '#333',
                    color: '#fff',
                    border: '1px solid #555',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
                }}
            >
                ⚙️ Configurar Vistas
            </button>

            {/* APP 1 (Left) */}
            <div style={{
                flex: 1,
                borderRadius: '12px',
                overflow: 'hidden',
                border: '2px solid #333',
                background: '#000',
                position: 'relative'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    zIndex: 10
                }}>{leftApp.label}</div>
                <iframe
                    src={leftApp.url}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title="Left Preview"
                />
            </div>

            {/* APP 2 (Right) */}
            <div style={{
                flex: 1,
                borderRadius: '12px',
                overflow: 'hidden',
                border: '2px solid #333',
                background: '#000',
                position: 'relative'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    zIndex: 10
                }}>{rightApp.label}</div>
                <iframe
                    src={rightApp.url}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title="Right Preview"
                />
            </div>

            {/* Configuration Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 200
                }}>
                    <div style={{
                        background: '#1a1a1a',
                        padding: '30px',
                        borderRadius: '16px',
                        width: '500px',
                        color: '#fff',
                        border: '1px solid #333',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                    }}>
                        <h2 style={{ marginTop: 0, marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Configurar Vista Dual</h2>

                        {/* Left App Config */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#aaa' }}>Panel Izquierdo (App 1)</label>
                            <select
                                style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#333', color: '#fff', border: 'none', borderRadius: '8px' }}
                                value={APP_OPTIONS.find(opt => opt.url === tempLeftUrl) ? tempLeftUrl : 'custom'}
                                onChange={(e) => {
                                    if (e.target.value === 'custom') {
                                        setTempLeftUrl('');
                                        setTempLeftLabel('Custom App');
                                    } else {
                                        handlePresetChange('left', e.target.value);
                                    }
                                }}
                            >
                                {APP_OPTIONS.map(opt => (
                                    <option key={opt.url} value={opt.url}>{opt.label}</option>
                                ))}
                                <option value="custom">URL Personalizada...</option>
                            </select>
                            <input
                                type="text"
                                value={tempLeftUrl}
                                onChange={(e) => setTempLeftUrl(e.target.value)}
                                placeholder="https://..."
                                style={{ width: '100%', padding: '10px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '8px', boxSizing: 'border-box' }}
                            />
                        </div>

                        {/* Right App Config */}
                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#aaa' }}>Panel Derecho (App 2)</label>
                            <select
                                style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#333', color: '#fff', border: 'none', borderRadius: '8px' }}
                                value={APP_OPTIONS.find(opt => opt.url === tempRightUrl) ? tempRightUrl : 'custom'}
                                onChange={(e) => {
                                    if (e.target.value === 'custom') {
                                        setTempRightUrl('');
                                        setTempRightLabel('Custom App');
                                    } else {
                                        handlePresetChange('right', e.target.value);
                                    }
                                }}
                            >
                                {APP_OPTIONS.map(opt => (
                                    <option key={opt.url} value={opt.url}>{opt.label}</option>
                                ))}
                                <option value="custom">URL Personalizada...</option>
                            </select>
                            <input
                                type="text"
                                value={tempRightUrl}
                                onChange={(e) => setTempRightUrl(e.target.value)}
                                placeholder="https://..."
                                style={{ width: '100%', padding: '10px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '8px', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                style={{ padding: '10px 20px', background: 'transparent', color: '#aaa', border: 'none', cursor: 'pointer' }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={saveConfig}
                                style={{ padding: '10px 20px', background: '#667eea', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
