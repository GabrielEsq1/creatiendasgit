import React, { useRef, ChangeEvent, useState } from 'react';
import CameraCaptureModal from './CameraCaptureModal';

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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCameraClick = () => {
        setIsCameraOpen(true);
    };

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    // Wrapper to handle async processing state
    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        setIsProcessing(true);
        try {
            await onImageSelected(e);
        } catch (error) {
            console.error("Error processing image:", error);
        } finally {
            setIsProcessing(false);
            // Reset input so same file can be selected again if needed
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleCameraCapture = (file: File) => {
        // Create a new DataTransfer to simulate a file input change
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        if (fileInputRef.current) {
            fileInputRef.current.files = dataTransfer.files;

            // Use the wrapper directly for camera capture too
            const syntheticEvent = {
                target: { files: dataTransfer.files }
            } as unknown as ChangeEvent<HTMLInputElement>;

            handleImageChange(syntheticEvent);
        }
    };

    return (
        <div className="image-uploader-wrapper">
            {label && <label className="block mb-2 font-semibold text-sm">{label}</label>}

            {/* Hidden Input */}
            <input
                type="file"
                accept="image/*"
                multiple={multiple}
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: 'none' }}
            />

            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={handleCameraClick}
                    disabled={isProcessing}
                    className={`flex-1 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors ${isProcessing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    title="Tomar Foto"
                >
                    📷 <span className="text-sm">Cámara</span>
                </button>
                <button
                    type="button"
                    onClick={handleFileClick}
                    disabled={isProcessing}
                    className={`flex-1 text-gray-800 py-2 px-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors ${isProcessing ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                    title="Subir desde galería"
                >
                    📁 <span className="text-sm">Galería</span>
                </button>
            </div>

            {isProcessing && (
                <div className="mt-2 text-center text-sm text-blue-600 font-medium animate-pulse">
                    ⏳ Procesando imagen...
                </div>
            )}

            {!isProcessing && showPreview && currentImage && (
                <div className="mt-2 w-full h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center relative group">
                    <img src={currentImage} alt="Preview" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-medium">Cambiar imagen</span>
                    </div>
                </div>
            )}

            <CameraCaptureModal
                isOpen={isCameraOpen}
                onClose={() => setIsCameraOpen(false)}
                onCapture={handleCameraCapture}
            />
        </div>
    );
}
