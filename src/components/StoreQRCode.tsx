"use client";

import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface StoreQRCodeProps {
    url: string;
    size?: number;
    storeName?: string;
}

const StoreQRCode: React.FC<StoreQRCodeProps> = ({ url, size = 200, storeName }) => {
    const qrRef = useRef<HTMLDivElement>(null);
    const safeStoreName = storeName || 'Mi Tienda';

    const handleDownload = () => {
        const svg = qrRef.current?.querySelector('svg');
        if (!svg || !url) return;

        // Convert SVG to canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const img = new Image();

        img.onload = () => {
            canvas.width = size;
            canvas.height = size;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, size, size);
            ctx.drawImage(img, 0, 0);

            // Download as PNG
            canvas.toBlob((blob) => {
                if (!blob) return;
                const blobUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = `${safeStoreName.replace(/\s+/g, '-').toLowerCase()}-qr.png`;
                link.href = blobUrl;
                link.click();
                URL.revokeObjectURL(blobUrl);
            });
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div
                ref={qrRef}
                className="p-4 bg-white rounded-2xl border-2 border-gray-100 shadow-lg"
            >
                <QRCodeSVG
                    value={url}
                    size={size}
                    level="H"
                    includeMargin={true}
                    fgColor="#000000"
                    bgColor="#FFFFFF"
                />
            </div>

            <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all hover:bg-green-600 hover:scale-105 active:scale-95"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Descargar QR
            </button>

            <p className="text-sm text-gray-500 text-center max-w-xs">
                Comparte este código QR para que tus clientes accedan a tu tienda escaneándolo
            </p>
        </div>
    );
};

export default StoreQRCode;
