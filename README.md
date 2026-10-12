# HABLEMOS · Landing de validación (beta)

Landing estática (HTML + CSS + JavaScript, sin instalar nada) que guarda inscritos a la beta en una única tabla de Supabase. Se publica en Vercel.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Página: nombre, problema, propuesta, público, beneficios, prototipo y formulario |
| `styles.css` | Estilos (responsive, para celular y computadora) |
| `app.js` | Validación del formulario y envío a Supabase |
| `config.js` | URL y clave pública de Supabase (tú la completas) |
| `supabase.sql` | Crea la tabla única `beta_signups` y sus permisos |
| `img/` | Aquí van tus 5 wireframes: `wireframe-1.png` a `wireframe-5.png` |

## Paso 1. Crear el proyecto en Supabase

1. Entra a https://supabase.com, crea una cuenta y pulsa **New project**.
2. Ponle nombre (por ejemplo `hablemos`), crea una contraseña de base de datos (guárdala) y elige la región más cercana.
3. Espera a que termine de crearse (1 a 2 minutos).

## Paso 2. Crear la tabla

1. En el menú izquierdo abre **SQL Editor** y pulsa **New query**.
2. Copia todo el contenido de `supabase.sql`, pégalo y pulsa **Run**.
3. Abre **Table Editor**: debe aparecer la tabla `beta_signups` con sus columnas.

## Paso 3. Copiar las claves públicas

1. Ve a **Project Settings > API** (o **API Keys**).
2. Copia la **Project URL** y la clave **anon public** (también puede llamarse *publishable*).
3. Abre `config.js` y reemplaza los dos textos `PEGA_AQUI...`.

**Importante:** nunca pegues la clave `service_role` ni `secret`. Esas son privilegiadas. La clave `anon` es pública por diseño y es segura porque la tabla tiene permisos limitados (solo insertar).

## Paso 4. Probar en tu computadora

Abre `index.html` con doble clic. Llena el formulario y revisa en Supabase > Table Editor que aparezca la fila.

## Paso 5. Subir a GitHub

1. Crea una cuenta en https://github.com y un repositorio nuevo llamado `hablemos-landing`.
2. Pulsa **uploading an existing file** y arrastra el contenido de la carpeta (no el ZIP, los archivos y la carpeta `img`).
3. Pulsa **Commit changes**.

## Paso 6. Publicar en Vercel

1. Entra a https://vercel.com e inicia sesión con tu cuenta de GitHub.
2. Pulsa **Add New > Project** y elige el repositorio `hablemos-landing`.
3. No cambies nada (Framework Preset: *Other*) y pulsa **Deploy**.
4. Vercel te dará una URL pública del tipo `https://hablemos-landing.vercel.app`.

## Paso 7. Comprobar que funciona desde la URL pública

1. Abre la URL de Vercel, llena el formulario con datos de prueba y envía.
2. Verifica en Supabase > Table Editor que la fila apareció.
3. Prueba que **no se puede leer** desde el público: abre la consola del navegador (F12 > Console) en la landing y ejecuta:

```js
fetch(HABLEMOS_CONFIG.SUPABASE_URL + "/rest/v1/beta_signups?select=*", {
  headers: { apikey: HABLEMOS_CONFIG.SUPABASE_ANON_KEY }
}).then(r => r.json()).then(console.log);
```

Debe responder con un error de permiso (`permission denied`) y no con datos.

## Evidencias que debes capturar

- URL pública de Vercel funcionando (en celular y computadora).
- Estructura de la tabla (Table Editor o la pestaña de columnas).
- Mensaje de éxito y mensajes de error del formulario.
- Fila de prueba en Supabase.
- Resultado de la prueba de lectura bloqueada.
- Política de seguridad (Authentication > Policies) mostrando solo INSERT.

## Seguridad

- El frontend solo contiene la URL y la clave `anon`.
- Row Level Security activado; solo existe permiso de INSERT para el público.
- Validaciones tanto en el navegador como en la base de datos.
- Campo trampa contra bots y correo único.
