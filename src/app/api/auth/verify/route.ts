import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
        const url = new URL('/auth/login?error=token_missing', request.url);
        return NextResponse.redirect(url);
    }

    // Find user with this verification token
    const user = await prisma.user.findUnique({
        where: { verificationToken: token },
    });

    if (!user) {
        // Token not found — maybe already used or invalid
        const url = new URL('/auth/login?error=invalid_token', request.url);
        return NextResponse.redirect(url);
    }

    if (user.emailVerified) {
        // Already verified — just redirect to login
        const url = new URL('/auth/login?verified=already', request.url);
        return NextResponse.redirect(url);
    }

    // Mark email as verified and clear token
    await prisma.user.update({
        where: { id: user.id },
        data: {
            emailVerified: new Date(),
            verificationToken: null,
        },
    });

    // Redirect to login with success flag
    const url = new URL('/auth/login?verified=true', request.url);
    return NextResponse.redirect(url);
}
