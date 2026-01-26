/**
 * Security Configuration Validator
 * Run before deploying to production: node scripts/validate-security.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 VALIDADOR DE CONFIGURACIÓN DE SEGURIDAD\n');
console.log('='.repeat(60));

let errors = [];
let warnings = [];
let passed = [];

// Check 1: Environment variables
console.log('\n📋 Verificando variables de entorno...');

const requiredEnvVars = [
    'CREATIENDAS_FINAL_DB',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
];

const recommendedEnvVars = [
    'ENCRYPTION_KEY',
];

// Load .env file if exists
const envPath = path.join(__dirname, '..', '.env');
let envVars = {};

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            envVars[match[1].trim()] = match[2].trim();
        }
    });
}

requiredEnvVars.forEach(varName => {
    if (!process.env[varName] && !envVars[varName]) {
        errors.push(`❌ Variable requerida no configurada: ${varName}`);
    } else {
        passed.push(`✅ ${varName} configurado`);
    }
});

recommendedEnvVars.forEach(varName => {
    if (!process.env[varName] && !envVars[varName]) {
        warnings.push(`⚠️  Variable recomendada no configurada: ${varName}`);
    } else {
        passed.push(`✅ ${varName} configurado`);
    }
});

// Check 2: Weak secrets
console.log('\n🔐 Verificando fortaleza de secretos...');

const weakSecrets = [
    'changeme',
    'password123',
    'secret',
    'test',
    'demo',
    '1234567890abcdef',
];

const nextAuthSecret = process.env.NEXTAUTH_SECRET || envVars.NEXTAUTH_SECRET || '';
if (nextAuthSecret) {
    const isWeak = weakSecrets.some(weak => nextAuthSecret.toLowerCase().includes(weak));
    if (isWeak) {
        errors.push('❌ NEXTAUTH_SECRET es débil o es el valor de ejemplo');
    } else if (nextAuthSecret.length < 32) {
        warnings.push('⚠️  NEXTAUTH_SECRET debería tener al menos 32 caracteres');
    } else {
        passed.push('✅ NEXTAUTH_SECRET es fuerte');
    }
}

// Check 3: Sensitive files in repository
console.log('\n📁 Verificando archivos sensibles...');

const sensitiveFiles = [
    'usuarios_prueba.txt',
    '.env',
    '.env.local',
    '.env.production',
    'data/wallet-db.json',
];

sensitiveFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
        // Check if it's in .gitignore
        const gitignorePath = path.join(__dirname, '..', '.gitignore');
        if (fs.existsSync(gitignorePath)) {
            const gitignore = fs.readFileSync(gitignorePath, 'utf-8');
            const fileName = path.basename(file);
            const dirName = path.dirname(file);

            const isIgnored = gitignore.split('\n').some(line => {
                const pattern = line.trim();
                return pattern === file ||
                    pattern === fileName ||
                    pattern.includes(fileName) ||
                    (dirName !== '.' && pattern.includes(dirName));
            });

            if (!isIgnored) {
                errors.push(`❌ Archivo sensible NO está en .gitignore: ${file}`);
            } else {
                passed.push(`✅ ${file} está protegido en .gitignore`);
            }
        }
    }
});

// Check 4: Hardcoded credentials in code
console.log('\n🔎 Buscando credenciales hardcodeadas...');

const codeFiles = [
    'lib/auth.ts',
    'app/api/auth/[...nextauth]/route.ts',
];

const dangerousPatterns = [
    /password123/i,
    /test@creatiendas\.com/i,
    /admin@creatiendas\.com.*password/i,
];

codeFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        let foundIssues = false;

        dangerousPatterns.forEach(pattern => {
            if (pattern.test(content)) {
                errors.push(`❌ Credenciales hardcodeadas encontradas en: ${file}`);
                foundIssues = true;
            }
        });

        if (!foundIssues) {
            passed.push(`✅ ${file} no contiene credenciales hardcodeadas`);
        }
    }
});

// Check 5: Security headers in middleware
console.log('\n🛡️  Verificando headers de seguridad...');

const middlewarePath = path.join(__dirname, '..', 'middleware.ts');
if (fs.existsSync(middlewarePath)) {
    const content = fs.readFileSync(middlewarePath, 'utf-8');

    const requiredHeaders = [
        'X-Frame-Options',
        'X-Content-Type-Options',
        'Content-Security-Policy',
    ];

    requiredHeaders.forEach(header => {
        if (content.includes(header)) {
            passed.push(`✅ Header de seguridad configurado: ${header}`);
        } else {
            warnings.push(`⚠️  Header de seguridad faltante: ${header}`);
        }
    });
}

// Check 6: Rate limiting
console.log('\n⏱️  Verificando rate limiting...');

const rateLimitPath = path.join(__dirname, '..', 'lib', 'rate-limit.ts');
if (fs.existsSync(rateLimitPath)) {
    passed.push('✅ Rate limiting implementado');
} else {
    warnings.push('⚠️  Rate limiting no encontrado');
}

// Print results
console.log('\n' + '='.repeat(60));
console.log('\n📊 RESULTADOS:\n');

if (passed.length > 0) {
    console.log('✅ PASADAS (' + passed.length + '):');
    passed.forEach(p => console.log('   ' + p));
    console.log('');
}

if (warnings.length > 0) {
    console.log('⚠️  ADVERTENCIAS (' + warnings.length + '):');
    warnings.forEach(w => console.log('   ' + w));
    console.log('');
}

if (errors.length > 0) {
    console.log('❌ ERRORES CRÍTICOS (' + errors.length + '):');
    errors.forEach(e => console.log('   ' + e));
    console.log('');
}

console.log('='.repeat(60));

if (errors.length > 0) {
    console.log('\n🚫 VALIDACIÓN FALLIDA');
    console.log('   Corrige los errores antes de desplegar a producción.\n');
    process.exit(1);
} else if (warnings.length > 0) {
    console.log('\n⚠️  VALIDACIÓN PASADA CON ADVERTENCIAS');
    console.log('   Considera resolver las advertencias antes de desplegar.\n');
    process.exit(0);
} else {
    console.log('\n✅ VALIDACIÓN EXITOSA');
    console.log('   La configuración de seguridad está lista para producción.\n');
    process.exit(0);
}
