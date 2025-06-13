import dotenv from 'dotenv';
dotenv.config();

import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

const start = async () => {
  try {
    console.log('🚀 Starting app...');
    await initMongoConnection();
    setupServer();
  } catch (error) {
    console.error('❌ Failed to start the app:', error.message);
    process.exit(1);
  }
};

start();
