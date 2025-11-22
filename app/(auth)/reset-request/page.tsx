'use client';
import { useState } from 'react';

export default function ResetRequestPage() {
    const [email, setEmail] = useState('');
    const [msg, setMsg] = useState<string | null>(null);

    const handle = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/auth/reset-request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        const data = await res.json();
        setMsg(data.message ?? 'Se ha enviado el email (si existe).');
        if (data.debugLink) console.log('Enlace de prueba:', data.debugLink);
    };

    return (
        <section className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4 text-center">Recuperar contraseña</h1>
            {msg && <p className="mb-2 text-green-600">{msg}</p>}
            <form onSubmit={handle} className="space-y-4">
                <input type="email" placeholder="Correo registrado" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" />
                <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Enviar enlace</button>
            </form>
        </section>
    );
}
