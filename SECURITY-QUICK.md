# 🔐 Seguridad - Guía Rápida

## ⚡ Acciones Inmediatas (Antes del Lanzamiento)

### 1️⃣ Generar Claves de Seguridad

```bash
npm run security:generate-keys
```

Esto generará:
- `NEXTAUTH_SECRET` - Para autenticación
- `ENCRYPTION_KEY` - Para encriptar datos sensibles

### 2️⃣ Configurar en Vercel

1. Ve a: **Vercel Dashboard → Tu Proyecto → Settings → Environment Variables**
2. Agrega las claves generadas:
   - `NEXTAUTH_SECRET`
   - `ENCRYPTION_KEY`
   - `DATABASE_URL`
   - `NEXTAUTH_URL` (ej: https://creatiendasgit1.vercel.app)
3. Marca como **"Sensitive"** ✅
4. Aplica a: **Production, Preview, Development**

### 3️⃣ Validar Configuración

```bash
npm run security:validate
```

Esto verificará:
- ✅ Variables de entorno configuradas
- ✅ No hay credenciales hardcodeadas
- ✅ Archivos sensibles protegidos
- ✅ Headers de seguridad activos

### 4️⃣ Eliminar Archivos de Prueba

```bash
# En Windows PowerShell:
Remove-Item usuarios_prueba.txt -ErrorAction SilentlyContinue
Remove-Item setup-test-user.html -ErrorAction SilentlyContinue
Remove-Item data\wallet-db.json -ErrorAction SilentlyContinue

# En Linux/Mac:
rm -f usuarios_prueba.txt setup-test-user.html data/wallet-db.json
```

---

## 🛡️ Características de Seguridad Activas

| Característica | Estado | Descripción |
|----------------|--------|-------------|
| **Encriptación** | ✅ | AES-256-GCM para datos sensibles |
| **Rate Limiting** | ✅ | Protección contra ataques de fuerza bruta |
| **Headers de Seguridad** | ✅ | CSP, X-Frame-Options, etc. |
| **Validación de Inputs** | ✅ | Sanitización y validación |
| **Autenticación JWT** | ✅ | Sesiones seguras con NextAuth |
| **Passwords Hasheadas** | ✅ | bcrypt con salt rounds = 10 |

---

## 📊 Límites de Rate Limiting

| Endpoint | Límite | Ventana |
|----------|--------|---------|
| `/api/auth/signin` | 5 intentos | 1 minuto |
| `/api/auth/register` | 3 intentos | 5 minutos |
| `/api/auth/forgot-password` | 3 intentos | 10 minutos |
| Otros APIs | 30-60 req | 1 minuto |

---

## 🚨 Comandos Útiles

```bash
# Generar nuevas claves
npm run security:generate-keys

# Validar configuración de seguridad
npm run security:validate

# Auditar dependencias
npm run security:audit

# Actualizar dependencias de seguridad
npm update

# Ver vulnerabilidades
npm audit
```

---

## 📋 Checklist Pre-Lanzamiento

- [ ] Claves generadas y configuradas en Vercel
- [ ] `usuarios_prueba.txt` eliminado
- [ ] `setup-test-user.html` eliminado
- [ ] No hay credenciales en el código
- [ ] Validación de seguridad pasada
- [ ] Variables de entorno en producción
- [ ] Usuarios admin creados en BD
- [ ] Backup de base de datos configurado

---

## 🔗 Enlaces Importantes

- **Guía Completa**: Ver `SECURITY.md`
- **Configuración**: Ver `.env.example`
- **Código de Seguridad**: Ver `lib/security.ts`

---

## 📞 Soporte

Para reportar problemas de seguridad:
- **Email**: security@creatiendas.com
- **Urgente**: Contacta al equipo de desarrollo

---

**Última actualización**: 2025-12-04
