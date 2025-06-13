import mongoose from 'mongoose';
import { getEnvVar } from '../utils/getEnvVar.js';

export const initMongoConnection = async () => {
  try {
    const user = encodeURIComponent(getEnvVar('MONGODB_USER'));
    const password = encodeURIComponent(getEnvVar('MONGODB_PASSWORD'));
    const db = encodeURIComponent(getEnvVar('MONGODB_DB'));
    const host = getEnvVar('MONGODB_URL').replace(/^mongodb(\+srv)?:\/\//, '');
    const connectionString = `mongodb+srv://${user}:${password}@${host}/${db}?retryWrites=true&w=majority`;

    console.log('🔁 Connecting to MongoDB...');
    
    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 30000
    });
    
    console.log('✅ MongoDB connected successfully!');
  } catch (error) {
    console.error('❌ Critical MongoDB connection error:');
    process.exit(1);
  }
};