# Formulario de registro con Supabase (HTML, CSS y JavaScript)

Sistema de información básico: un formulario web hecho solo con **HTML, CSS y JavaScript** que guarda datos reales en una base de datos PostgreSQL de **Supabase**.

- Aplicación en línea: https://fabian406.github.io/formulario-html/
- Campos: nombres, apellidos, tipo de identificación (CC, TI, CE, RC), número de identificación (solo números), correo, celular (10 dígitos) y mensaje.

## Archivos

| Archivo | Función |
|---|---|
| `index.html` | Estructura del formulario |
| `style.css` | Diseño |
| `app.js` | Conexión con Supabase y lógica de guardado |
| `supabase.sql` | Crea la tabla `contactos` y sus políticas de seguridad |

## Cómo se conecta con la base de datos

```
Navegador (index.html + app.js) ──HTTPS──▶ API REST de Supabase ──▶ PostgreSQL (tabla "contactos")
```

1. `index.html` carga la librería oficial `@supabase/supabase-js` desde un CDN, antes de `app.js`.
2. En `app.js` se crea el cliente con la **URL** del proyecto y la **clave pública (anon)**:
   ```js
   const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
   ```
3. Al enviar el formulario se guarda con:
   ```js
   const { error } = await db.from('contactos').insert([datos]);
   ```
   La librería convierte esa llamada en una petición HTTPS POST a la API de Supabase, que ejecuta el `INSERT` en PostgreSQL.
4. Si no hay error, la pantalla muestra durante 5 segundos solo el registro recién guardado.
5. **Seguridad:** la clave `anon` es pública por diseño. La tabla tiene *Row Level Security* y una única política que permite **insertar**; no hay política de lectura, así que nadie puede leer los datos desde el navegador. Los registros se consultan en Supabase → *Table Editor → contactos*. Las columnas de identificación y celular también validan que sean solo números.

## Puesta en marcha

1. En Supabase, ejecuta `supabase.sql` en el **SQL Editor**.
2. En `app.js`, verifica `SUPABASE_URL` y `SUPABASE_ANON_KEY` (Supabase → Project Settings → API).
3. Abre `index.html` en el navegador (doble clic o con Live Server).
4. Envía el formulario y confirma el registro en *Table Editor → contactos*.

## Publicar

Sube los archivos a GitHub y activa **Settings → Pages → Deploy from a branch → `main` / root**. No requiere compilar nada.
