import nodemailer from 'nodemailer';
import { Resend } from 'resend';

// Initialize Resend if API key is present
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Helper to get a SMTP transporter. Uses environment variables if provided, otherwise falls back to Ethereal.
async function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && port && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: { user, pass },
    });
  }

  // Fallback to Ethereal (free testing account)
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

export async function sendPasswordResetEmail(email: string, resetLink: string) {
  const from = process.env.EMAIL_FROM || 'onboarding@resend.dev'; // Resend default for testing
  const subject = 'Recuperación de Contraseña - Creatiendas';
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Recupera tu contraseña</h2>
      <p>Has solicitado restablecer tu contraseña en Creatiendas.</p>
      <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
      <a href="${resetLink}" style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">
        Restablecer Contraseña
      </a>
      <p style="margin-top: 20px; font-size: 12px; color: #666;">
        Si no solicitaste este cambio, puedes ignorar este correo.
        El enlace expirará en 1 hora.
      </p>
    </div>
  `;

  try {
    // Try Resend API first (faster and more reliable on Vercel)
    if (resend) {
      const data = await resend.emails.send({
        from,
        to: email,
        subject,
        html,
      });
      console.log('Password reset email sent (Resend):', data);
      return true;
    }

    // Fallback to SMTP
    const transporter = await getTransporter();
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Soporte" <no-reply@creatiendas.com>',
      to: email,
      subject,
      html,
    });
    console.log('Password reset email sent (SMTP): %s', info.messageId);
    if (nodemailer.getTestMessageUrl) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    return true;
  } catch (error) {
    console.error('Error enviando correo de restablecimiento:', error);
    return false;
  }
}

export async function sendVerificationEmail(email: string, token: string) {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://creatiendas.co';
  const verifyLink = `${baseUrl}/api/auth/verify?token=${token}`;
  const from = process.env.EMAIL_FROM || 'onboarding@resend.dev'; // Resend default
  const subject = 'Verifica tu cuenta - Creatiendas';
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Bienvenido a Creatiendas</h2>
      <p>Para activar tu cuenta y comenzar a crear tu tienda, por favor verifica tu correo electrónico.</p>
      <a href="${verifyLink}" style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">
        Verificar mi Correo
      </a>
      <p style="margin-top: 20px; font-size: 12px; color: #666;">
        Si no creaste esta cuenta, puedes ignorar este correo.
      </p>
    </div>
  `;

  try {
    // Try Resend API first
    if (resend) {
      const data = await resend.emails.send({
        from,
        to: email,
        subject,
        html,
      });
      console.log('Verification email sent (Resend):', data);
      return true;
    }

    // Fallback to SMTP
    const transporter = await getTransporter();
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Soporte" <no-reply@creatiendas.com>',
      to: email,
      subject,
      html,
    });
    console.log('Verification email sent (SMTP): %s', info.messageId);
    if (nodemailer.getTestMessageUrl) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    return true;
  } catch (error) {
    console.error('Error enviando correo de verificación:', error);
    return false;
  }
}
