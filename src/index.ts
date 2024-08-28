import express from 'express';
import connectDB from './database/connection';
import router from './routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Conectar ao MongoDB
connectDB();

app.use(express.json());
app.use('/api', router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
