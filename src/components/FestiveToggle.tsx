'use client';

import { useEffect, useState } from 'react';

export default function FestiveToggle({
    onChange,
}: {
    onChange: (v: boolean) => void;
}) {
    const [on, setOn] = useState(true);

    useEffect(() => {
        const v = localStorage.getItem('festive_snow');
        if (v !== null) {
            const enabled = v === 'true';
            setOn(enabled);
            onChange(enabled);
        }
    }, [onChange]);

    const toggle = () => {
        const v = !on;
        setOn(v);
        localStorage.setItem('festive_snow', String(v));
        onChange(v);
    };

    return (
        <button
            onClick={toggle}
            className="fixed bottom-4 right-4 z-[100] bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-xl border border-slate-100 text-sm font-bold flex items-center gap-2 hover:scale-110 active:scale-95 transition-all group"
        >
            <span className="group-hover:rotate-12 transition-transform">🎄</span>
            <span className="text-slate-700">Felices Fiestas</span>
            <span>{on ? '❄️' : '⛔'}</span>
        </button>
    );
}
