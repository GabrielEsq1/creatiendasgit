'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, Circle, Store, Package, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAnalytics } from '../Analytics';

interface Step {
    id: string;
    label: string;
    description: string;
    icon: React.ReactNode;
    isCompleted: boolean;
    actionLabel?: string;
    actionUrl?: string;
}

interface ActivationChecklistProps {
    stores: any[];
}

export default function ActivationChecklist({ stores }: ActivationChecklistProps) {
    const router = useRouter();
    const { trackEvent } = useAnalytics();
    const safeStores = stores || [];
    const hasStore = safeStores.length > 0;
    const firstStore = safeStores[0];
    const hasProducts = firstStore?.productCount > 0;

    const steps: Step[] = [
        {
            id: 'create_store',
            label: 'Crea tu primera tienda',
            description: 'Define el nombre y la dirección web de tu negocio.',
            icon: <Store className="w-5 h-5 text-green-600" />,
            isCompleted: hasStore,
            actionLabel: 'Crear Tienda',
            actionUrl: '/builder'
        },
        {
            id: 'add_products',
            label: 'Sube tu primer producto',
            description: 'Agrega fotos y precios para que tus clientes compren.',
            icon: <Package className="w-5 h-5 text-emerald-600" />,
            isCompleted: hasProducts,
            actionLabel: 'Agregar Producto',
            actionUrl: hasStore ? `/builder?edit=${firstStore.slug}` : undefined
        },
        {
            id: 'share_whatsapp',
            label: 'Configura tu WhatsApp',
            description: 'Ingresa tu número para generar el botón de pedido automático.',
            icon: <MessageSquare className="w-5 h-5 text-teal-600" />,
            isCompleted: hasStore, 
            actionLabel: 'Configurar',
            actionUrl: hasStore ? `/builder?edit=${firstStore.slug}` : undefined
        }
    ];

    const completedCount = steps.filter(s => s.isCompleted).length;
    const progress = (completedCount / steps.length) * 100;

    useEffect(() => {
        if (completedCount === steps.length) {
            const hasBeenTracked = sessionStorage.getItem('ct_activation_tracked');
            if (!hasBeenTracked) {
                trackEvent('activation_completed', {
                    store_id: firstStore?.id,
                    product_count: firstStore?.productCount
                });
                sessionStorage.setItem('ct_activation_tracked', 'true');
            }
        }
    }, [completedCount, steps.length, trackEvent, firstStore]);

    return (
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl mb-8 animate-in fade-in slide-in-from-top-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div>
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        Comienza tu viaje
                        <span className="text-[10px] font-black uppercase tracking-widest text-green-700 bg-green-100 px-3 py-1 rounded-full">
                            {completedCount}/{steps.length} listo
                        </span>
                    </h2>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Sigue estos pasos para activar tu tienda al 100%</p>
                </div>
                {/* Progress Bar */}
                <div className="hidden sm:block w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                    <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
                {steps.map((step, idx) => (
                    <div
                        key={step.id}
                        className={`group p-5 rounded-2xl border transition-all ${step.isCompleted
                            ? 'bg-slate-50 border-slate-100 opacity-70'
                            : 'bg-white border-slate-200 hover:border-green-200 hover:shadow-lg'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${step.isCompleted ? 'bg-green-100' : 'bg-slate-50 group-hover:bg-green-50'
                                }`}>
                                {step.isCompleted ? (
                                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                                ) : (
                                    step.icon
                                )}
                            </div>
                            {!step.isCompleted && step.actionLabel && (
                                <button
                                    onClick={() => step.actionUrl && router.push(step.actionUrl)}
                                    className="text-[10px] font-black uppercase tracking-widest text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-all"
                                >
                                    {step.actionLabel}
                                </button>
                            )}
                        </div>
                        <div>
                            <h4 className={`font-black text-sm mb-1 ${step.isCompleted ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                                {step.label}
                            </h4>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
