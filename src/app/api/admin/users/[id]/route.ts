import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET - Fetch single user with stores
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: params.id },
            include: {
                stores: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Don't send password hash to frontend
        const { passwordHash, ...userWithoutPassword } = user;

        return NextResponse.json({ user: userWithoutPassword });
    } catch (error: any) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH - Update user details
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, email, plan, role, newPassword } = body;

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (plan !== undefined) updateData.plan = plan;
        if (role !== undefined) updateData.role = role;

        // Handle password change if provided
        if (newPassword && newPassword.trim().length >= 6) {
            const passwordHash = await bcrypt.hash(newPassword, 10);
            updateData.passwordHash = passwordHash;
        }

        const updated = await prisma.user.update({
            where: { id: params.id },
            data: updateData,
        });

        const { passwordHash, ...userWithoutPassword } = updated;

        return NextResponse.json({
            success: true,
            user: userWithoutPassword,
        });
    } catch (error: any) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - Delete user and all their stores
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        const allowedRoles = ['ADMIN', 'SUPERADMIN'];

        if (!session?.user || !allowedRoles.includes((session.user as any).role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = params.id;

        // Start a transaction for deep cleanup
        await prisma.$transaction(async (tx) => {
            // 1. Delete Advertising data
            const campaigns = await tx.adCampaign.findMany({ where: { userId } });
            const campaignIds = campaigns.map(c => c.id);
            if (campaignIds.length > 0) {
                await tx.adCreativeStats.deleteMany({ where: { creative: { campaignId: { in: campaignIds } } } });
                await tx.adCreative.deleteMany({ where: { campaignId: { in: campaignIds } } });
                await tx.adCampaign.deleteMany({ where: { userId } });
            }

            // 2. Delete Creatiendas data
            await tx.store.deleteMany({ where: { ownerId: userId } });

            // 3. Delete Monedera (Wallet) data
            const wallet = await tx.walletAccount.findUnique({ where: { userId } });
            if (wallet) {
                await tx.transaction.deleteMany({ where: { accountId: wallet.id } });
                await tx.walletAccount.delete({ where: { id: wallet.id } });
            }
            await tx.stripeCustomer.deleteMany({ where: { userId } });

            // 4. Delete Auth & Session data
            await tx.passwordResetToken.deleteMany({ where: { userId } });

            // 5. Delete B2BChat & Social data
            await tx.groupMember.deleteMany({ where: { userId } });
            await tx.message.deleteMany({ where: { senderId: userId } });
            await tx.contact.deleteMany({ where: { OR: [{ userId }, { contactId: userId }] } });

            // Note: We don't delete groups created by the user to avoid orphaned members, 
            // but we could transfer ownership if needed. For extreme Q&A, we just clean up.
            await tx.group.deleteMany({ where: { createdById: userId } });

            // 6. Finally delete the user
            await tx.user.delete({
                where: { id: userId },
            });
        });

        return NextResponse.json({
            success: true,
            message: 'User and all related data deleted successfully',
        });
    } catch (error: any) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
