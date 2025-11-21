# CreaTiendas - Next.js Store Builder

Plataforma para crear tiendas de WhatsApp personalizadas, construida con Next.js 14 (App Router).

## 🚀 Cómo usar

### Localmente
1.  Clona el repositorio.
2.  Instala dependencias:
    ```bash
    npm install
    ```
3.  Corre el servidor de desarrollo:
    ```bash
    npm run dev
    ```
4.  Abre `http://localhost:3000`.

### Construcción
```bash
npm run build
```

## 🌍 Publicación y Subdominios

El sistema soporta URLs públicas y subdominios dinámicos para cada tienda.

### Variables de Entorno
Configura estas variables en `.env.local` o en Vercel:

-   `NEXT_PUBLIC_PUBLIC_BASE_URL`: La URL base de tu despliegue (ej. `https://creatiendas.vercel.app`).
-   `NEXT_PUBLIC_ROOT_DOMAIN`: (Opcional) Tu dominio raíz para subdominios (ej. `creatiendas.com`).

### Comportamiento
1.  **Sin configuración**: Las tiendas se generan en `http://localhost:3000/stores/[slug]`.
2.  **Con `NEXT_PUBLIC_PUBLIC_BASE_URL`**: Se generan en `https://tu-app.vercel.app/stores/[slug]`.
3.  **Con `NEXT_PUBLIC_ROOT_DOMAIN`**: Se generan en `https://[slug].tudominio.com`.

### Configuración DNS para Subdominios
Para que los subdominios funcionen en Vercel:
1.  Agrega tu dominio (ej. `creatiendas.com`) en Vercel.
2.  Agrega un registro CNAME Wildcard (`*.creatiendas.com`) apuntando a Vercel.
3.  El middleware del proyecto se encargará de reescribir `tienda.creatiendas.com` a `/stores/tienda`.
