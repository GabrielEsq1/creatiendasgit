import React, { useRef, useState, useEffect } from 'react';
import { X, Camera, RotateCcw } from 'lucide-react';

interface CameraCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCapture: (imageFile: File) => void;
}

export default function CameraCaptureModal({ isOpen, onClose, onCapture }: CameraCaptureModalProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [useFrontCamera, setUseFrontCamera] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            stopStream();
            return;
        }
        startCamera();
        return () => stopStream();
    }, [isOpen, useFrontCamera]);

    const startCamera = async () => {
        try {
            setError(null);
            if (stream) {
                stopStream();
            }

            const constraints = {
                video: {
                    facingMode: useFrontCamera ? 'user' : 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };

            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(mediaStream);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.play();
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("No pudimos acceder a tu cámara. Verifica los permisos.");
        }
    };

    const stopStream = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const captureImage = () => {
        if (!videoRef.current || !canvasRef.current) return;
        setIsCapturing(true);

        // Haptic feedback
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(50);
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            // Flip horizontal if using front camera for mirror effect
            if (useFrontCamera) {
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
            }
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
                    onCapture(file);
                    onClose();
                }
            }, 'image/jpeg', 0.9);
        }
        setIsCapturing(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[99999] bg-black bg-opacity-90 flex flex-col items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-black rounded-3xl overflow-hidden shadow-2xl border border-gray-800">

                {/* Header */}
                <div className="absolute top-0 w-full p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/70 to-transparent">
                    <span className="text-white font-medium text-sm">Tomar Foto</span>
                    <button onClick={onClose} className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Viewport */}
                <div className="relative aspect-[3/4] bg-gray-900 w-full flex items-center justify-center">
                    {error ? (
                        <div className="text-center p-6 text-white">
                            <p className="mb-4">⚠️</p>
                            <p>{error}</p>
                            <button onClick={() => startCamera()} className="mt-4 px-4 py-2 bg-blue-600 rounded-full text-sm">Reintentar</button>
                        </div>
                    ) : (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className={`w-full h-full object-cover ${useFrontCamera ? 'scale-x-[-1]' : ''}`}
                        />
                    )}
                    <canvas ref={canvasRef} className="hidden" />
                </div>

                {/* Controls */}
                <div className="bg-black p-6 flex items-center justify-between">
                    <button
                        onClick={() => setUseFrontCamera(!useFrontCamera)}
                        className="p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                        title="Cambiar cámara"
                    >
                        <RotateCcw className="w-6 h-6" />
                    </button>

                    <button
                        onClick={captureImage}
                        disabled={!!error || isCapturing}
                        className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-transparent relative hover:scale-105 active:scale-95 transition-transform"
                    >
                        <div className="w-12 h-12 bg-white rounded-full"></div>
                    </button>

                    <div className="w-12"></div> {/* Spacer for alignment */}
                </div>
            </div>
        </div>
    );
}
