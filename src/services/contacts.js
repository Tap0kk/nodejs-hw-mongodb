import { ContactCollection } from '../db/models/contactModel.js';

export const getAllContacts = async () => {
  const contacts = await ContactCollection.find();
  return contacts;
};

export const getAllContactsByID = async (contactId) => {
  const student = await ContactCollection.findById(contactId);
  return student;
};