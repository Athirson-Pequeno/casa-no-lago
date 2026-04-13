require('dotenv').config();
const express = require('express');
const cors    = require('cors');

// Inicia a conexão com o MongoDB assim que o servidor sobe
require('./config/db.js');

// Rotas
const authRoute    = require('./routes/authRoute');
const clienteRoute = require('./routes/clienteRoute');
const quartosRoute = require('./routes/quartosRoute');
const reservaRoute = require('./routes/reservaRoute');
const tagRoute     = require('./routes/tagRoute');

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
// Define quais origens podem chamar a API.
// Configure FRONTEND_URL no dashboard do Render com a URL do seu Vercel.
const allowedOrigins = [
  process.env.FRONTEND_URL,    // Ex: https://casa-do-lago.vercel.app
  'http://localhost:5500',     // Live Server (VS Code)
  'http://127.0.0.1:5500',
  'http://localhost:3000',
].filter(Boolean);             // Remove entradas undefined/null

app.use(cors({
  origin: (origin, callback) => {
    // Permite chamadas sem "origin" (Postman, curl, apps mobile)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`Origem "${origin}" bloqueada pelo CORS`));
  },
  credentials: true,
}));

// ── BODY PARSERS ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── HEALTH CHECK ──────────────────────────────────────────────────────────────
// O Render faz ping nessa rota para verificar se o serviço está vivo.
app.get('/', (_req, res) => {
  res.json({ status: 'ok', projeto: 'Casa do Lago API' });
});

// ── ROTAS DA APLICAÇÃO ────────────────────────────────────────────────────────
app.use('/auth',     authRoute);
app.use('/clientes', clienteRoute);
app.use('/quartos',  quartosRoute);
app.use('/reservas', reservaRoute);
app.use('/tags',     tagRoute);

// ── SERVIDOR ──────────────────────────────────────────────────────────────────
// O Render injeta process.env.PORT automaticamente; localmente usa 3000.
const PORT = process.env.PORT || 3000;

// ping para não deixar o Render "dormir" o serviço, mantendo-o responsivo. Intervalo de 13 minutos.
const RENDER_URL = process.env.RENDER_EXTERNAL_URL;
if (RENDER_URL) {
  setInterval(() => {
    fetch(`${RENDER_URL}/`)
      .then(() => console.log('🏓 ping keep-alive'))
      .catch(err => console.warn('⚠️ ping falhou:', err.message));
  }, 13 * 60 * 1000);
}

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
