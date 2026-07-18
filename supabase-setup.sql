-- supabase-setup.sql
-- Copia y pega TODO este archivo en Supabase -> SQL Editor -> New query -> RUN
-- Crea las tablas que usa el sitio Nexus para login, perfiles, compras y dudas del chat.

-- Tabla de perfiles de usuario (vinculada al login de Supabase Auth)
create table if not exists nexus_users (
    id uuid primary key references auth.users(id) on delete cascade,
    name text not null,
    email text not null,
    phone text,
    avatar_url text,
    active_package text not null default 'Gratis',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Tabla de compras
create table if not exists nexus_purchases (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references nexus_users(id) on delete cascade,
    package_id text,
    package_name text,
    amount numeric,
    payment_method text,
    created_at timestamp with time zone default now()
);

-- Tabla de dudas/leads del chatbot (modo "Automático")
create table if not exists nexus_leads (
    id uuid primary key default gen_random_uuid(),
    nombre text,
    correo text,
    duda text,
    created_at timestamp with time zone default now()
);

-- Seguridad: activamos RLS (Row Level Security) en todas las tablas
alter table nexus_users enable row level security;
alter table nexus_purchases enable row level security;
alter table nexus_leads enable row level security;

-- Cualquier persona autenticada puede leer y crear su propio perfil
create policy "Los usuarios pueden ver su propio perfil"
    on nexus_users for select
    using (auth.uid() = id);

create policy "Los usuarios pueden crear su propio perfil"
    on nexus_users for insert
    with check (auth.uid() = id);

create policy "Los usuarios pueden actualizar su propio perfil"
    on nexus_users for update
    using (auth.uid() = id);

-- Compras: cada usuario ve y crea solo las suyas
create policy "Los usuarios pueden ver sus propias compras"
    on nexus_purchases for select
    using (auth.uid() = user_id);

create policy "Los usuarios pueden crear sus propias compras"
    on nexus_purchases for insert
    with check (auth.uid() = user_id);

-- Leads: cualquiera (incluso sin login) puede enviar una duda desde el chat
create policy "Cualquiera puede enviar una duda"
    on nexus_leads for insert
    with check (true);
