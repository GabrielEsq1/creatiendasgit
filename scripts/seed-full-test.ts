import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting full seed...');

    // 1. Create Companies
    console.log('🏢 Creating Companies...');
    const companiesData = [
        { name: 'Tech Solutions Colombia', taxId: '900123456' },
        { name: 'Inversiones SAS', taxId: '900654321' },
        { name: 'Comercializadora Global', taxId: '900987654' },
    ];

    const companies = [];
    for (const c of companiesData) {
        const company = await prisma.company.upsert({
            where: { id: c.name }, // This will likely fail if ID is UUID, so we catch
            update: {},
            create: { name: c.name, taxId: c.taxId },
        }).catch(async () => {
            const existing = await prisma.company.findFirst({ where: { name: c.name } });
            if (existing) return existing;
            return prisma.company.create({ data: c });
        });
        companies.push(company);
    }

    // 2. Create Users
    console.log('👤 Creating Users...');
    const passwordHash = await bcrypt.hash('usuario123', 10);
    const adminPasswordHash = await bcrypt.hash('admin123', 10);

    const usersData = [
        { name: 'Juan Pérez', email: 'juan@example.com', phone: '+573001234567', role: 'USUARIO', companyIndex: 0 },
        { name: 'María García', email: 'maria@example.com', phone: '+573001234568', role: 'USUARIO', companyIndex: 1 },
        { name: 'Carlos López', email: 'carlos@example.com', phone: '+573001234569', role: 'USUARIO', companyIndex: 2 },
        { name: 'Ana Martínez', email: 'ana@example.com', phone: '+573001234570', role: 'USUARIO', companyIndex: 0 },
        { name: 'Pedro Sánchez', email: 'pedro@example.com', phone: '+573001234571', role: 'USUARIO', companyIndex: 1 },
        { name: 'Admin User', email: 'admin@example.com', phone: '+573009999999', role: 'ADMIN_EMPRESA', companyIndex: 0 },
    ];

    const users = [];
    for (const u of usersData) {
        // Try to find by email or phone to avoid unique constraint errors
        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: u.email },
                    { phone: u.phone }
                ]
            }
        });

        if (user) {
            // Update existing user
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    name: u.name,
                    email: u.email,
                    phone: u.phone,
                    passwordHash: u.role === 'ADMIN_EMPRESA' ? adminPasswordHash : passwordHash,
                    role: u.role,
                    companyId: companies[u.companyIndex].id,
                }
            });
        } else {
            // Create new user
            user = await prisma.user.create({
                data: {
                    name: u.name,
                    email: u.email,
                    phone: u.phone,
                    passwordHash: u.role === 'ADMIN_EMPRESA' ? adminPasswordHash : passwordHash,
                    role: u.role,
                    companyId: companies[u.companyIndex].id,
                },
            });
        }
        users.push(user);
    }

    // 3. Create Connections (All companies connected)
    console.log('🔗 Creating Connections...');
    for (let i = 0; i < companies.length; i++) {
        for (let j = i + 1; j < companies.length; j++) {
            await prisma.companyConnection.upsert({
                where: {
                    companyAId_companyBId: {
                        companyAId: companies[i].id,
                        companyBId: companies[j].id,
                    },
                },
                update: {},
                create: {
                    companyAId: companies[i].id,
                    companyBId: companies[j].id,
                    status: 'ACCEPTED',
                },
            });
        }
    }

    // 4. Create Groups
    console.log('👥 Creating Groups...');
    const groupsData = [
        { name: 'Ventas B2B', description: 'Grupo de ventas', createdBy: users[0] },
        { name: 'Networking Bogotá', description: 'Eventos y contactos', createdBy: users[1] },
    ];

    const groups = [];
    for (const g of groupsData) {
        let group = await prisma.group.findFirst({ where: { name: g.name } });
        if (!group) {
            group = await prisma.group.create({
                data: {
                    name: g.name,
                    description: g.description,
                    createdById: g.createdBy.id,
                    members: {
                        create: { userId: g.createdBy.id, isAdmin: true }
                    }
                }
            });
        }
        groups.push(group);
    }

    // Add other users to groups
    for (const group of groups) {
        for (const user of users) {
            const isMember = await prisma.groupMember.findUnique({
                where: { groupId_userId: { groupId: group.id, userId: user.id } }
            });
            if (!isMember) {
                await prisma.groupMember.create({
                    data: { groupId: group.id, userId: user.id }
                });
            }
        }
    }

    // 5. Create Conversations (6 Chats)
    console.log('💬 Creating Conversations...');
    // Direct chats
    const chatPairs = [
        [users[0], users[1]],
        [users[0], users[2]],
        [users[1], users[2]],
        [users[3], users[4]],
        [users[5], users[0]], // Admin with Juan
    ];

    for (const [userA, userB] of chatPairs) {
        let conversation = await prisma.conversation.findFirst({
            where: {
                type: 'USER_USER',
                OR: [
                    { userAId: userA.id, userBId: userB.id },
                    { userAId: userB.id, userBId: userA.id },
                ]
            }
        });

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    type: 'USER_USER',
                    userAId: userA.id,
                    userBId: userB.id,
                }
            });
        }

        // Add messages
        await prisma.message.create({
            data: {
                conversationId: conversation.id,
                senderUserId: userA.id,
                text: `Hola ${userB.name}, ¿cómo estás?`,
            }
        });
        await prisma.message.create({
            data: {
                conversationId: conversation.id,
                senderUserId: userB.id,
                text: `Hola ${userA.name}, todo bien por acá.`,
            }
        });
    }

    // Group chats
    for (const group of groups) {
        let conversation = await prisma.conversation.findFirst({
            where: { groupId: group.id }
        });

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    type: 'USER_USER',
                    groupId: group.id
                }
            });
        }

        await prisma.message.create({
            data: {
                conversationId: conversation.id,
                senderUserId: users[0].id,
                text: `Bienvenidos al grupo ${group.name}!`,
            }
        });
    }

    // 6. Create Ads
    console.log('📢 Creating Ads...');
    const campaignData = {
        name: 'Campaña Verano 2025',
        objective: 'SALES',
        status: 'ACTIVE',
        industry: 'Retail',
        dailyBudget: 50000,
        durationDays: 30,
        totalBudget: 1500000,
        companyId: companies[0].id,
        userId: users[5].id, // Admin
        creativeType: 'IMAGE',
    };

    const campaign = await prisma.adCampaign.create({
        data: campaignData
    });

    await prisma.adCreative.create({
        data: {
            campaignId: campaign.id,
            title: 'Gran Venta',
            description: 'Descuentos del 50%',
            imageUrl: 'https://via.placeholder.com/300',
            type: 'IMAGE',
            isActive: true
        }
    });

    console.log('✅ Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
