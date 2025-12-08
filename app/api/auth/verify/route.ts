import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
        return NextResponse.json({ error: 'Token missing' }, { status: 400 });
    }

    // Find user with this verification token
    const user = await prisma.user.findUnique({
        where: { verificationToken: token },
    });

    if (!user) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    // Mark email as verified and clear token
    await prisma.user.update({
        where: { id: user.id },
        data: {
            emailVerified: new Date(),
            verificationToken: null,
        },
    });

    // Redirect to login page (or dashboard) after verification
    const redirectUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(redirectUrl);
}
