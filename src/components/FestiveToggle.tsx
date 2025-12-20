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
    }, []);

    const toggle = () => {
        const v = !on;
        setOn(v);
        localStorage.setItem('festive_snow', String(v));
        onChange(v);
    };

    return (
        <button
            onClick={toggle}
            style={{
                position: 'fixed',
                bottom: 16,
                right: 16,
                zIndex: 50,
                background: '#020617',
                color: '#fff',
                borderRadius: 999,
                padding: '8px 14px',
                fontSize: 13,
            }}
            className="shadow-lg hover:scale-105 transition-transform font-medium border border-slate-700"
        >
            🎄 Felices Fiestas {on ? '❄️' : '⛔'}
        </button>
    );
}
