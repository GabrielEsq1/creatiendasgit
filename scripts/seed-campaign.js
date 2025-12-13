const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        // Find a user to assign the campaign to
        const user = await prisma.user.findFirst();
        if (!user) {
            console.log('No user found. Please register a user first.');
            return;
        }

        // Find or create a company for the user
        let company = await prisma.company.findFirst({
            where: { users: { some: { id: user.id } } }
        });

        if (!company) {
            company = await prisma.company.create({
                data: {
                    name: 'Test Company',
                    users: { connect: { id: user.id } }
                }
            });
        }

        // Create a campaign
        const campaign = await prisma.adCampaign.create({
            data: {
                name: 'Marketplace Ad Test',
                objective: 'SALES',
                status: 'ACTIVE',
                startDate: new Date(),
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                totalBudget: 500000,
                dailyBudget: 50000,
                durationDays: 7,
                companyId: company.id,
                userId: user.id,
                creativeType: 'IMAGE',
                creativeText: 'Esta es una oferta increíble para el marketplace.',
                creativeUrl: 'https://example.com',
                creatives: {
                    create: [
                        {
                            title: 'Producto Destacado',
                            type: 'IMAGE',
                            imageUrl: '/uploads/campaigns/campaign_test_product_1764104131561.png',
                            description: 'Descubre nuestro producto estrella',
                            isActive: true,
                            displayOrder: 1
                        },
                        {
                            title: 'Banner Promocional',
                            type: 'IMAGE',
                            imageUrl: '/uploads/campaigns/campaign_test_banner_1764104144061.png',
                            description: 'Ofertas especiales por tiempo limitado',
                            isActive: true,
                            displayOrder: 2
                        },
                        {
                            title: 'Promoción Especial',
                            type: 'IMAGE',
                            imageUrl: '/uploads/campaigns/campaign_test_promo_1764104156368.png',
                            description: 'No te pierdas esta oportunidad única',
                            isActive: true,
                            displayOrder: 3
                        }
                    ]
                }
            }
        });

        console.log('Campaign created with 3 creatives:', campaign);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
