# Nexus – Sitio + Mini Servidor Proxy con IA real

## 🔑 Login/registro y video: por qué sólo funcionaban en Render (y cómo se arregló)

**El login:** dependía de que hubiera un servidor Node (`server/server.js`) corriendo
en el mismo lugar donde abrías el sitio, porque `utils/db.js` llamaba a rutas como
`/api/auth/login`. Render sí ejecuta ese servidor Node — por eso ahí funcionaba. Pero
**GitHub Pages y el "Live Server" de Visual Studio Code sólo sirven archivos estáticos**,
no pueden ejecutar Node en absoluto, así que esas rutas nunca respondían.

**Solución:** el login, registro, perfil y compras ahora usan **Supabase**
(https://supabase.com), un servicio gratuito que te da tu propia base de datos
PostgreSQL real + sistema de autenticación, accesible por internet vía HTTPS. Como es
tu base de datos en la nube y no un servidor tuyo, funciona exactamente igual sin
importar dónde abras el sitio: GitHub Pages, VS Code, tu computadora, Render, etc.

👉 **Antes de usar el sitio**, sigue las instrucciones dentro de
`utils/supabaseClient.js` (5 minutos) y ejecuta `supabase-setup.sql` en el
SQL Editor de tu proyecto de Supabase. Sin ese paso, el login mostrará un aviso
pidiéndote que lo configures.

**El video:** estaba embebido desde un enlace externo de HeyGen
(`resource2.heygen.ai`), y esos enlaces sólo se dejan reproducir en el dominio donde
se generaron (por eso Render sí funcionaba y cualquier otro lugar no) — es una
restricción del lado de HeyGen, no algo controlable desde el código.

**Solución:** el video ahora se reproduce desde un archivo local
(`video/nexus-intro.mp4`) igual que las imágenes del sitio, sin depender de ningún
servicio externo. Sigue las instrucciones en `video/LEEME.txt` para descargar tu
video de HeyGen (una sola vez) y colocarlo en esa carpeta.

**El chat con IA** (el asistente virtual) es la única parte que sigue necesitando el
servidor Node de `/server`, porque debe esconder tu API key de Anthropic — eso es
inevitable por seguridad. Si no vas a usar el chatbot, puedes ignorar esa parte por
completo: el resto del sitio (login incluido) funciona sin él.

---

## ¿Qué cambió respecto al proyecto original?

El proyecto venía exportado de Trickle.so y usaba funciones globales que **no existen
fuera de esa plataforma**: `invokeAIAgent`, `trickleListObjects`, `trickleCreateObject`,
`trickleUpdateObject`, además de cargar React/Babel/íconos desde `resource.trickle.so`.
Por eso el chat, el login/registro y las compras no funcionaban al abrir el sitio por
tu cuenta. Todo eso fue reemplazado y el proyecto ahora es 100% independiente:
las librerías de frontend se cargan desde unpkg (CDN público), y toda la base de datos
e IA corren en el mini servidor propio descrito abajo. Ya no queda ninguna referencia
a Trickle.so en el código.

Se agregó un **mini servidor proxy** (`/server`) en Node/Express que reemplaza todo eso:

- **`/api/chat`** → el asistente ahora es una IA real (Claude, de Anthropic), no un simulador.
  Además tiene **memoria persistente por usuario**: cada dato relevante que aprende
  (nombre, tipo de proyecto que busca, presupuesto, dudas frecuentes...) se guarda en
  `server/data/memory.json` y se vuelve a usar en la próxima conversación, así que
  literalmente "va aprendiendo" de cada usuario con el que habla.
- **`/api/leads`** → respaldo para guardar las dudas que la IA no pudo resolver, sólo se
  usa si todavía no configuraste Supabase; una vez configurado, esas dudas se guardan
  directo en tu tabla `nexus_leads` de Supabase.

El login, registro, perfiles y compras **ya no pasan por este servidor**: ahora usan
Supabase directamente desde el navegador (ver sección de arriba). Esto es justamente
lo que hace que funcionen en cualquier hosting, incluyendo estático (GitHub Pages).

También se modificaron las tarjetas del **Catálogo**: cada botón "Ver Detalles" ahora
abre una página propia en una pestaña nueva (ver sección "Conectar tus propias páginas" abajo).

## ⚠️ Seguridad: rota tu API key

Si en algún momento tuviste una API key de Anthropic escrita directamente en
`server/.env.example` o en cualquier archivo dentro de este repositorio, considérala
comprometida y revócala en https://console.anthropic.com/settings/keys, luego genera una
nueva y colócala **solo** en tu `server/.env` local (ese archivo nunca se sube a git,
está en `.gitignore`).

## Cómo correrlo

```bash
cd server
npm install
cp .env.example .env
```

Edita `server/.env` y coloca tu API key de Anthropic:

```
ANTHROPIC_API_KEY=sk-ant-...
```

(Consíguela en https://console.anthropic.com/settings/keys — sin esto el chat responderá
con un mensaje de aviso en vez de conectarse a la IA, pero el resto del sitio funciona igual).

Luego arranca el servidor:

```bash
npm start
```

Y abre **http://localhost:3000** en el navegador. Este mismo servidor sirve el sitio
completo (HTML/JS/CSS) y la API, así que no necesitas nada más corriendo en paralelo.

## Conectar tus propias páginas a las tarjetas del catálogo

En `components/Catalog.js`, cada tarjeta tiene un campo `pageUrl`:

```js
{
    id: 1,
    title: "Web Corporativa",
    ...
    pageUrl: "paginas/web-corporativa.html"
}
```

Ahora mismo apuntan a páginas de ejemplo dentro de la carpeta `/paginas` (solo para que
los botones funcionen desde ya). Reemplaza cada archivo `.html` de esa carpeta por tu
página real, **o** cambia directamente el valor de `pageUrl` por la ruta/URL de la página
que ya hiciste (puede ser un archivo local o un link externo, por ejemplo
`"https://tusitio.com/proyecto-1"`). El botón abre esa página en una pestaña nueva.

## Cómo "aprende" el asistente

1. El usuario escribe algo en el chat.
2. El servidor le pasa a Claude toda la conversación **más** lo que ya sabe de ese usuario
   (guardado en `server/data/memory.json`, identificado por un `sessionId` guardado en el
   `localStorage` del navegador).
3. Claude responde y, de forma oculta al usuario, indica qué datos nuevos aprendió.
4. El servidor guarda esos datos nuevos en la memoria de ese usuario para la próxima vez.

Puedes ver la memoria acumulada de cualquier sesión abriendo `server/data/memory.json`
mientras el servidor corre.

## Estructura del proyecto

```
index.html, app.js, components/    → Frontend (React vía Babel, sin build step)
utils/supabaseClient.js            → Conexión a tu base de datos de Supabase (pega tus llaves aquí)
utils/db.js                        → Login, registro, perfil, compras (Supabase) y chat (servidor)
supabase-setup.sql                 → Ejecútalo una vez en el SQL Editor de Supabase
video/nexus-intro.mp4              → Tu video de presentación (agrégalo tú, ver video/LEEME.txt)
server/
  server.js                        → Servidor Express, sólo para el chat con IA (/api/chat)
  ai.js                             → Lógica del chat con IA real + memoria
  store.js                         → Respaldo de /api/leads si Supabase no está configurado
  data/                             → Se genera automáticamente al usar el sitio
paginas/                           → Páginas de destino de las tarjetas del catálogo (reemplázalas)
```
