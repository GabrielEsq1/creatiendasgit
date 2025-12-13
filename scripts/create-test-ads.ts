import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Creating test ads...');

    // Find or create a test company and user
    let company = await prisma.company.findFirst();
    if (!company) {
        company = await prisma.company.create({
            data: {
                name: 'Test Company',
            }
        });
    }

    let user = await prisma.user.findFirst({
        where: { role: 'USUARIO' }
    });
    if (!user) {
        const bcrypt = require('bcryptjs');
        const passwordHash = await bcrypt.hash('test123', 10);
        user = await prisma.user.create({
            data: {
                name: 'Test User',
                email: 'test@test.com',
                phone: '+57 300 000 0000',
                passwordHash,
                role: 'USUARIO',
                companyId: company.id,
            }
        });
    }

    // Create a test campaign
    const campaign = await prisma.adCampaign.create({
        data: {
            name: 'Campaña de Prueba',
            objective: 'SALES',
            status: 'ACTIVE',
            industry: 'Tecnología',
            sector: 'B2B',
            targetRoles: JSON.stringify(['CEO', 'CTO', 'Director']),
            dailyBudget: 100000,
            durationDays: 7,
            totalBudget: 700000,
            creativeType: 'IMAGE',
            startDate: new Date(),
            companyId: company.id,
            userId: user.id,
        }
    });

    // Create 3 test ads
    const ads = [
        {
            title: 'Impulsa tu Negocio B2B',
            description: 'Conecta con empresas líderes y expande tu red profesional',
            type: 'IMAGE',
            imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
            approvalStatus: 'PENDING',
        },
        {
            title: 'Soluciones Empresariales',
            description: 'Descubre las mejores herramientas para tu empresa',
            type: 'IMAGE',
            imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
            approvalStatus: 'PENDING',
        },
        {
            title: 'Networking Profesional',
            description: 'Construye relaciones comerciales duraderas',
            type: 'IMAGE',
            imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop',
            approvalStatus: 'PENDING',
        },
    ];

    for (const adData of ads) {
        await prisma.adCreative.create({
            data: {
                ...adData,
                campaignId: campaign.id,
                isActive: true,
                displayOrder: 0,
            }
        });
    }

    console.log('✅ Created 3 test ads successfully!');
    console.log('📋 Campaign:', campaign.name);
    console.log('🏢 Company:', company.name);
    console.log('👤 User:', user.email);
    console.log('\n🔑 Admin credentials:');
    console.log('   Email: admin@example.com');
    console.log('   Password: admin123');
    console.log('\n📍 Admin panel: http://localhost:3000/admin/ads');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
