import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Contact from '../src/models/contact.js';
import { getEnvVar } from '../src/utils/getEnvVar.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mongoUri = getEnvVar('MONGODB_URL');

const importContacts = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const filePath = path.join(__dirname, '../contacts.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const contacts = JSON.parse(data);

    await Contact.insertMany(contacts);
    console.log('✅ Contacts imported successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Import error:', err.message);
    process.exit(1);
  }
};

importContacts();
