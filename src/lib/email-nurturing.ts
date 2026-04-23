import { Resend } from 'resend';
import nodemailer from 'nodemailer';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

async function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && port && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

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

export async function sendNurturingEmail(email: string, subject: string, title: string, content: string) {
  const from = process.env.EMAIL_FROM || 'onboarding@resend.dev';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px 0; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #e2e8f0; }
        .header { background: #ffffff; padding: 30px 20px; text-align: center; border-bottom: 1px solid #f1f5f9; }
        .content { padding: 40px; text-align: left; }
        .footer { padding: 20px; text-align: center; color: #94a3b8; font-size: 12px; background: #f8fafc; }
        .logo-img { height: 40px; }
        h1 { color: #0f172a; font-size: 24px; font-weight: 800; margin-bottom: 20px; }
        p { color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
        .button { display: inline-block; background-color: #22c55e; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 16px; margin-top: 10px;}
        .wa-box { background: #f0fdf4; border: 1px dashed #22c55e; border-radius: 16px; padding: 16px; margin-top: 30px; color: #166534; font-size: 14px; text-align: center; }
        .wa-link { color: #22c55e; text-decoration: none; font-weight: 800; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://creatiendas.co/logo.png" alt="Creatiendas" class="logo-img">
        </div>
        <div class="content">
          <h1>${title}</h1>
          ${content}
          
          <div class="wa-box">
             ¿Necesitas ayuda con tu tienda?<br>
             Escríbenos por WhatsApp para brindarte soporte gratuito:<br>
             <a href="https://wa.me/573026687991" class="wa-link">+57 302 668 7991</a>
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Creatiendas S.A.S. Construyendo para emprendedores.
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
      from: process.env.EMAIL_FROM || '"Creatiendas" <no-reply@creatiendas.com>',
      to: email,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Error enviando correo nurturing:', error);
    return false;
  }
}
