require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 3000;

// Função para conectar ao banco MySQL
async function connectDB() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    console.log("Conectado ao MySQL com sucesso!");
    return connection;

  } catch (err) {
    console.error("Erro ao conectar no MySQL:", err);
    return null;
  }
}

// Rota principal
app.get('/', (req, res) => {
  res.send('Aplicação Node.js rodando com sucesso!');
});

// Health check da aplicação
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Health check do banco
app.get('/db-health', async (req, res) => {
  const conn = await connectDB();

  if (conn) {
    res.json({ db_status: 'OK', timestamp: new Date() });
    conn.end();
  } else {
    res.status(500).json({ db_status: 'ERROR', timestamp: new Date() });
  }
});
// Teste inicial de conexão
connectDB();

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
