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
  const from = process.env.EMAIL_FROM || 'onboarding@resend.dev';
  const subject = 'Recupera tu acceso - Creatiendas';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #f1f5f9; }
        .header { background: #ffffff; padding: 40px 20px; text-align: center; border-bottom: 1px solid #f1f5f9; }
        .content { padding: 40px; text-align: center; }
        .footer { padding: 24px; text-align: center; color: #64748b; font-size: 12px; border-top: 1px solid #f1f5f9; background: #f8fafc; }
        .logo-img { height: 40px; }
        h1 { color: #0f172a; font-size: 24px; font-weight: 800; margin-bottom: 16px; letter-spacing: -0.5px; }
        p { color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px; }
        .button { display: inline-block; background-color: #22c55e; color: #ffffff !important; padding: 16px 32px; text-decoration: none; border-radius: 9999px; font-weight: 800; font-size: 16px; box-shadow: 0 10px 15px -3px rgba(34, 197, 94, 0.2); transition: transform 0.2s; }
        .help-text { color: #94a3b8; font-size: 13px; margin-top: 32px; }
        .wa-box { background: #f0fdf4; border: 1px dashed #22c55e; border-radius: 16px; padding: 16px; margin-top: 24px; color: #166534; font-size: 14px; font-weight: 600; }
        .wa-link { color: #22c55e; text-decoration: none; font-weight: 800; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://creatiendas.co/logo.png" alt="Creatiendas" class="logo-img">
        </div>
        <div class="content">
          <h1>Recupera tu contraseña</h1>
          <p>Has solicitado restablecer tu acceso a Creatiendas. Haz clic en el siguiente botón para elegir una nueva contraseña:</p>
          <a href="${resetLink}" class="button">Restablecer Contraseña</a>
          
          <div class="wa-box">
             ⚠️ Este correo es automático (No-Reply). <br>
             Si necesitas ayuda, contáctanos exclusivamente por WhatsApp:<br>
             <a href="https://wa.me/573026687991" class="wa-link">+57 302 668 7991</a>
          </div>
          
          <p class="help-text">Si no solicitaste este cambio, puedes ignorar este correo. El enlace expirará en 1 hora.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Creatiendas. Todos los derechos reservados.<br>
          Hecho con ❤️ para emprendedores.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    if (resend) {
      await resend.emails.send({ from, to: email, subject, html });
      return true;
    }
    const transporter = await getTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Soporte" <no-reply@creatiendas.com>',
      to: email,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Error enviando correo de reset:', error);
    return false;
  }
}

export async function sendVerificationEmail(email: string, token: string) {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://creatiendas.co';
  const verifyLink = `${baseUrl}/api/auth/verify?token=${token}`;
  const from = process.env.EMAIL_FROM || 'onboarding@resend.dev';
  const subject = 'Verifica tu cuenta - Creatiendas';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px 0; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 32px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; }
        .header { background: #ffffff; padding: 48px 20px; text-align: center; border-bottom: 1px solid #f1f5f9; }
        .content { padding: 48px 40px; text-align: center; }
        .footer { padding: 32px; text-align: center; color: #94a3b8; font-size: 12px; background: #f8fafc; }
        .logo-img { height: 50px; }
        h1 { color: #0f172a; font-size: 28px; font-weight: 900; margin-bottom: 24px; letter-spacing: -1px; }
        p { color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 32px; }
        .button { display: inline-block; background-color: #22c55e; color: #ffffff !important; padding: 18px 48px; text-decoration: none; border-radius: 20px; font-weight: 900; font-size: 16px; box-shadow: 0 10px 15px -3px rgba(34, 197, 94, 0.3); }
        .divider { height: 1px; background: #f1f5f9; margin: 40px 0; }
        .wa-support { background: #f0fdf4; border-radius: 20px; padding: 24px; color: #166534; font-size: 14px; text-align: center; }
        .wa-link { color: #22c55e; font-weight: 900; text-decoration: none; font-size: 18px; display: block; margin-top: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://creatiendas.co/logo.png" alt="Creatiendas Logo" class="logo-img">
        </div>
        <div class="content">
          <h1>¡Bienvenido a la comunidad!</h1>
          <p>Es un gusto tenerte con nosotros. Para activar tu cuenta y comenzar a vender por WhatsApp, confirma tu correo presionando este botón:</p>
          <a href="${verifyLink}" class="button">Activar mi Cuenta</a>
          
          <div class="divider"></div>
          
          <div class="wa-support">
            <strong>¿Tienes dudas o necesitas ayuda?</strong><br>
            Como este correo es automático y no lo leemos, contáctanos directamente por nuestro WhatsApp oficial de soporte:<br>
            <a href="https://wa.me/573026687991" class="wa-link">📱 +57 302 668 7991</a>
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Creatiendas S.A.S<br>
          Este correo fue enviado a ${email} porque te registraste en Creatiendas.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    if (resend) {
      await resend.emails.send({ from, to: email, subject, html });
      return true;
    }
    const transporter = await getTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Soporte" <no-reply@creatiendas.com>',
      to: email,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Error enviando correo de verificación:', error);
    return false;
  }
}


