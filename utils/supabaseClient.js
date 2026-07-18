// supabaseClient.js
//
// Aquí se conecta el sitio con TU base de datos propia (Supabase).
// Supabase te da, gratis, una base de datos PostgreSQL real + sistema de login,
// accesible por internet vía HTTPS. Por eso funciona igual sin importar dónde
// abras el sitio: GitHub Pages, Visual Studio Code (Live Server), tu compu,
// Render, Netlify, etc. Ya NO depende de que tengas un servidor Node corriendo.
//
// ---------------------------------------------------------------
// CÓMO OBTENER TUS DATOS (5 minutos, gratis):
// 1) Entra a https://supabase.com y crea una cuenta (puede ser con GitHub).
// 2) Crea un "New Project" (elige cualquier nombre y contraseña de base de datos).
// 3) Cuando el proyecto esté listo, ve a: Project Settings -> API.
// 4) Copia el "Project URL" y pégalo abajo en SUPABASE_URL.
// 5) Copia la "anon public" key y pégala abajo en SUPABASE_ANON_KEY.
// 6) Ve a SQL Editor (menú izquierdo) -> New query, pega el contenido del
//    archivo "supabase-setup.sql" (incluido en este proyecto) y dale RUN.
//    Eso crea las tablas nexus_users, nexus_purchases y nexus_leads.
// 7) Ve a Authentication -> Providers -> Email y, en "Confirm email",
//    desactívalo (Disable) si quieres que el usuario pueda iniciar sesión
//    inmediatamente después de registrarse, sin revisar su correo.
// ---------------------------------------------------------------

const SUPABASE_URL = 'https://bemfwvsvangaozxnwlrq.supabase.co'; // ej: https://abcdefghijk.supabase.co
const SUPABASE_ANON_KEY = 'sb_publishable_oG3NLeOhFs-L4qJnQ1xgCg_K3ke1Kph';

let supabaseClient = null;

if (
    typeof window.supabase !== 'undefined' &&
    SUPABASE_URL &&
    !SUPABASE_URL.startsWith('PEGA_AQUI') &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_ANON_KEY.startsWith('PEGA_AQUI')
) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
    console.warn(
        '⚠️ Nexus: todavía no configuraste tu base de datos de Supabase.\n' +
        'Abre utils/supabaseClient.js y sigue las instrucciones de los comentarios ' +
        'para pegar tu SUPABASE_URL y SUPABASE_ANON_KEY. Mientras tanto, el login y ' +
        'los registros no van a funcionar.'
    );
}

window.NEXUS_SUPABASE_READY = !!supabaseClient;
window.supabaseClient = supabaseClient;
