const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const INDUSTRIES = [
    'Tecnología', 'Retail', 'Salud', 'Finanzas', 'Educación',
    'Manufactura', 'Construcción', 'Alimentos', 'Turismo', 'Transporte'
];

const SECTORS = [
    'Software', 'E-commerce', 'Consultoría', 'Servicios', 'Productos',
    'B2B', 'B2C', 'SaaS', 'Marketplace', 'Logística'
];

const COMPANIES = [
    'TechCorp Solutions', 'Global Retail Inc', 'HealthCare Plus', 'FinanceHub',
    'EduTech Academy', 'Manufacturing Pro', 'BuildRight Construction',
    'FoodDelivery Express', 'TravelWorld', 'TransportLogistics',
    'CloudSystems', 'DataAnalytics Co', 'CyberSecurity Experts', 'AI Innovations',
    'Marketing Masters', 'Design Studio', 'Content Creators', 'Social Media Pro',
    'E-Learning Platform', 'Fitness Online', 'Beauty Products', 'Fashion Trends',
    'Home Decor', 'Pet Care Services', 'Green Energy', 'Eco Solutions',
    'Smart Home Tech', 'Mobile Apps Dev', 'Web Development', 'Digital Agency',
    'Consulting Group', 'Legal Services', 'Accounting Firm', 'HR Solutions',
    'Real Estate Pro', 'Insurance Plus', 'Investment Partners', 'Startup Incubator',
    'Venture Capital', 'Angel Investors', 'Business Coaching', 'Sales Training',
    'Customer Support', 'Call Center', 'BPO Services', 'Outsourcing Solutions',
    'Cloud Storage', 'Hosting Services', 'Domain Registry', 'Email Marketing'
];

// Common Colombian names for CEOs
const COMMON_NAMES = [
    'Gabriel Martínez', 'María Rodríguez', 'Juan Carlos López', 'Ana María González',
    'Carlos Andrés Pérez', 'Laura Fernández', 'Pedro Sánchez', 'Sofía Ramírez',
    'Diego Alejandro Torres', 'Valentina Gómez', 'Santiago Díaz', 'Camila Vargas',
    'Andrés Felipe Castro', 'Isabella Morales', 'Sebastián Ortiz', 'Daniela Reyes',
    'Miguel Ángel Ruiz', 'Gabriela Mendoza', 'Luis Fernando Silva', 'Carolina Herrera',
    'Jorge Eduardo Rojas', 'Natalia Jiménez', 'Ricardo Parra', 'Andrea Gutiérrez',
    'Fernando Castro', 'Juliana Ospina', 'Alejandro Ríos', 'Paola Muñoz',
    'Roberto Cardenas', 'Marcela Suárez', 'Javier Molina', 'Claudia Vega',
    'Mauricio León', 'Patricia Cortés', 'Gustavo Medina', 'Liliana Romero',
    'Óscar Navarro', 'Adriana Flores', 'Raúl Aguilar', 'Verónica Campos',
    'Héctor Delgado', 'Mónica Salazar', 'Iván Guerrero', 'Sandra Márquez',
    'Alberto Ramos', 'Beatriz Núñez', 'Ernesto Cruz', 'Gloria Soto', 'Francisco Arias', 'Teresa Peña'
];

async function main() {
    console.log('🌍 Creando empresas de prueba...');

    const password = await bcrypt.hash('password123', 10);

    for (let i = 0; i < 50; i++) {
        const companyName = COMPANIES[i] || `Company ${i + 1}`;
        const industry = INDUSTRIES[Math.floor(Math.random() * INDUSTRIES.length)];
        const sector = SECTORS[Math.floor(Math.random() * SECTORS.length)];
        const ceoName = COMMON_NAMES[i] || `CEO ${i + 1}`;

        try {
            // Create company
            const company = await prisma.company.create({
                data: {
                    name: companyName,
                    taxId: `TAX${1000 + i}`,
                },
            });

            // Create user for the company with common name
            const user = await prisma.user.create({
                data: {
                    name: ceoName,
                    phone: `+57300${String(i).padStart(7, '0')}`,
                    email: `${ceoName.toLowerCase().replace(/\s+/g, '').replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u')}@${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
                    passwordHash: password,
                    role: 'ADMIN_EMPRESA',
                    companyId: company.id,
                    position: 'CEO',
                    industry: industry,
                    bio: `${ceoName}, líder de ${companyName} en el sector ${sector}`,
                    website: `https://${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
                },
            });

            console.log(`✅ Creada: ${companyName} - CEO: ${ceoName} (${industry} - ${sector})`);
        } catch (error) {
            console.error(`❌ Error creando ${companyName}:`, error.message);
        }
    }

    console.log('\n✨ ¡Empresas creadas exitosamente!');
    console.log('📝 Puedes buscarlas en el chat usando el botón de búsqueda global');
}

main()
    .catch((e) => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
