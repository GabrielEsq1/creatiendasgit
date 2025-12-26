import React from 'react';

export default function HowItWorks() {
  const steps = [
    { title: 'Regístrate gratis', description: 'Crea tu cuenta sin costo y empieza a construir tu tienda.', icon: '📝' },
    { title: 'Sube tus productos', description: 'Añade fotos, precios y descripciones fácilmente.', icon: '📦' },
    { title: 'Comparte tu tienda', description: 'Obtén un enlace o QR y recibe pedidos por WhatsApp.', icon: '📲' },
  ];

  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-black border-y border-white/5">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-black text-white mb-16">Cómo funciona ❄️</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-10 flex flex-col items-center text-center hover:border-green-500/30 transition-all hover:-translate-y-1 shadow-2xl shadow-black"
            >
              <div className="text-5xl mb-6 bg-slate-800/50 w-24 h-24 flex items-center justify-center rounded-3xl shadow-inner">{step.icon}</div>
              <h4 className="text-xl font-black text-white mb-3">{step.title}</h4>
              <p className="text-slate-400 font-medium text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
