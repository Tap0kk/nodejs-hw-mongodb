import createError from 'http-errors';
import * as contactsService from '../services/contacts.js';
import mongoose from 'mongoose';

export const getAllContacts = async (req, res) => {
  const userId = req.user._id;
  const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.query;
  const filters = { userId };

  if (type) filters.contactType = type;
  if (isFavourite !== undefined) filters.isFavourite = isFavourite === 'true';

  const contacts = await contactsService.listContacts(
    filters,
    {
      page: Number(page),
      perPage: Number(perPage),
      sortBy,
      sortOrder,
    }
  );

  res.json({
    status: 200,
    message: "Successfully found contacts!",
    data: contacts,
  });
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await contactsService.getContact({ _id: contactId, userId });
  if (!contact) throw createError(404, 'Contact not found');

  res.json({
    status: 200,
    message: "Successfully fetched a contact!",
    data: contact,
  });
};

export const createContact = async (req, res) => {
  const { name, email, phoneNumber, contactType, isFavourite } = req.body;
  const userId = req.user._id;

  const photoPath = req.file ? req.file.path : null;

  const newContact = await contactsService.addContact({
    name,
    email,
    phoneNumber,
    contactType,
    isFavourite,
    photo: photoPath,
    user: req.user._id,
  });

  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: newContact,
  });
};

export const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const updates = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createError(400, 'Invalid contact ID');
  }

  if (req.file) {
    updates.photo = req.file.path;
  }

  const updated = await contactsService.patchContact(contactId, updates, userId);
  if (!updated) {
    throw createError(404, 'Contact not found or not owned by user');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updated,
  });
};

export const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const removed = await contactsService.removeContact(contactId, userId);
  if (!removed) throw createError(404, 'Contact not found');

  res.status(204).send();
};  
