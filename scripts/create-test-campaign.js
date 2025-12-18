// Script para crear campañas de prueba usando el API
// Ejecutar con: node scripts/create-test-campaign.js

const API_URL = 'http://localhost:3000';

async function createTestCampaign() {
    const campaignData = {
        name: "Campaña Test Presupuesto",
        objective: "SALES",
        industry: "Tecnología",
        sector: "Software",
        targetRoles: ["CEO", "CTO", "Director de TI"],
        dailyBudget: 100000,      // $100,000 COP por día
        totalBudget: 700000,      // $700,000 COP total (7 días)
        creativeType: "IMAGE",
        creativeUrl: "/uploads/campaigns/campaign_test_product_1764104131561.png",
        creativeText: "¡Descubre nuestra solución B2B!",
    };

    console.log('📊 Creando campaña de prueba...');
    console.log('Datos:', JSON.stringify(campaignData, null, 2));
    console.log('\n💰 Presupuesto:');
    console.log(`  - Diario: $${campaignData.dailyBudget.toLocaleString('es-CO')} COP`);
    console.log(`  - Total: $${campaignData.totalBudget.toLocaleString('es-CO')} COP`);
    console.log(`  - Duración calculada: ${Math.ceil(campaignData.totalBudget / campaignData.dailyBudget)} días`);

    try {
        const response = await fetch(`${API_URL}/api/campaigns/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Necesitas estar autenticado - copia las cookies de tu navegador
                'Cookie': process.env.AUTH_COOKIE || '',
            },
            body: JSON.stringify(campaignData),
        });

        const data = await response.json();

        if (data.success) {
            console.log('\n✅ ¡Campaña creada exitosamente!');
            console.log('ID:', data.campaign.id);
            console.log('Nombre:', data.campaign.name);
            console.log('Duración:', data.campaign.durationDays, 'días');
            console.log('Presupuesto Total:', `$${data.campaign.totalBudget.toLocaleString('es-CO')} COP`);
            console.log('\n🎯 Ver en: http://localhost:3000/ads-manager');
        } else {
            console.error('\n❌ Error:', data.error);
        }
    } catch (error) {
        console.error('\n❌ Error de red:', error.message);
        console.log('\n💡 Asegúrate de que:');
        console.log('  1. El servidor esté corriendo (npm start)');
        console.log('  2. Estés autenticado (copia las cookies del navegador)');
    }
}

// Ejecutar
createTestCampaign();
