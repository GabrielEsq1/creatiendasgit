import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/conversations - List user's conversations
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "No autenticado" },
                { status: 401 }
            );
        }

        const conversations = await prisma.conversation.findMany({
            where: {
                OR: [
                    { userAId: session.user.id },
                    { userBId: session.user.id },
                ],
            },
            include: {
                userA: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        avatar: true,
                    },
                },
                userB: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        avatar: true,
                    },
                },
                messages: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 1,
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
        });

        // Format conversations with other user info
        const formattedConversations = conversations.map(conv => {
            const otherUser = conv.userAId === session.user.id ? conv.userB : conv.userA;
            const lastMessage = conv.messages[0];

            return {
                id: conv.id,
                otherUser,
                lastMessage: lastMessage ? {
                    text: lastMessage.text,
                    createdAt: lastMessage.createdAt,
                    isRead: lastMessage.readAt !== null,
                } : null,
                updatedAt: conv.updatedAt,
            };
        });

        return NextResponse.json({ conversations: formattedConversations });
    } catch (error) {
        console.error("Error fetching conversations:", error);
        return NextResponse.json(
            { error: "Error al obtener conversaciones" },
            { status: 500 }
        );
    }
}

// POST /api/conversations - Create new conversation
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "No autenticado" },
                { status: 401 }
            );
        }

        const { phone } = await req.json();

        if (!phone) {
            return NextResponse.json(
                { error: "Número de teléfono requerido" },
                { status: 400 }
            );
        }

        // Find user by phone
        const otherUser = await prisma.user.findFirst({
            where: { phone },
        });

        if (!otherUser) {
            return NextResponse.json(
                { error: "Usuario no encontrado" },
                { status: 404 }
            );
        }

        if (otherUser.id === session.user.id) {
            return NextResponse.json(
                { error: "No puedes crear una conversación contigo mismo" },
                { status: 400 }
            );
        }

        // Check if conversation already exists
        const existingConversation = await prisma.conversation.findFirst({
            where: {
                OR: [
                    { userAId: session.user.id, userBId: otherUser.id },
                    { userAId: otherUser.id, userBId: session.user.id },
                ],
            },
        });

        if (existingConversation) {
            return NextResponse.json({
                conversation: existingConversation,
                message: "Conversación ya existe",
            });
        }

        // Create new conversation
        const conversation = await prisma.conversation.create({
            data: {
                type: "USER_USER",
                userAId: session.user.id,
                userBId: otherUser.id,
            },
            include: {
                userA: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        avatar: true,
                    },
                },
                userB: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        avatar: true,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            conversation,
        });
    } catch (error) {
        console.error("Error creating conversation:", error);
        return NextResponse.json(
            { error: "Error al crear conversación" },
            { status: 500 }
        );
    }
}
