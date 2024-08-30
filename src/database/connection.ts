import mongoose from 'mongoose';

const dbName = process.env.MONGO_DB || "Reader";
const dbUser = process.env.MONGO_USER || "user";
const dbPass = process.env.MONGO_PASS || "pass";
const dbHost = process.env.MONGO_HOST || "mongodb";

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb://${dbUser}:${dbPass}@${dbHost}:27017/${dbName}?authSource=admin`,
    );
    console.log('MongoDB conectado com sucesso');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB', error);
    process.exit(1);
  }
};

export default connectDB;
