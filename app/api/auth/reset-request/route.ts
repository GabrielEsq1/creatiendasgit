import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

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

    // En producción aquí se enviaría el email. Por ahora devolvemos el enlace para pruebas.
    const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
    console.log('🔗 Enlace de reset (simulado):', resetLink);

    return NextResponse.json({ message: 'Si el correo está registrado, recibirás un email', debugLink: resetLink });
}
