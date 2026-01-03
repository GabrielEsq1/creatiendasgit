import React from 'react';

export default function BenefitsEN() {
    const items = [
        { title: 'Easy and Fast', icon: '⚡', description: 'Create and launch your store in minutes.' },
        { title: 'Everything on WhatsApp', icon: '📲', description: 'Manage orders directly from WhatsApp.' },
        { title: 'Customize your brand', icon: '🎨', description: 'Colors, logo and your own domain.' },
        { title: 'No commissions', icon: '💰', description: 'All income is 100% yours.' },
        { title: 'Works on any device', icon: '📱', description: 'Responsive and mobile-first.' },
        { title: 'Manage products easily', icon: '🗂️', description: 'Simple panel to add and edit products.' },
    ];

    return (
        <section className="py-24 px-4 md:px-8 lg:px-16 bg-white border-y border-slate-100">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-black text-center text-slate-900 mb-12">
                    Key Benefits
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-white border border-slate-100 rounded-3xl p-8 flex flex-col items-center text-center hover:border-green-500/30 transition-all hover:-translate-y-1 shadow-xl shadow-slate-200"
                        >
                            <div className="text-5xl mb-6 bg-slate-50 w-20 h-20 flex items-center justify-center rounded-2xl shadow-inner">{item.icon}</div>
                            <h4 className="text-xl font-bold text-slate-900 mb-3">
                                {item.title}
                            </h4>
                            <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
