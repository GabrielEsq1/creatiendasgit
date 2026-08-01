import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendNurturingEmail } from '@/lib/email-nurturing';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    // Validate Vercel Cron Secret for security
    const authHeader = request.headers.get('authorization');
    if (
        process.env.CRON_SECRET &&
        authHeader !== `Bearer ${process.env.CRON_SECRET}` &&
        process.env.NODE_ENV === 'production'
    ) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const today = new Date();
        // Set to start and end of current day to properly match date range if needed,
        // or just calculate the difference precisely. It's safer to fetch all un-paid stores and filter in memory,
        // given the dataset size is currently small, but we will filter in memory for those that match exactly N days.

        const stores = await prisma.store.findMany({
            where: {
                isPaid: false
            },
            include: {
                owner: true
            }
        });

        const results = {
            day7: 0,
            day14: 0,
            day21: 0,
            day28: 0,
            failed: 0
        };

        for (const store of stores) {
            const createdAt = new Date(store.createdAt);
            const diffTime = today.getTime() - createdAt.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (!store.owner || !store.owner.email) continue;
            // Exclude stores owned by users with paid/PRO plans
            if (store.owner.plan === 'PRO' || store.owner.plan === 'NEGOCIO') continue;

            let subject = '';
            let title = '';
            let content = '';
            let event = '';

            if (diffDays === 7) {
                subject = '¡Sigue construyendo tu tienda gratuita!';
                title = '¡Tu primer semana con Creatiendas!';
                content = `
                    <p>Hola${store.owner.name ? ` ${store.owner.name}` : ''},</p>
                    <p>Hace exactamente una semana creaste <strong>${store.name}</strong>. ¡Nos emociona tenerte con nosotros!</p>
                    <p>Queremos recordarte que tu mes gratis está en curso. Para aprovecharlo al máximo, te invitamos a terminar de subir tus productos, personalizar tu logo e invitar a tus primeros clientes a comprar.</p>
                    <a href="https://creatiendas.co/dashboard" class="button">Ir a mi Panel</a>
                `;
                event = 'day7';
            } else if (diffDays === 14) {
                subject = '¡Comparte tu tienda y empieza a recibir pedidos!';
                title = '¡Estás en la mitad de tu prueba!';
                content = `
                    <p>Hola${store.owner.name ? ` ${store.owner.name}` : ''},</p>
                    <p>Ya llevas 14 días construyendo <strong>${store.name}</strong>.</p>
                    <p>Si ya has agregado tus productos, ¡Es hora de compartir tu enlace en redes sociales! Empieza a recibir tus primeros pedidos de manera directa a tu WhatsApp.</p>
                    <p>Nuestra plataforma está diseñada para aumentar tus conversiones eliminando la fricción de los carritos de compra tradicionales.</p>
                    <a href="https://creatiendas.co/dashboard" class="button">Compartir mi Tienda</a>
                `;
                event = 'day14';
            } else if (diffDays === 21) {
                subject = '⏳ ¡Te queda 1 semana de prueba gratis!';
                title = 'Pronto concluirá tu prueba gratuita';
                content = `
                    <p>Hola${store.owner.name ? ` ${store.owner.name}` : ''},</p>
                    <p>Queremos avisarte que solo te queda una semana de prueba gratis para tu tienda <strong>${store.name}</strong>.</p>
                    <p>Aprovecha estos días para darle el impulso final a tus ventas. Si necesitas ayuda o consejos para vender más, recuerda que estamos siempre disponibles por WhatsApp.</p>
                `;
                event = 'day21';
            } else if (diffDays === 28) {
                subject = '⚠️ ¡Tu mes gratis termina en 2 días!';
                title = 'Asegura tu tienda en línea';
                content = `
                    <p>Hola${store.owner.name ? ` ${store.owner.name}` : ''},</p>
                    <p>Esperamos que hayas tenido grandes resultados con <strong>${store.name}</strong>.</p>
                    <p>Te recordamos que tu periodo de prueba gratis finaliza en 2 días. Para mantener tu tienda activa, retener tu enlace personalizado y seguir recibiendo pedidos sin interrupciones, comunícate con nosotros por WhatsApp para coordinar la continuidad de tu plan.</p>
                    <p>No permitas que tus clientes se queden sin acceder a tus productos.</p>
                `;
                event = 'day28';
            }

            if (event) {
                const sent = await sendNurturingEmail(store.owner.email, subject, title, content);
                if (sent) {
                    results[event as keyof typeof results]++;
                } else {
                    results.failed++;
                }
            }
        }

        return NextResponse.json({ success: true, processed: results });
    } catch (error: any) {
        console.error('Cron Nurturing Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
