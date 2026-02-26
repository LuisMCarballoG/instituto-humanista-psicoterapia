# Instituto Humanista - Plataforma de Certificados

Este proyecto contiene el sitio web del Instituto Humanista y la plataforma para la emisión y validación de certificados digitales con código QR integrando Supabase.

## Requisitos Previos

- **Node.js**: Versión 18+ recomendada
- **Cuenta en Supabase**: (Las credenciales de configuración ya están seteadas para desarrollo local, ver `.env`)

## Instrucciones para Levantar en Local

Sigue estos pasos para probar el proyecto íntegramente en tu máquina:

### 1. Instalar Dependencias

Abre una terminal en la raíz de este proyecto y ejecuta:

```bash
npm install
```

### 2. Configurar Entorno Local

Asegúrate de tener un archivo `.env` en la raíz de tu proyecto (junto a `package.json`). Ya he configurado uno basándome en los datos que me proporcionaste. Si no existe, créalo con el siguiente contenido:

```env
VITE_SUPABASE_URL=https://ovdtrpygbublpltvqvwd.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_Gted9hcncjaiog-OMPjQaw_kcL7wA7c
```

### 3. Configurar la Base de Datos (Supabase)

Si esta es una base de datos recién creada, necesitas preparar las tablas y bóvedas (Storage) para que los certificados puedan guardarse y leerse.

1. Ve a tu panel de control en [Supabase](https://supabase.com).
2. Entra a tu proyecto (URL: `ovdtrpygbublpltvqvwd`).
3. En el menú izquierdo, entra al **SQL Editor**.
4. Copia todo el contenido del archivo `supabase/schema.sql` (que se encuentra en este proyecto) y pégalo en el editor.
5. Haz clic en **Run**. Esto creará la tabla `certificates`, el bucket `certificates` en Storage y establecerá todas las reglas de seguridad necesarias.

### 4. Crear un Usuario Administrador

Para poder entrar al Dashboard, ocupas un usuario.
1. En tu panel de Supabase, ve a **Authentication** -> **Users**.
2. Haz clic en **Add User** -> **Create New User**.
3. Ingresa un email (ej. `admin@institutohumanista.com`) y una contraseña segura, y marca "Auto Confirm User".
4. Usa esas credenciales más adelante para iniciar sesión en la app.

### 5. Iniciar el Servidor Local

Finalmente, levanta el proyecto ejecutando el comando:

```bash
npm run dev
```

Te aparecerá una URL local (usualmente `http://localhost:5173`). Haz Ctrl+Clic para abrirla en el navegador. 
- Puedes ver la **Landing Page**.
- Entrar a **Portal Admin** e iniciar sesión con el usuario que creaste.
- Generar nuevos certificados.
- Comprobar que el PDF se genera, se sube correctamente al storage y es validable escaneando o buscando su código UUID.

## Estructura Principal del Proyecto

- `src/pages/Home.tsx` - Landing page pública
- `src/pages/Scan.tsx` - Cámara para escanear y validar QR web
- `src/pages/CertificateView.tsx` - Visor de certificados (Donde vive el PDF online)
- `src/pages/admin/` - Rutas protegidas (Login, Dashboard, Creador de PDFs)
- `supabase/schema.sql` - Comando SQL fundacional de tu proyecto.
