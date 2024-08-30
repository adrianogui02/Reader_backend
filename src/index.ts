import express from 'express';
import connectDB from './database/connection';
import router from './routes';
import dotenv from 'dotenv';

dotenv.config();

export const app = express();

// Conectar ao MongoDB (apenas fora do ambiente de testes)
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

app.use(express.json());
app.use('/api', router);

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}
