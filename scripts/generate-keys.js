/**
 * Generate secure keys for production deployment
 * Run with: node scripts/generate-keys.js
 */

const crypto = require('crypto');

console.log('\n🔐 GENERADOR DE CLAVES DE SEGURIDAD\n');
console.log('='.repeat(60));
console.log('\n⚠️  IMPORTANTE: Guarda estas claves de forma segura!\n');
console.log('='.repeat(60));

// Generate NEXTAUTH_SECRET
const nextAuthSecret = crypto.randomBytes(32).toString('base64');
console.log('\n📌 NEXTAUTH_SECRET:');
console.log(nextAuthSecret);

// Generate ENCRYPTION_KEY
const encryptionKey = crypto.randomBytes(32).toString('hex');
console.log('\n📌 ENCRYPTION_KEY:');
console.log(encryptionKey);

// Generate additional secure tokens
const apiKey = crypto.randomBytes(32).toString('hex');
console.log('\n📌 API_KEY (opcional):');
console.log(apiKey);

const webhookSecret = crypto.randomBytes(32).toString('hex');
console.log('\n📌 WEBHOOK_SECRET (opcional):');
console.log(webhookSecret);

console.log('\n' + '='.repeat(60));
console.log('\n📋 INSTRUCCIONES:\n');
console.log('1. Copia estas claves a tu archivo .env.local (desarrollo)');
console.log('2. Configura estas claves en Vercel Environment Variables (producción)');
console.log('3. NUNCA compartas estas claves públicamente');
console.log('4. NUNCA las subas a Git');
console.log('\n' + '='.repeat(60));

console.log('\n✅ Ejemplo de configuración en Vercel:\n');
console.log('   Settings → Environment Variables → Add New\n');
console.log('   Variable Name: NEXTAUTH_SECRET');
console.log('   Value: <pega el valor generado arriba>');
console.log('   Environment: Production, Preview, Development');
console.log('   ☑️  Sensitive (marca esta opción)\n');

console.log('='.repeat(60));
console.log('\n💾 Guardando en archivo temporal...\n');

// Save to temporary file
const fs = require('fs');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const filename = `.env.generated.${timestamp}.txt`;

const envContent = `# Claves generadas el ${new Date().toLocaleString()}
# ⚠️  ELIMINA ESTE ARCHIVO después de copiar las claves!

NEXTAUTH_SECRET=${nextAuthSecret}
ENCRYPTION_KEY=${encryptionKey}
API_KEY=${apiKey}
WEBHOOK_SECRET=${webhookSecret}

# Configuración completa de ejemplo:
# DATABASE_URL=postgresql://user:password@host:5432/database
# NEXTAUTH_URL=https://creatiendasgit1.vercel.app
# NEXTAUTH_SECRET=${nextAuthSecret}
# ENCRYPTION_KEY=${encryptionKey}
`;

fs.writeFileSync(filename, envContent);

console.log(`✅ Claves guardadas en: ${filename}`);
console.log('\n⚠️  IMPORTANTE: Elimina este archivo después de copiar las claves!\n');
console.log('='.repeat(60));
console.log('\n');
