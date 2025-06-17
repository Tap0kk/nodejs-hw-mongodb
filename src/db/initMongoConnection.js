// src/db/initMongoDB.js

import mongoose from 'mongoose';

import { getEnvVar } from '../utils/getEnvVar.js';

export const initMongoDB = async () => {
  try {
    const user = getEnvVar('MONGODB_USER');
    const pwd = getEnvVar('MONGODB_PASSWORD');
    const url = getEnvVar('MONGODB_URL');
    const db = getEnvVar('MONGODB_DB');

    console.log('🔁 Connecting to MongoDB...');

    await mongoose.connect(
      `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`,
    );
    console.log('✅ MongoDB connected successfully!');
  } catch (e) {
    console.log('❌ Critical MongoDB connection error:', e);
    throw e;
  }
};