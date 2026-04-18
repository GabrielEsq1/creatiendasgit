import React, { useRef, ChangeEvent, useState } from 'react';
import CameraCaptureModal from './CameraCaptureModal';

interface ImageUploaderProps {
    onImageSelected: (e: ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage?: (index: number) => void;
    onRemoveSingle?: () => void;
    label?: string;
    showPreview?: boolean;
    currentImage?: string | null;
    currentImages?: string[];
    multiple?: boolean;
    maxImages?: number;
    placeholderText?: string;
}

export default function ImageUploader({
    onImageSelected,
    onRemoveImage,
    onRemoveSingle,
    label,
    showPreview = false,
    currentImage,
    currentImages = [],
    multiple = false,
    maxImages = 5,
    placeholderText = "Agrega fotos de tu producto"
}: ImageUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleCameraClick = () => {
        if (multiple && currentImages.length >= maxImages) {
            setErrorMsg(`Puedes subir máximo ${maxImages} fotos por producto`);
            return;
        }
        setIsCameraOpen(true);
    };

    const handleFileClick = () => {
        if (multiple && currentImages.length >= maxImages) {
            setErrorMsg(`Puedes subir máximo ${maxImages} fotos por producto`);
            return;
        }
        fileInputRef.current?.click();
    };

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files?.length) return;

        // Validation for multiple
        if (multiple) {
            const newTotal = currentImages.length + files.length;
            if (newTotal > maxImages) {
                setErrorMsg(`Puedes subir máximo ${maxImages} fotos por producto`);
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }
        }

        setErrorMsg(null);
        setIsProcessing(true);
        try {
            await onImageSelected(e);
        } catch (error) {
            console.error("Error processing image:", error);
        } finally {
            setIsProcessing(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleCameraCapture = (file: File) => {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        if (fileInputRef.current) {
            fileInputRef.current.files = dataTransfer.files;
            const syntheticEvent = {
                target: { files: dataTransfer.files }
            } as unknown as ChangeEvent<HTMLInputElement>;
            handleImageChange(syntheticEvent);
        }
    };

    return (
        <div className="image-uploader-wrapper">
            {label && <label className="block mb-2 font-semibold text-sm">{label}</label>}

            <input
                type="file"
                accept="image/*"
                multiple={multiple}
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: 'none' }}
            />

            {/* Placeholder / Selected Images Area */}
            {multiple && (
                <div className="mb-4">
                    {currentImages.length === 0 ? (
                        <div 
                            onClick={handleFileClick}
                            className="w-full py-8 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group"
                        >
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                💯
                            </div>
                            <span className="text-gray-500 font-medium">{placeholderText}</span>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2 mb-2 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                            {currentImages.map((img, i) => (
                                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-white shadow-sm group">
                                    <img src={img} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                                    <button 
                                        type="button"
                                        onClick={() => onRemoveImage?.(i)}
                                        className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-md hover:bg-red-600 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                            {currentImages.length < maxImages && (
                                <button 
                                    type="button"
                                    onClick={handleFileClick}
                                    className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-all"
                                >
                                    +
                                </button>
                            )}
                        </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-1">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                            {currentImages.length} / {maxImages} fotos
                        </span>
                        <span className="text-[10px] text-blue-500 font-medium">
                            Puedes subir hasta {maxImages} fotos (mantén presionado para seleccionar varias)
                        </span>
                    </div>
                    {errorMsg && (
                        <div className="mt-1 text-xs text-red-500 font-bold animate-shake">
                            ⚠️ {errorMsg}
                        </div>
                    )}
                </div>
            )}

            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={handleCameraClick}
                    disabled={isProcessing}
                    className={`flex-1 text-white py-2 px-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all active:scale-95 ${isProcessing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'
                        }`}
                >
                    📸 <span className="text-sm">Cámara</span>
                </button>
                <button
                    type="button"
                    onClick={handleFileClick}
                    disabled={isProcessing}
                    className={`flex-1 text-gray-800 py-2 px-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all active:scale-95 ${isProcessing ? 'bg-gray-200 cursor-not-allowed' : 'bg-white border-2 border-gray-200 hover:border-blue-400 hover:text-blue-600'
                        }`}
                >
                    📁 <span className="text-sm">Galería</span>
                </button>
            </div>

            {isProcessing && (
                <div className="mt-3 py-2 bg-blue-50 rounded-lg text-center text-xs text-blue-600 font-bold animate-pulse flex items-center justify-center gap-2">
                    ⏳ Procesando imágenes...
                </div>
            )}

            {!multiple && !isProcessing && showPreview && currentImage && (
                <div className="mt-2 w-full rounded-xl overflow-hidden border border-gray-200 relative group">
                    <div className="relative h-32 bg-gray-100 flex items-center justify-center">
                        <img src={currentImage} alt="Preview" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs font-black uppercase tracking-widest">Cambiar</span>
                        </div>
                    </div>
                    {onRemoveSingle && (
                        <button
                            type="button"
                            onClick={onRemoveSingle}
                            className="w-full py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center gap-1 transition-colors border-t border-red-100"
                        >
                            🗑️ Quitar foto
                        </button>
                    )}
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
