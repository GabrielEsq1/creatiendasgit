/**
 * Alert System for Creatiendas
 * Sends notifications for important events via multiple channels
 */

import { Resend } from 'resend';

// Initialize Resend for email alerts
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Alert configuration
const ALERT_CONFIG = {
    // Email recipients for alerts
    emails: [
        'gabrielesquivia@creatiendas.com', // Change to your email
    ],

    // Webhook URL for Slack/Discord (optional)
    webhookUrl: process.env.ALERT_WEBHOOK_URL || null,

    // WhatsApp number for critical alerts
    whatsappNumber: process.env.ALERT_WHATSAPP || null,

    // Milestones to celebrate
    milestones: [10, 25, 50, 100, 250, 500, 1000, 5000, 10000],
};

export type AlertType =
    | 'new_user'
    | 'new_store'
    | 'milestone'
    | 'error'
    | 'high_traffic'
    | 'payment'
    | 'security';

export interface AlertData {
    type: AlertType;
    title: string;
    message: string;
    data?: Record<string, any>;
    priority?: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Send alert to all configured channels
 */
export async function sendAlert(alert: AlertData): Promise<void> {
    const priority = alert.priority || 'medium';

    console.log(`[ALERT] ${alert.type.toUpperCase()}: ${alert.title}`);
    console.log(`        ${alert.message}`);

    // Send to all channels in parallel
    const promises: Promise<any>[] = [];

    // Email alert
    if (resend && ALERT_CONFIG.emails.length > 0) {
        promises.push(sendEmailAlert(alert));
    }

    // Webhook alert (Slack/Discord)
    if (ALERT_CONFIG.webhookUrl) {
        promises.push(sendWebhookAlert(alert));
    }

    // For critical alerts, try all methods
    if (priority === 'critical') {
        // Could add SMS, WhatsApp API, etc.
        console.log('[CRITICAL ALERT] Attempting all notification methods');
    }

    try {
        await Promise.allSettled(promises);
    } catch (error) {
        console.error('[ALERT ERROR]', error);
    }
}

/**
 * Send email alert via Resend
 */
async function sendEmailAlert(alert: AlertData): Promise<void> {
    if (!resend) return;

    const priorityEmoji = {
        low: '📢',
        medium: '⚡',
        high: '🔔',
        critical: '🚨',
    };

    const emoji = priorityEmoji[alert.priority || 'medium'];

    try {
        await resend.emails.send({
            from: 'Creatiendas Alerts <alerts@creatiendas.com>',
            to: ALERT_CONFIG.emails,
            subject: `${emoji} [Creatiendas] ${alert.title}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #22c55e, #16a34a); padding: 20px; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0;">${emoji} ${alert.title}</h1>
                    </div>
                    <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb;">
                        <p style="font-size: 16px; color: #374151;">${alert.message}</p>
                        ${alert.data ? `
                            <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                                <h3 style="margin-top: 0; color: #6b7280;">Detalles:</h3>
                                <pre style="background: #f3f4f6; padding: 10px; border-radius: 4px; overflow-x: auto;">
${JSON.stringify(alert.data, null, 2)}
                                </pre>
                            </div>
                        ` : ''}
                    </div>
                    <div style="background: #374151; padding: 15px; border-radius: 0 0 10px 10px; text-align: center;">
                        <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                            Creatiendas Alert System | ${new Date().toLocaleString('es-CO')}
                        </p>
                    </div>
                </div>
            `,
        });
        console.log('[ALERT] Email sent successfully');
    } catch (error) {
        console.error('[ALERT] Email failed:', error);
    }
}

/**
 * Send webhook alert (Slack/Discord compatible)
 */
async function sendWebhookAlert(alert: AlertData): Promise<void> {
    if (!ALERT_CONFIG.webhookUrl) return;

    const colorMap = {
        low: '#6b7280',
        medium: '#3b82f6',
        high: '#f59e0b',
        critical: '#ef4444',
    };

    const payload = {
        // Slack format
        text: `*${alert.title}*`,
        attachments: [{
            color: colorMap[alert.priority || 'medium'],
            text: alert.message,
            fields: alert.data ? Object.entries(alert.data).map(([key, value]) => ({
                title: key,
                value: String(value),
                short: true,
            })) : [],
            footer: 'Creatiendas Alert System',
            ts: Math.floor(Date.now() / 1000),
        }],
        // Discord format (backup)
        embeds: [{
            title: alert.title,
            description: alert.message,
            color: parseInt(colorMap[alert.priority || 'medium'].replace('#', ''), 16),
            fields: alert.data ? Object.entries(alert.data).map(([key, value]) => ({
                name: key,
                value: String(value),
                inline: true,
            })) : [],
            timestamp: new Date().toISOString(),
        }],
    };

    try {
        await fetch(ALERT_CONFIG.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        console.log('[ALERT] Webhook sent successfully');
    } catch (error) {
        console.error('[ALERT] Webhook failed:', error);
    }
}

// ============================================
// PREDEFINED ALERT FUNCTIONS
// ============================================

export async function alertNewUser(user: { email: string; name?: string; plan?: string }): Promise<void> {
    await sendAlert({
        type: 'new_user',
        title: '🎉 Nuevo Usuario Registrado',
        message: `Un nuevo usuario se ha registrado en Creatiendas.`,
        data: {
            Email: user.email,
            Nombre: user.name || 'No especificado',
            Plan: user.plan || 'FREE',
            Fecha: new Date().toLocaleString('es-CO'),
        },
        priority: 'medium',
    });
}

export async function alertNewStore(store: { name: string; slug: string; ownerEmail: string }): Promise<void> {
    await sendAlert({
        type: 'new_store',
        title: '🏪 Nueva Tienda Creada',
        message: `Se ha creado una nueva tienda en la plataforma.`,
        data: {
            Tienda: store.name,
            URL: `https://creatiendas.co/stores/${store.slug}`,
            Propietario: store.ownerEmail,
            Fecha: new Date().toLocaleString('es-CO'),
        },
        priority: 'medium',
    });
}

export async function alertMilestone(type: 'users' | 'stores', count: number): Promise<void> {
    if (!ALERT_CONFIG.milestones.includes(count)) return;

    await sendAlert({
        type: 'milestone',
        title: `🏆 ¡Hito Alcanzado! ${count} ${type === 'users' ? 'Usuarios' : 'Tiendas'}`,
        message: `¡Felicidades! Creatiendas ha alcanzado ${count} ${type === 'users' ? 'usuarios registrados' : 'tiendas creadas'}.`,
        data: {
            Hito: count,
            Tipo: type === 'users' ? 'Usuarios' : 'Tiendas',
            Fecha: new Date().toLocaleString('es-CO'),
        },
        priority: 'high',
    });
}

export async function alertError(error: Error, context?: string): Promise<void> {
    await sendAlert({
        type: 'error',
        title: '❌ Error en el Sistema',
        message: `Se ha producido un error${context ? ` en ${context}` : ''}.`,
        data: {
            Error: error.message,
            Stack: error.stack?.slice(0, 500),
            Contexto: context || 'General',
            Fecha: new Date().toLocaleString('es-CO'),
        },
        priority: 'critical',
    });
}

export async function alertHighTraffic(requestsPerMinute: number): Promise<void> {
    await sendAlert({
        type: 'high_traffic',
        title: '📈 Alto Tráfico Detectado',
        message: `El sitio está recibiendo un alto volumen de tráfico.`,
        data: {
            'Requests/min': requestsPerMinute,
            Estado: 'Monitoreando',
            Fecha: new Date().toLocaleString('es-CO'),
        },
        priority: 'high',
    });
}

export async function alertPayment(payment: { amount: number; userId: string; type: string }): Promise<void> {
    await sendAlert({
        type: 'payment',
        title: '💰 Nuevo Pago Recibido',
        message: `Se ha procesado un nuevo pago.`,
        data: {
            Monto: `$${payment.amount.toLocaleString()} COP`,
            Tipo: payment.type,
            Usuario: payment.userId,
            Fecha: new Date().toLocaleString('es-CO'),
        },
        priority: 'high',
    });
}

export async function alertSecurity(issue: string, details?: Record<string, any>): Promise<void> {
    await sendAlert({
        type: 'security',
        title: '🔒 Alerta de Seguridad',
        message: issue,
        data: {
            ...details,
            Fecha: new Date().toLocaleString('es-CO'),
        },
        priority: 'critical',
    });
}
