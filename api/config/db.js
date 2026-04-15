const mongoose = require('mongoose');

const dbUser     = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
const dbName     = 'casa-do-lago'

// Validação antecipada — falha rápido se as credenciais não estiverem configuradas
if (!dbUser || !dbPassword) {
  console.error('❌ DB_USER ou DB_PASS não definidos. Configure as variáveis de ambiente.');
  process.exit(1);
}

// URI de conexão ao cluster MongoDB Atlas
const connectionString =
  `mongodb+srv://${dbUser}:${dbPassword}@cluster0.6d3qy1p.mongodb.net/${dbName}?retryWrites=true&w=majority`;

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose
      .connect(connectionString)
      .then(() => {
        console.log(`✅ Conectado ao banco: ${dbName}`);
      })
      .catch((err) => {
        console.error('❌ Erro na conexão com o banco:', err.message);
        process.exit(1);
      });

    // Log quando a conexão cair (ex: instabilidade de rede)
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB desconectado.');
    });
  }
}

module.exports = new Database();
