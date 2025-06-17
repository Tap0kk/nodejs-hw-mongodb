import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
import { getAllContacts, getAllContactsByID } from './services/contacts.js';

const PORT = Number(getEnvVar('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.json({
      message: `Server is running on port ${PORT}`,
    });
  });

  // ==== Маршрути /contacts ====
  app.get('/contacts', async (req, res, next) => {
    try {
      const contacts = await getAllContacts();
      res.status(200).json({
        status: 200,
        message: '✅ Successfully found contacts!',
        data: contacts,
      });
    } catch (err) {
      next(err);
    }
  });

  app.get('/contacts/:contactId', async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const contact = await getAllContactsByID(contactId);

      if (!contact) {
        return res.status(404).json({
          status: 404,
          message: 'Contact not found',
        });
      }

      res.status(200).json({
        status: 200,
        message: '✅ Successfully found contact!',
        data: contact,
      });
    } catch (err) {
      next(err);
    }
  });

  // ==== 404 Middleware ====
  app.use('*', (req, res) => {
    res.status(404).json({ message: '❌ Not found' });
  });

  // ==== Обробка помилок ====
  app.use((err, req, res, next) => {
    res.status(500).json({
      message: '❌ Something went wrong',
      error: err.message,
    });
  });

  // ==== Запуск сервера ====
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};