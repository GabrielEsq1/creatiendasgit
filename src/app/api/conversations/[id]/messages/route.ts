import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/conversations/[id]/messages - Get messages for a conversation
export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "No autenticado" },
                { status: 401 }
            );
        }

        // Verify user is part of conversation
        const conversation = await prisma.conversation.findUnique({
            where: { id: params.id },
        });

        if (!conversation) {
            return NextResponse.json(
                { error: "Conversación no encontrada" },
                { status: 404 }
            );
        }

        if (conversation.userAId !== session.user.id && conversation.userBId !== session.user.id) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 403 }
            );
        }

        const messages = await prisma.message.findMany({
            where: {
                conversationId: params.id,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        avatar: true,
                    },
                },
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        return NextResponse.json({ messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json(
            { error: "Error al obtener mensajes" },
            { status: 500 }
        );
    }
}
