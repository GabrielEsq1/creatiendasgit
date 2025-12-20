'use client';

import React from 'react';
import { CheckCircle2, Circle, Store, Package, Image, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

export default function ActivationChecklistEN({ stores }: ActivationChecklistProps) {
    const router = useRouter();
    const safeStores = stores || [];
    const hasStore = safeStores.length > 0;
    const firstStore = safeStores[0];
    const hasProducts = firstStore?.productCount > 0;

    const steps: Step[] = [
        {
            id: 'create_store',
            label: 'Create your first store',
            description: 'Define the name and web address of your business.',
            icon: <Store className="w-5 h-5 text-purple-600" />,
            isCompleted: hasStore,
            actionLabel: 'Create Store',
            actionUrl: '/en/builder'
        },
        {
            id: 'add_products',
            label: 'Upload your first product',
            description: 'Add photos and prices for your customers to buy.',
            icon: <Package className="w-5 h-5 text-blue-600" />,
            isCompleted: hasProducts,
            actionLabel: 'Add Product',
            actionUrl: hasStore ? `/en/builder?edit=${firstStore.slug}` : undefined
        },
        {
            id: 'share_whatsapp',
            label: 'Configure your WhatsApp',
            description: 'Enter your number to generate the automatic order button.',
            icon: <MessageSquare className="w-5 h-5 text-green-600" />,
            isCompleted: hasStore,
            actionLabel: 'Configure',
            actionUrl: hasStore ? `/en/builder?edit=${firstStore.slug}` : undefined
        }
    ];

    const completedCount = steps.filter(s => s.isCompleted).length;
    const progress = (completedCount / steps.length) * 100;

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-8 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        🚀 Start your journey
                        <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            {completedCount}/{steps.length} completed
                        </span>
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Follow these steps to activate your store 100%</p>
                </div>
                {/* Progress Bar */}
                <div className="hidden sm:block w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="space-y-3">
                {steps.map((step, idx) => (
                    <div
                        key={step.id}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${step.isCompleted
                            ? 'bg-slate-50 border-slate-100 opacity-70'
                            : 'bg-white border-slate-200 hover:border-purple-200 hover:shadow-md'
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.isCompleted ? 'bg-green-100' : 'bg-slate-100'
                                }`}>
                                {step.isCompleted ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                ) : (
                                    <Circle className="w-5 h-5 text-slate-400" />
                                )}
                            </div>
                            <div>
                                <h4 className={`font-semibold ${step.isCompleted ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                                    {step.label}
                                </h4>
                                <p className="text-xs text-slate-500 hidden sm:block">{step.description}</p>
                            </div>
                        </div>

                        {!step.isCompleted && step.actionLabel && (
                            <button
                                onClick={() => step.actionUrl && router.push(step.actionUrl)}
                                className="text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                {step.actionLabel}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
