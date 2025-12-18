'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoSrc: string;
}

export default function VideoModal({ isOpen, onClose, videoSrc }: VideoModalProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        if (isOpen && videoRef.current) {
            videoRef.current.play().catch(e => console.log("Autoplay prevented", e));
            setIsPlaying(true);
        } else if (!isOpen && videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const isYouTube = videoSrc.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&]+)/);
    const videoId = isYouTube ? isYouTube[1] : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-white/20 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Video Container */}
                <div className="relative aspect-video bg-gray-900 group">
                    {isYouTube ? (
                        <iframe
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                            title="Creatiendas Demo"
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <>
                            <video
                                ref={videoRef}
                                src={videoSrc}
                                className="w-full h-full object-contain"
                                onClick={togglePlay}
                                playsInline
                                loop
                            />

                            {/* Controls Overlay */}
                            <div
                                className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}
                                onClick={togglePlay}
                            >
                                <button
                                    className="transform transition-transform hover:scale-110 bg-white/20 backdrop-blur-md border border-white/50 rounded-full p-6 text-white shadow-xl"
                                >
                                    {isPlaying ? (
                                        <Pause className="w-12 h-12 fill-current" />
                                    ) : (
                                        <Play className="w-12 h-12 fill-current ml-2" />
                                    )}
                                </button>
                            </div>

                            {/* Bottom Bar */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex items-center justify-end gap-4">
                                    <button onClick={toggleMute} className="text-white hover:text-gray-300">
                                        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
