import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(req: Request) {
    const { email } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        // No revelamos si el email existe
        return NextResponse.json({ message: 'Si el correo está registrado, recibirás un email' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await prisma.passwordResetToken.create({
        data: { token, expiresAt, userId: user.id },
    });

    // En producción aquí se enviaría el email.
    const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

    const emailSent = await sendPasswordResetEmail(email, resetLink);

    if (emailSent) {
        return NextResponse.json({ message: 'Si el correo está registrado, recibirás un email con las instrucciones.' });
    } else {
        // Fallback para desarrollo o si falla el envío (y no hay API Key)
        console.log('🔗 Enlace de reset (simulado):', resetLink);
        return NextResponse.json({
            message: 'Si el correo está registrado, recibirás un email. (Modo Debug: Revisa el enlace abajo)',
            debugLink: resetLink
        });
    }
}
