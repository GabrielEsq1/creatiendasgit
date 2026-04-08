import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/email';

import { verifyTurnstileToken } from '@/lib/turnstile';

export async function POST(req: Request) {
    const { email, turnstileToken } = await req.json();

    // Verify Turnstile
    const isHuman = await verifyTurnstileToken(turnstileToken);
    if (!isHuman) {
        return NextResponse.json({ error: 'Fallo en la verificación anti-spam' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        // No revelamos si el email existe por seguridad
        return NextResponse.json({ message: 'Si el correo está registrado, recibirás un email con las instrucciones.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await prisma.passwordResetToken.create({
        data: { token, expiresAt, userId: user.id },
    });

    const origin = req.headers.get('origin') || 'https://creatiendas.co';
    const baseUrl = process.env.NODE_ENV === 'production' ? 'https://creatiendas.co' : origin;
    const resetLink = `${baseUrl}/auth/reset-password?token=${token}`;

    const emailSent = await sendPasswordResetEmail(email, resetLink);

    if (emailSent) {
        return NextResponse.json({ message: 'Si el correo está registrado, recibirás un email con las instrucciones.' });
    } else {
        // Solo mostrar debug link en desarrollo
        if (process.env.NODE_ENV === 'development') {
            console.log('🔗 Enlace de reset (simulado):', resetLink);
            return NextResponse.json({
                message: 'Si el correo está registrado, recibirás un email. (Modo Debug: Revisa el enlace abajo)',
                debugLink: resetLink
            });
        } else {
            // En producción, nunca exponer el link
            console.error('❌ Fallo al enviar email de recuperación para:', email);
            return NextResponse.json({ message: 'Si el correo está registrado, recibirás un email con las instrucciones.' });
        }
    }
}
