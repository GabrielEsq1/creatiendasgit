const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database with 15 users and 30+ conversations...');

    // Delete existing data
    await prisma.message.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.user.deleteMany();
    await prisma.company.deleteMany();

    // Create test companies
    const companies = await Promise.all([
        prisma.company.create({ data: { id: 'comp-1', name: 'Tech Solutions Colombia', taxId: '900123456-7' } }),
        prisma.company.create({ data: { id: 'comp-2', name: 'Digital Marketing Pro', taxId: '900234567-8' } }),
        prisma.company.create({ data: { id: 'comp-3', name: 'Logistics Express', taxId: '900345678-9' } }),
        prisma.company.create({ data: { id: 'comp-4', name: 'Business Consulting', taxId: '900456789-0' } }),
        prisma.company.create({ data: { id: 'comp-5', name: 'FinTech Solutions', taxId: '900567890-1' } }),
    ]);

    console.log('✅ Companies created');

    // 15 test users
    const usersData = [
        { name: 'Carlos Rodríguez', phone: '+573001234567', email: 'carlos@techsolutions.co', position: 'CEO', bio: 'Emprendedor apasionado por la tecnología y la innovación. 15 años de experiencia en el sector B2B.', website: 'https://techsolutions.co', industry: 'Tecnología', companyId: companies[0].id },
        { name: 'María González', phone: '+573009876543', email: 'maria@digitalmarketing.co', position: 'Directora de Marketing', bio: 'Especialista en marketing digital B2B. Ayudo a empresas a crecer en el mundo digital.', website: 'https://digitalmarketing.co', industry: 'Marketing Digital', companyId: companies[1].id },
        { name: 'Juan Pérez', phone: '+573005551234', email: 'juan@logistics.co', position: 'Gerente de Operaciones', bio: 'Experto en logística y cadena de suministro. Optimizo procesos empresariales.', website: 'https://logistics.co', industry: 'Logística', companyId: companies[2].id },
        { name: 'Ana Martínez', phone: '+573007778888', email: 'ana@consulting.co', position: 'Consultora Senior', bio: 'Consultora de negocios con enfoque en transformación digital y estrategia empresarial.', website: 'https://consulting.co', industry: 'Consultoría', companyId: companies[3].id },
        { name: 'Luis Hernández', phone: '+573003334444', email: 'luis@fintech.co', position: 'Director Financiero', bio: 'CFO con experiencia en fintech y soluciones de pago B2B.', website: 'https://fintech.co', industry: 'Finanzas', companyId: companies[4].id },
        { name: 'Laura Sánchez', phone: '+573002221111', email: 'laura@ecommerce.co', position: 'CEO E-commerce', bio: 'Fundadora de plataforma de e-commerce B2B. Conectando empresas con proveedores.', website: 'https://ecommerce.co', industry: 'E-commerce' },
        { name: 'Diego Torres', phone: '+573006665555', email: 'diego@software.co', position: 'CTO', bio: 'Desarrollador de software empresarial. Especialista en soluciones cloud.', website: 'https://software.co', industry: 'Software' },
        { name: 'Camila Ruiz', phone: '+573004443333', email: 'camila@hr.co', position: 'Directora de RRHH', bio: 'Gestión de talento humano para empresas tech. Reclutamiento especializado.', website: 'https://hr.co', industry: 'Recursos Humanos' },
        { name: 'Andrés López', phone: '+573008887777', email: 'andres@legal.co', position: 'Abogado Corporativo', bio: 'Asesoría legal para startups y empresas tecnológicas.', website: 'https://legal.co', industry: 'Legal' },
        { name: 'Valentina Castro', phone: '+573001112222', email: 'valentina@design.co', position: 'Diseñadora UX/UI', bio: 'Diseño de experiencias digitales para productos B2B.', website: 'https://design.co', industry: 'Diseño' },
        { name: 'Santiago Vargas', phone: '+573005554444', email: 'santiago@sales.co', position: 'Director Comercial', bio: 'Estrategias de ventas B2B. Cierro negocios grandes.', website: 'https://sales.co', industry: 'Ventas' },
        { name: 'Isabella Moreno', phone: '+573009998888', email: 'isabella@content.co', position: 'Content Manager', bio: 'Creación de contenido B2B. Marketing de contenidos y SEO.', website: 'https://content.co', industry: 'Marketing de Contenidos' },
        { name: 'Mateo Ramírez', phone: '+573003332222', email: 'mateo@data.co', position: 'Data Scientist', bio: 'Análisis de datos y machine learning para empresas.', website: 'https://data.co', industry: 'Data Science' },
        { name: 'Sofía Jiménez', phone: '+573007776666', email: 'sofia@events.co', position: 'Event Manager', bio: 'Organización de eventos corporativos y networking B2B.', website: 'https://events.co', industry: 'Eventos' },
        { name: 'Daniel Ortiz', phone: '+573002223333', email: 'daniel@security.co', position: 'Security Officer', bio: 'Ciberseguridad empresarial. Protejo datos y sistemas.', website: 'https://security.co', industry: 'Ciberseguridad' },
    ];

    const passwordHash = await bcrypt.hash('password123', 10);
    const createdUsers = [];

    for (const userData of usersData) {
        const user = await prisma.user.create({
            data: { ...userData, passwordHash },
        });
        createdUsers.push(user);
        console.log(`✅ User created: ${user.name}`);
    }

    // Create 30+ conversations
    const conversationPairs = [
        [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
        [1, 2], [1, 3], [1, 4], [1, 6],
        [2, 3], [2, 4], [2, 7],
        [3, 4], [3, 8],
        [4, 9],
        [5, 6], [5, 7], [5, 10],
        [6, 7], [6, 11],
        [7, 12],
        [8, 9], [8, 13],
        [9, 10], [9, 14],
        [10, 11], [10, 12],
        [11, 13],
        [12, 14],
        [13, 14],
    ];

    const messageTemplates = [
        ['¡Hola! ¿Cómo va tu proyecto?', 'Todo excelente, estamos cerrando un gran cliente.', '¡Qué bueno! Necesito ayuda con mi estrategia.'],
        ['Necesito cotización para el servicio.', '¿Qué volumen manejas mensualmente?', 'Aproximadamente 500 al mes.'],
        ['Me recomendaron tus servicios.', 'Gracias! ¿En qué puedo ayudarte?', 'Necesito optimizar procesos.'],
        ['¿Tienes experiencia con e-commerce?', 'Sí, manejo varias tiendas online.', 'Perfecto, tengo un cliente interesado.'],
        ['¿Podemos colaborar en un proyecto?', 'Claro, me encantaría. ¿De qué se trata?', 'Transformación digital para manufactura.'],
    ];

    for (let i = 0; i < conversationPairs.length; i++) {
        const [indexA, indexB] = conversationPairs[i];
        const userA = createdUsers[indexA];
        const userB = createdUsers[indexB];

        const conversation = await prisma.conversation.create({
            data: {
                type: 'USER_USER',
                userAId: userA.id,
                userBId: userB.id,
            },
        });

        // Add messages
        const template = messageTemplates[i % messageTemplates.length];
        for (let j = 0; j < template.length; j++) {
            const sender = j % 2 === 0 ? userA : userB;
            await prisma.message.create({
                data: {
                    conversationId: conversation.id,
                    senderUserId: sender.id,
                    text: template[j],
                    createdAt: new Date(Date.now() - (template.length - j) * 3600000),
                },
            });
        }

        console.log(`✅ Conversation: ${userA.name} <-> ${userB.name}`);
    }

    console.log('\n🎉 Seeding completed!');
    console.log(`\n📋 Created ${createdUsers.length} users and ${conversationPairs.length} conversations`);
    console.log('\n💡 Login with any phone number above, password: password123');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
