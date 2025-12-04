'use client';

import { useState } from "react";
import { MessageSquare, Store, Wallet, X } from "lucide-react";

export default function B2BChatCreatiendas() {
  const [walletBalance, setWalletBalance] = useState(125000);
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-6 grid gap-6 font-sans">
      <header className="text-center">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">B2BChat + CreaTiendas</h1>
        <p className="text-gray-600 text-lg">Comunicación B2B, creación de tiendas y ventas en un solo lugar.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto w-full">
        {/* B2BChat Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4 text-purple-600">
            <MessageSquare className="w-6 h-6" />
            <h2 className="text-2xl font-semibold text-gray-900">B2BChat</h2>
          </div>
          <p className="text-gray-700 mb-6">Chat avanzado con IA para segmentar usuarios, enviar campañas y automatizar comunicación B2B.</p>
          <input 
            type="text" 
            placeholder="Buscar empresas, contactos o segmentos..." 
            className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
            Abrir Panel de Campañas
          </button>
        </div>

        {/* CreaTiendas Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4 text-blue-600">
            <Store className="w-6 h-6" />
            <h2 className="text-2xl font-semibold text-gray-900">CreaTiendas</h2>
          </div>
          <p className="text-gray-700 mb-6">Crea tu tienda en minutos, integra pagos y gestiona pedidos con automatización inteligente.</p>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors mt-auto">
            Crear nueva tienda
          </button>
        </div>
      </div>

      <footer className="text-center mt-10 text-gray-500">© 2025 Plataforma Unificada</footer>

      {/* BOTÓN FLOTANTE DEL MONEDERO */}
      <button 
        onClick={() => setIsWalletOpen(true)}
        className="fixed bottom-6 right-6 bg-black hover:bg-gray-800 text-white rounded-full p-4 shadow-xl transition-all hover:scale-105 z-50"
      >
        <Wallet className="w-6 h-6" />
      </button>

      {/* POPUP DEL MONEDERO (Custom Modal) */}
      {isWalletOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Monedero Digital</h3>
                <button 
                  onClick={() => setIsWalletOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center py-4">
                <h2 className="text-4xl font-bold mb-2 text-gray-900">${walletBalance.toLocaleString()}</h2>
                <p className="text-gray-600 mb-8">Saldo disponible</p>

                <div className="grid grid-cols-2 gap-4">
                  <button className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-md transition-colors">
                    Recargar
                  </button>
                  <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-medium py-2 px-4 rounded-md transition-colors">
                    Retirar
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 text-center text-sm text-gray-500">
              Transacciones seguras con PayPal & Stripe
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
