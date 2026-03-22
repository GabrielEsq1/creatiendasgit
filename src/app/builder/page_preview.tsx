'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, ImagePlus, Trash2, Smartphone, Monitor } from 'lucide-react';
import StorePreview from '@/components/StorePreview';

// Tipos definidos explícitamente para evitar problemas de "any"
interface StoreData {
    name: string;
    description: string;
    desc?: string; // fallback for StorePreview
    whatsapp: string;
    color: string;
    logo: string | null;
    banner?: string;
    title?: string;
    font?: string;
    socials?: any;
    about?: any;
    careers?: any;
    id?: string;
}

interface Product {
    id: number;
    name: string;
    price: string;
    image: string | null;
    description: string;
    category: string;
}

const DEFAULT_STORE: StoreData = {
    name: 'Mi Nueva Tienda',
    description: 'Descripción breve de tu negocio...',
    whatsapp: '',
    color: '#10B981', // Verde default
    logo: null,
};

function BuilderContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();

    // Estados principales
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [storeId, setStoreId] = useState<string | null>(null);
    const [storeData, setStoreData] = useState<StoreData>(DEFAULT_STORE);
    const [products, setProducts] = useState<Product[]>([]);

    // Vista previa
    const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');

    // Cargar datos
    useEffect(() => {
        const loadInitialData = async () => {
            if (status === 'loading') return;
            if (!session) {
                // Si no hay sesión, dejar cargar por defecto (modo demo o redirigir después)
                // En este caso, asumimos que el middleware protege o permitimos modo demo limitado
                setLoading(false);
                return;
            }

            const editId = searchParams?.get('edit');

            if (editId) {
                try {
                    const res = await fetch(`/api/stores/${editId}`);
                    if (res.ok) {
                        const data = await res.json();
                        setStoreId(editId);

                        // SANITIZACIÓN CRÍTICA: Asegurar que NINGÚN campo sea null
                        setStoreData({
                            name: data.name || '',
                            description: data.description || '', // Asumiendo que viene en data o data.data
                            whatsapp: data.phone || data.whatsapp || '',
                            color: data.color || '#10B981',
                            logo: data.logo || undefined,
                            banner: data.banner || undefined
                        });

                        // Cargar productos si existen
                        if (data.products && Array.isArray(data.products)) {
                            setProducts(data.products);
                        } else if (data.products) {
                            // Caso donde products es un objeto JSON raro
                            setProducts([]);
                        }
                    } else {
                        console.error("Error al cargar tienda:", await res.text());
                        // Fallback a defaults si falla la carga
                    }
                } catch (e) {
                    console.error("Error de red cargando tienda", e);
                }
            }
            // Si no hay editId, es una tienda nueva, usamos defaults
            setLoading(false);
        };

        loadInitialData();
    }, [session, status, searchParams]);

    // Manejadores de cambios
    const handleChange = (field: keyof StoreData, value: string) => {
        setStoreData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!session) {
            router.push('/auth/login?returnTo=/builder');
            return;
        }

        if (!storeData.name.trim()) {
            alert('Por favor ponle un nombre a tu tienda');
            return;
        }
        if (!storeData.whatsapp.trim()) {
            alert('El número de WhatsApp es obligatorio para recibir pedidos');
            return;
        }

        setSaving(true);

        try {
            // Preparar payload limpio
            const payload = {
                name: storeData.name,
                description: storeData.description,
                phone: storeData.whatsapp, // Backend espera phone o whatsapp? Ajustar según API
                whatsapp: storeData.whatsapp,
                color: storeData.color,
                logo: storeData.logo,
                banner: storeData.banner,
                products: products
            };

            const method = storeId ? 'PUT' : 'POST';
            const url = storeId ? `/api/stores/${storeId}` : '/api/stores';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                throw new Error('Error al guardar');
            }

            const savedStore = await res.json();

            // Navegar a éxito
            window.location.href = `/builder/share?slug=${savedStore.slug || 'unknown'}&storeName=${encodeURIComponent(storeData.name)}`;

        } catch (error) {
            console.error(error);
            alert('Hubo un error al guardar tu tienda. Por favor intenta de nuevo.');
            setSaving(false);
        }
    };

    // UI de Carga
    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
            </div>
        );
    }

    // UI Principal
    return (
        <div className="flex h-screen bg-slate-100 overflow-hidden">
            {/* PANEL IZQUIERDO: Editor */}
            <div className="w-full lg:w-[450px] bg-white border-r border-slate-200 flex flex-col h-full z-10 shadow-xl">
                {/* Header Editor */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
                    <Link href="/dashboard" className="text-slate-500 hover:bg-slate-50 p-2 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="font-bold text-slate-800">Editor de Tienda</h1>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? 'Guardando...' : 'Publicar'}
                    </button>
                </div>

                {/* Formulario Scrolleable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Sección 1: Identidad */}
                    <section className="space-y-4">
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Información Básica</h2>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre de la Tienda</label>
                            <input
                                type="text"
                                value={storeData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="Ej: Las Delicias de Juan"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Descripción</label>
                            <textarea
                                value={storeData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="¿Qué vendes? Cuéntale a tus clientes..."
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">WhatsApp (Para recibir pedidos)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-3.5 text-slate-400 font-bold">📞</span>
                                <input
                                    type="tel"
                                    value={storeData.whatsapp}
                                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                                    placeholder="300 123 4567"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all font-mono"
                                />
                            </div>
                            <p className="text-xs text-slate-400 mt-1">Aquí te llegarán los mensajes de tus clientes.</p>
                        </div>
                    </section>

                    <hr className="border-slate-100" />

                    {/* Sección 2: Apariencia */}
                    <section className="space-y-4">
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Personalización</h2>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3">Color de Marca</label>
                            <div className="flex flex-wrap gap-3">
                                {['#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#EF4444', '#F59E0B', '#111827'].map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => handleChange('color', c)}
                                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${storeData.color === c ? 'border-slate-900 scale-110' : 'border-transparent'}`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                                <input
                                    type="color"
                                    value={storeData.color}
                                    onChange={(e) => handleChange('color', e.target.value)}
                                    className="w-8 h-8 rounded-full overflow-hidden cursor-pointer border-0 p-0"
                                />
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* PANEL DERECHO: Previsualización */}
            <div className="flex-1 bg-slate-100 relative flex flex-col hidden lg:flex">
                {/* Toolbar Preview */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur shadow-lg rounded-full p-2 flex gap-2 z-20 border border-slate-200">
                    <button
                        onClick={() => setViewMode('mobile')}
                        className={`p-2 rounded-full transition-all ${viewMode === 'mobile' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-700'}`}
                    >
                        <Smartphone className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('desktop')}
                        className={`p-2 rounded-full transition-all ${viewMode === 'desktop' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-700'}`}
                    >
                        <Monitor className="w-5 h-5" />
                    </button>
                </div>

                {/* Canvas de Preview */}
                <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
                    <div
                        className={`transition-all duration-500 ease-in-out bg-white shadow-2xl border-4 border-slate-900 overflow-hidden relative ${viewMode === 'mobile'
                            ? 'w-[375px] h-[750px] rounded-[3rem]'
                            : 'w-full max-w-5xl h-[800px] rounded-xl'
                            }`}
                    >
                        {/* Notch para modo móvil */}
                        {viewMode === 'mobile' && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-7 bg-slate-900 rounded-b-xl z-20"></div>
                        )}

                        {/* El componente StorePreview seguro de usar */}
                        <div className="w-full h-full overflow-y-auto scrollbar-hide">
                            <StorePreview data={storeData as any} products={products as any} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function BuilderPage() {
    return (
        <Suspense fallback={<div className="h-screen bg-white" />}>
            <BuilderContent />
        </Suspense>
    );
}
