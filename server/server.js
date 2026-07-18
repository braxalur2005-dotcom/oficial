// server.js
// Servidor mínimo para el chat con IA del proyecto Nexus.
//
// Login, registro, perfiles y compras YA NO dependen de este servidor: ahora usan
// Supabase (tu propia base de datos en internet), configurada en
// utils/supabaseClient.js. Por eso el login funciona igual en GitHub Pages,
// Visual Studio Code, tu computadora, Render, etc.
//
// Este servidor sólo sigue siendo necesario para UNA cosa: el chat con IA
// (/api/chat), porque esa función necesita esconder tu ANTHROPIC_API_KEY (si la
// expusieras en el navegador, cualquiera podría robarla y gastar tu saldo). Si no
// vas a usar el chatbot, puedes ignorar este servidor por completo: el resto del
// sitio (incluyendo el login) funciona sin él.
//
// Cómo usarlo (sólo si quieres el chatbot con IA funcionando):
//   1) cd server && npm install
//   2) copia .env.example a .env y coloca tu ANTHROPIC_API_KEY
//   3) npm start
//   4) abre http://localhost:3000

require('dotenv').config();
const express = require('express');
const path = require('path');

const store = require('./store');
const { chatWithAI } = require('./ai');

const app = express();
const PORT = process.env.PORT || 3000;
const PROJECT_ROOT = path.join(__dirname, '..');

app.use(express.json());

// Sirve todo el sitio estático (index.html, app.js, components/, paginas/, etc.)
app.use(express.static(PROJECT_ROOT));

// ---------- CHAT (IA real con memoria persistente) ----------
app.post('/api/chat', async (req, res) => {
    try {
        const { sessionId, message } = req.body;
        if (!sessionId || !message) {
            return res.status(400).json({ error: 'Faltan sessionId o message' });
        }
        const result = await chatWithAI(sessionId, message);
        res.json(result);
    } catch (err) {
        console.error('Error en /api/chat:', err);
        res.status(500).json({ error: 'Error al hablar con el asistente' });
    }
});

// ---------- LEADS (respaldo por si Supabase no está configurado todavía) ----------
app.post('/api/leads', (req, res) => {
    try {
        const { nombre, correo, duda } = req.body;
        const lead = store.createObject('nexus_lead', {
            nombre: nombre || '',
            correo: correo || '',
            duda: duda || '',
            fecha: new Date().toISOString(),
        });
        console.log('📩 Nuevo lead recibido para un asesor:', lead.objectData);
        res.json({ ok: true, lead });
    } catch (err) {
        console.error('Error en /api/leads:', err);
        res.status(500).json({ ok: false, error: 'No se pudo guardar la duda' });
    }
});

app.listen(PORT, () => {
    console.log(`\n🚀 Servidor Nexus (chat IA) corriendo en http://localhost:${PORT}`);
});
