// supabaseClient.js
//
// Conecta el sitio con la base de datos de Supabase (PostgreSQL + login).

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bemfwvsvangaozxnwlrq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_oG3NLeOhFs-L4qJnQ1xgCg_K3ke1Kph';

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const NEXUS_SUPABASE_READY = true;

