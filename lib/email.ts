import nodemailer from 'nodemailer';

// Helper to get a transporter. Uses environment variables if provided, otherwise falls back to an Ethereal test account.
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
  try {
    const transporter = await getTransporter();
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Soporte" <no-reply@creatiendas.com>',
      to: email,
      subject: 'Recuperación de Contraseña - Creatiendas',
      html: `
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
      `,
    });
    console.log('Password reset email sent: %s', info.messageId);
    // If using Ethereal, log preview URL
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
  try {
    const transporter = await getTransporter();
    const baseUrl = process.env.NEXTAUTH_URL || 'https://creatiendasgit1.vercel.app';
    const verifyLink = `${baseUrl}/api/auth/verify?token=${token}`;
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Soporte" <no-reply@creatiendas.com>',
      to: email,
      subject: 'Verifica tu cuenta - Creatiendas',
      html: `
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
      `,
    });
    console.log('Verification email sent: %s', info.messageId);
    if (nodemailer.getTestMessageUrl) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    return true;
  } catch (error) {
    console.error('Error enviando correo de verificación:', error);
    return false;
  }
}

