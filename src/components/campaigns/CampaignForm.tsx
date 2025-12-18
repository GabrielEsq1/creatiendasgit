"use client";

import { useState, useRef } from "react";
import { Upload, X, Video as VideoIcon, Image as ImageIcon, AlertCircle } from "lucide-react";

interface CampaignFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function CampaignForm({ onSuccess, onCancel }: CampaignFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        objective: "",
        industry: "",
        sector: "",
        dailyBudget: "",
        totalBudget: "",
        creativeType: "IMAGE",
        creativeUrl: "",
        videoUrl: "",
        videoDuration: 0,
        creativeText: "",
        description: "",
        ctaLabel: "Ver Más",
        destinationUrl: "",
        ageRange: "",
        gender: "ALL",
        location: "",
    });

    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string>("");
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [videoDuration, setVideoDuration] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear errors when user starts typing
        setErrors([]);
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");

        if (!isImage && !isVideo) {
            setErrors(["Por favor selecciona una imagen o video válido"]);
            return;
        }

        // Validate file size
        const maxSize = isImage ? 5 * 1024 * 1024 : 50 * 1024 * 1024; // 5MB for images, 50MB for videos
        if (file.size > maxSize) {
            setErrors([`El archivo es demasiado grande. Máximo ${isImage ? '5MB' : '50MB'}`]);
            return;
        }

        setMediaFile(file);
        setFormData(prev => ({
            ...prev,
            creativeType: isImage ? "IMAGE" : "VIDEO"
        }));

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setMediaPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // If video, get duration
        if (isVideo) {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                const duration = Math.floor(video.duration);
                setVideoDuration(duration);

                if (duration > 20) {
                    setErrors([`El video dura ${duration} segundos. Debe ser máximo 20 segundos. Por favor recorta el video.`]);
                } else {
                    setFormData(prev => ({ ...prev, videoDuration: duration }));
                }
            };
            video.src = URL.createObjectURL(file);
        }
    };

    const uploadMedia = async (): Promise<string | null> => {
        if (!mediaFile) return null;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", mediaFile);
            formData.append("type", mediaFile.type.startsWith("image/") ? "image" : "video");

            const res = await fetch("/api/campaigns/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Error al subir archivo");
            }

            return data.url;
        } catch (error: any) {
            setErrors([error.message || "Error al subir archivo"]);
            return null;
        } finally {
            setUploading(false);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: string[] = [];

        if (!formData.name.trim()) newErrors.push("Nombre de campaña es obligatorio");
        if (!formData.objective) newErrors.push("Objetivo es obligatorio");
        if (!formData.industry.trim()) newErrors.push("Industria es obligatoria");
        if (!formData.sector.trim()) newErrors.push("Sector es obligatorio");
        if (!formData.dailyBudget || parseFloat(formData.dailyBudget) <= 0) {
            newErrors.push("Presupuesto diario debe ser mayor a 0");
        }
        if (!formData.totalBudget || parseFloat(formData.totalBudget) <= 0) {
            newErrors.push("Presupuesto total debe ser mayor a 0");
        }
        if (!mediaFile && !formData.creativeUrl && !formData.videoUrl) {
            newErrors.push("Debe subir una imagen o video");
        }
        if (formData.creativeType === "VIDEO" && videoDuration > 20) {
            newErrors.push("El video debe tener máximo 20 segundos");
        }

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        try {
            // Upload media first if there's a file
            let mediaUrl: string | null = formData.creativeUrl || formData.videoUrl;
            if (mediaFile) {
                mediaUrl = await uploadMedia();
                if (!mediaUrl) {
                    setSubmitting(false);
                    return;
                }
            }

            // Create campaign
            const campaignData = {
                ...formData,
                [formData.creativeType === "IMAGE" ? "creativeUrl" : "videoUrl"]: mediaUrl,
                videoDuration: formData.creativeType === "VIDEO" ? videoDuration : undefined,
            };

            const res = await fetch("/api/campaigns/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(campaignData),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.missingFields) {
                    setErrors([`Campos faltantes: ${data.missingFields.join(", ")}`]);
                } else {
                    setErrors([data.error || "Error al crear campaña"]);
                }
                return;
            }

            alert("✅ " + (data.message || "Campaña creada exitosamente"));
            if (onSuccess) onSuccess();
        } catch (error: any) {
            setErrors([error.message || "Error al crear campaña"]);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
            <div className="border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-900">Crear Nueva Campaña</h2>
                <p className="text-sm text-gray-600 mt-1">Todos los campos son obligatorios</p>
            </div>

            {/* Error Display */}
            {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-red-800">Errores en el formulario:</h3>
                            <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
                                {errors.map((error, idx) => (
                                    <li key={idx}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre de Campaña <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ej: Campaña Verano 2024"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Objetivo <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="objective"
                        value={formData.objective}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    >
                        <option value="">Seleccionar...</option>
                        <option value="TRAFFIC">Tráfico</option>
                        <option value="SALES">Ventas</option>
                        <option value="AWARENESS">Reconocimiento</option>
                        <option value="LEADS">Generación de Leads</option>
                    </select>
                </div>
            </div>

            {/* Segmentation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Industria <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ej: Tecnología, Retail, Salud"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sector <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="sector"
                        value={formData.sector}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ej: Software, E-commerce"
                        required
                    />
                </div>
            </div>

            {/* Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Presupuesto Diario (USD) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="dailyBudget"
                        value={formData.dailyBudget}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="100"
                        min="1"
                        step="0.01"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Presupuesto Total (USD) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="totalBudget"
                        value={formData.totalBudget}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="1000"
                        min="1"
                        step="0.01"
                        required
                    />
                    {formData.dailyBudget && formData.totalBudget && (
                        <p className="text-xs text-gray-500 mt-1">
                            Duración: {Math.ceil(parseFloat(formData.totalBudget) / parseFloat(formData.dailyBudget))} días
                        </p>
                    )}
                </div>
            </div>

            {/* Media Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagen o Video <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                    {mediaPreview ? (
                        <div className="relative">
                            {formData.creativeType === "IMAGE" ? (
                                <img src={mediaPreview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                            ) : (
                                <div>
                                    <video
                                        ref={videoRef}
                                        src={mediaPreview}
                                        controls
                                        className="max-h-64 mx-auto rounded-lg"
                                    />
                                    <p className="mt-2 text-sm text-gray-600">
                                        Duración: {videoDuration} segundos
                                        {videoDuration > 20 && (
                                            <span className="text-red-600 font-semibold"> - ¡Excede el límite de 20 segundos!</span>
                                        )}
                                    </p>
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => {
                                    setMediaFile(null);
                                    setMediaPreview("");
                                    setVideoDuration(0);
                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <div>
                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-sm text-gray-600 mb-2">
                                Arrastra un archivo o haz clic para seleccionar
                            </p>
                            <p className="text-xs text-gray-500">
                                Imágenes: JPG, PNG, GIF (máx 5MB) | Videos: MP4, WebM (máx 50MB, 20 seg)
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleFileSelect}
                                className="hidden"
                                id="media-upload"
                            />
                            <label
                                htmlFor="media-upload"
                                className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
                            >
                                Seleccionar Archivo
                            </label>
                        </div>
                    )}
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción / Texto del Anuncio
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe tu campaña..."
                />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                    >
                        Cancelar
                    </button>
                )}
                <button
                    type="submit"
                    disabled={submitting || uploading}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {submitting ? "Creando..." : uploading ? "Subiendo..." : "Crear Campaña"}
                </button>
            </div>
        </form>
    );
}
