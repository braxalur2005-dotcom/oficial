// db.js
// Funciones de acceso a datos del sitio Nexus.
//
// Login, registro, perfil y compras ahora usan Supabase: tu propia base de
// datos real en internet. Esto hace que funcionen igual sin importar dónde
// abras el sitio (GitHub Pages, VS Code, tu compu, Render, etc.), porque ya
// no dependen de tener un servidor Node propio corriendo.
//
// El chat con IA (/api/chat) sigue usando un pequeño servidor (server/server.js)
// porque necesita esconder tu llave secreta de Anthropic; esa parte del sitio
// sólo funciona cuando ese servidor está corriendo (ver README.md).

function requireSupabase() {
    if (!window.NEXUS_SUPABASE_READY) {
        throw new Error(
            'La base de datos todavía no está configurada. Abre utils/supabaseClient.js ' +
            'y sigue las instrucciones para conectar tu proyecto de Supabase.'
        );
    }
    return window.supabaseClient;
}

// Convierte una fila de nexus_users al formato { objectId, objectData } que
// usan los componentes (Profile.js, Packages.js, app.js, etc.)
function toUserShape(row) {
    if (!row) return null;
    return {
        objectId: row.id,
        objectData: {
            name: row.name,
            email: row.email,
            phone: row.phone || '',
            avatarUrl: row.avatar_url || '',
            activePackage: row.active_package || 'Gratis',
        },
    };
}

const fetchUserRow = async (supabase, userId) => {
    const { data, error } = await supabase
        .from('nexus_users')
        .select('*')
        .eq('id', userId)
        .single();
    if (error) throw error;
    return data;
};

const loginUser = async (email, password) => {
    const supabase = requireSupabase();
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error || !data.user) return null;
        const row = await fetchUserRow(supabase, data.user.id);
        return toUserShape(row);
    } catch (e) {
        console.error(e);
        return null;
    }
};

const registerUser = async (name, email, password) => {
    const supabase = requireSupabase();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
        throw new Error(error.message || 'No se pudo registrar');
    }
    if (!data.user) {
        throw new Error('No se pudo crear la cuenta');
    }

    // Crea el perfil en nexus_users
    const { data: profile, error: profileError } = await supabase
        .from('nexus_users')
        .insert({ id: data.user.id, name, email, active_package: 'Gratis' })
        .select()
        .single();

    if (profileError) {
        throw new Error(profileError.message || 'No se pudo crear el perfil');
    }

    // Si Supabase requiere confirmación por correo, todavía no habrá sesión activa.
    if (!data.session) {
        throw new Error('Cuenta creada. Revisa tu correo para confirmar tu cuenta antes de iniciar sesión.');
    }

    return toUserShape(profile);
};

const updateUserProfile = async (userId, updatedFields) => {
    const supabase = requireSupabase();
    const { data, error } = await supabase
        .from('nexus_users')
        .update({
            name: updatedFields.name,
            phone: updatedFields.phone,
            avatar_url: updatedFields.avatarUrl,
            updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

    if (error) throw new Error(error.message || 'No se pudo actualizar el perfil');
    return toUserShape(data);
};

const createPurchase = async ({ userId, packageId, packageName, amount, paymentMethod }) => {
    const supabase = requireSupabase();

    const { data: purchase, error: purchaseError } = await supabase
        .from('nexus_purchases')
        .insert({
            user_id: userId,
            package_id: packageId,
            package_name: packageName,
            amount,
            payment_method: paymentMethod,
        })
        .select()
        .single();

    if (purchaseError) throw new Error(purchaseError.message || 'No se pudo registrar la compra');

    const { data: updatedUser, error: userError } = await supabase
        .from('nexus_users')
        .update({ active_package: packageName, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();

    if (userError) throw new Error(userError.message || 'No se pudo actualizar el paquete activo');

    return { purchase, user: toUserShape(updatedUser) };
};

// Restaura la sesión activa (si el usuario ya había iniciado sesión antes)
const getCurrentUser = async () => {
    if (!window.NEXUS_SUPABASE_READY) return null;
    const supabase = window.supabaseClient;
    const { data } = await supabase.auth.getSession();
    if (!data.session) return null;
    try {
        const row = await fetchUserRow(supabase, data.session.user.id);
        return toUserShape(row);
    } catch (e) {
        return null;
    }
};

const logoutUser = async () => {
    if (!window.NEXUS_SUPABASE_READY) return;
    await window.supabaseClient.auth.signOut();
};

// ---------- Chat con IA (sigue usando el servidor Node, ver README.md) ----------
const parseJsonSafe = async (res) => {
    const text = await res.text();
    try {
        return text ? JSON.parse(text) : {};
    } catch (e) {
        return { __raw: text };
    }
};

const sendChatMessage = async (sessionId, message) => {
    const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message })
    });
    const data = await parseJsonSafe(res);
    if (!res.ok) {
        throw new Error(data.error || data.__raw || 'No se pudo contactar al asistente');
    }
    return data;
};

// Los "leads" (dudas que la IA no resolvió) ahora se guardan directo en Supabase,
// así funcionan aunque el servidor de chat no esté corriendo.
const sendLead = async ({ nombre, correo, duda }) => {
    if (window.NEXUS_SUPABASE_READY) {
        const { error } = await window.supabaseClient
            .from('nexus_leads')
            .insert({ nombre: nombre || '', correo: correo || '', duda: duda || '' });
        if (error) throw new Error(error.message || 'No se pudo enviar la duda');
        return { ok: true };
    }
    // Si todavía no configuraron Supabase, intenta con el servidor Node como respaldo.
    const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, duda })
    });
    const data = await parseJsonSafe(res);
    if (!res.ok) {
        throw new Error(data.error || data.__raw || 'No se pudo enviar la duda');
    }
    return data;
};
