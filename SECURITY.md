# 🔐 Guía de Seguridad - Creatiendas

## ⚠️ CRÍTICO: Antes de Lanzar a Producción

### 1. Variables de Entorno

**NUNCA uses las credenciales de ejemplo en producción.** Debes configurar las siguientes variables en Vercel:

#### Variables Requeridas:

```bash
# Base de Datos
DATABASE_URL=postgresql://usuario:contraseña@host:5432/database?schema=public

# NextAuth - Genera un secreto único
NEXTAUTH_URL=https://creatiendasgit1.vercel.app
NEXTAUTH_SECRET=<genera-con-comando-abajo>

# Clave de Encriptación - Genera una clave única
ENCRYPTION_KEY=<genera-con-comando-abajo>
```

#### Generar Secretos Seguros:

```bash
# Para NEXTAUTH_SECRET (ejecuta en terminal):
openssl rand -base64 32

# Para ENCRYPTION_KEY (ejecuta en Node.js):
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Configuración en Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agrega cada variable con su valor generado
4. Marca las variables sensibles como "Sensitive" para ocultarlas
5. Redeploy el proyecto para aplicar los cambios

### 3. Eliminar Archivos de Prueba

Antes de lanzar, **ELIMINA** estos archivos del repositorio:

```bash
# Archivos que contienen credenciales de prueba
rm usuarios_prueba.txt
rm setup-test-user.html
rm -rf data/wallet-db.json
```

### 4. Usuarios de Prueba en Base de Datos

Los usuarios de prueba deben estar **SOLO en la base de datos**, nunca en el código.

Para crear usuarios admin en producción, ejecuta:

```bash
npm run create-admin
```

Esto creará usuarios con contraseñas seguras que debes cambiar inmediatamente.

---

## 🛡️ Medidas de Seguridad Implementadas

### ✅ Autenticación
- ✅ Contraseñas hasheadas con bcrypt (salt rounds: 10)
- ✅ Sesiones JWT con secreto único
- ✅ No hay credenciales hardcodeadas en el código
- ✅ Validación de email y contraseña

### ✅ Rate Limiting
- ✅ Login: 5 intentos por minuto
- ✅ Registro: 3 intentos por 5 minutos
- ✅ Recuperación de contraseña: 3 intentos por 10 minutos
- ✅ APIs: 30-60 requests por minuto

### ✅ Encriptación
- ✅ AES-256-GCM para datos sensibles
- ✅ Claves de encriptación únicas por entorno
- ✅ Utilidades de encriptación en `lib/security.ts`

### ✅ Headers de Seguridad
- ✅ X-Frame-Options: DENY (previene clickjacking)
- ✅ X-Content-Type-Options: nosniff
- ✅ X-XSS-Protection: activado
- ✅ Content Security Policy (CSP)
- ✅ Referrer Policy: strict-origin-when-cross-origin

### ✅ Validación de Inputs
- ✅ Sanitización de inputs del usuario
- ✅ Validación de formato de email
- ✅ Validación de fuerza de contraseña
- ✅ Protección contra XSS

### ✅ Protección de Rutas
- ✅ Middleware de autenticación
- ✅ Rutas protegidas: /dashboard, /admin, /enterprise
- ✅ Verificación de roles (USER, ADMIN)

---

## 📋 Checklist Pre-Lanzamiento

### Configuración
- [ ] Variables de entorno configuradas en Vercel
- [ ] NEXTAUTH_SECRET generado y configurado
- [ ] ENCRYPTION_KEY generado y configurado
- [ ] DATABASE_URL apunta a base de datos de producción
- [ ] NEXTAUTH_URL configurado con dominio de producción

### Seguridad
- [ ] Archivo `usuarios_prueba.txt` eliminado
- [ ] Archivo `setup-test-user.html` eliminado
- [ ] No hay contraseñas en el código
- [ ] `.env` y `.env.local` en `.gitignore`
- [ ] Usuarios admin creados en base de datos
- [ ] Contraseñas de admin cambiadas

### Base de Datos
- [ ] Migraciones de Prisma ejecutadas
- [ ] Usuarios de prueba creados
- [ ] Backup de base de datos configurado
- [ ] Índices de base de datos optimizados

### Testing
- [ ] Login funciona correctamente
- [ ] Registro funciona correctamente
- [ ] Rate limiting funciona
- [ ] Rutas protegidas requieren autenticación
- [ ] Encriptación funciona correctamente

### Monitoreo
- [ ] Logs de errores configurados
- [ ] Alertas de seguridad configuradas
- [ ] Monitoreo de rate limiting activo

---

## 🚨 En Caso de Brecha de Seguridad

1. **Inmediatamente**:
   - Cambia todas las variables de entorno
   - Regenera NEXTAUTH_SECRET y ENCRYPTION_KEY
   - Invalida todas las sesiones activas
   - Revisa logs de acceso

2. **Investigación**:
   - Identifica el vector de ataque
   - Revisa logs de base de datos
   - Verifica accesos no autorizados

3. **Comunicación**:
   - Notifica a usuarios afectados
   - Documenta el incidente
   - Implementa medidas correctivas

---

## 📞 Contacto de Seguridad

Para reportar vulnerabilidades de seguridad:
- Email: security@creatiendas.com
- No publiques vulnerabilidades públicamente

---

## 🔄 Actualizaciones de Seguridad

- Revisa dependencias mensualmente: `npm audit`
- Actualiza paquetes de seguridad: `npm update`
- Monitorea CVEs relacionados con Next.js, Prisma, NextAuth

---

**Última actualización**: 2025-12-04
**Versión**: 1.0.0
