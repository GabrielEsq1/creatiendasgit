'use client';

import { useEffect } from 'react';

export default function WidgetsDemoPage() {
    useEffect(() => {
        // Redirect to public demo file
        window.location.href = '/widgets-demo.html';
    }, []);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontFamily: 'system-ui, sans-serif'
        }}>
            <div style={{ textAlign: 'center' }}>
                <h1>Redirigiendo a Demo...</h1>
                <p>Un momento por favor</p>
            </div>
        </div>
    );
}
