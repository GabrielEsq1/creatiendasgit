import React, { useRef, ChangeEvent } from 'react';

interface ImageUploaderProps {
    onImageSelected: (e: ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    showPreview?: boolean;
    currentImage?: string | null;
    multiple?: boolean;
}

export default function ImageUploader({
    onImageSelected,
    label,
    showPreview = false,
    currentImage,
    multiple = false
}: ImageUploaderProps) {
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCameraClick = () => {
        cameraInputRef.current?.click();
    };

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="image-uploader-wrapper">
            {label && <label className="block mb-2 font-semibold text-sm">{label}</label>}

            {/* Hidden Inputs */}
            <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={cameraInputRef}
                onChange={onImageSelected}
                style={{ display: 'none' }}
            />
            <input
                type="file"
                accept="image/*"
                multiple={multiple}
                ref={fileInputRef}
                onChange={onImageSelected}
                style={{ display: 'none' }}
            />

            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={handleCameraClick}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-blue-700 transition-colors"
                    title="Tomar Foto"
                >
                    📷 <span className="text-sm">Cámara</span>
                </button>
                <button
                    type="button"
                    onClick={handleFileClick}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-3 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-gray-300 transition-colors"
                    title="Subir desde galería"
                >
                    📁 <span className="text-sm">Galería</span>
                </button>
            </div>

            {showPreview && currentImage && (
                <div className="mt-2 w-full h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                    <img src={currentImage} alt="Preview" className="h-full w-full object-cover" />
                </div>
            )}
        </div>
    );
}
