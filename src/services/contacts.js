import Contact from '../models/contact.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export const listContacts = async (
  filters = {},
  { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc' }
) => {
  const skip = (page - 1) * perPage;
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const [contacts, totalItems] = await Promise.all([
    Contact.find(filters).sort(sort).skip(skip).limit(perPage),
    Contact.countDocuments(filters),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);
  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
};

export const getContact = async ({ _id, userId }) => {
  return await Contact.findOne({ _id, user: userId });
};


export const addContact = async ({ name, email, phoneNumber, contactType, isFavourite, photo, user }) => {
  return await Contact.create({ name, email, phoneNumber, contactType, isFavourite, photo, user });
};

export const patchContact = async (id, updates, userId) => {
  return await Contact.findOneAndUpdate(
    { _id: id, user: userId },
    updates,
    {
      new: true,
      runValidators: true,
    }
  );
};

export const removeContact = async (id) => {
  return await Contact.findByIdAndDelete(id); 
};