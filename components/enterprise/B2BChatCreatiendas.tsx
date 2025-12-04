"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare, Store, Wallet } from "lucide-react";
import Monedera from "../Monedera";

export default function B2BChatCreatiendas() {

    return (
        <div className="min-h-screen bg-gray-50 p-6 grid gap-6">
            <header className="text-center">
                <h1 className="text-4xl font-bold mb-2">B2BChat + CreaTiendas</h1>
                <p className="text-gray-600 text-lg">Comunicación B2B, creación de tiendas y ventas en un solo lugar.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="rounded-2xl shadow p-4">
                    <CardContent>
                        <div className="flex items-center gap-2 mb-4">
                            <MessageSquare className="w-6 h-6" />
                            <h2 className="text-2xl font-semibold">B2BChat</h2>
                        </div>
                        <p className="text-gray-700 mb-4">Chat avanzado con IA para segmentar usuarios, enviar campañas y automatizar comunicación B2B.</p>
                        <Input placeholder="Buscar empresas, contactos o segmentos..." className="mb-3" />
                        <Button className="w-full">Abrir Panel de Campañas</Button>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl shadow p-4">
                    <CardContent>
                        <div className="flex items-center gap-2 mb-4">
                            <Store className="w-6 h-6" />
                            <h2 className="text-2xl font-semibold">CreaTiendas</h2>
                        </div>
                        <p className="text-gray-700 mb-4">Crea tu tienda en minutos, integra pagos y gestiona pedidos con automatización inteligente.</p>
                        <Button className="w-full">Crear nueva tienda</Button>
                    </CardContent>
                </Card>
            </div>

            <footer className="text-center mt-10 text-gray-500">© 2025 Plataforma Unificada</footer>

            {/* POPUP DEL MONEDERO */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="fixed bottom-6 right-6 rounded-full p-5 shadow-xl" size="icon">
                        <Wallet className="w-6 h-6" />
                    </Button>
                </DialogTrigger>

                <DialogContent className="max-w-5xl h-[90vh] overflow-y-auto p-0">
                    <Monedera />
                </DialogContent>
            </Dialog>
        </div>
    );
}
