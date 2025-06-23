import { ContactCollection } from '../db/models/contactModel.js';
 import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export async function getAllContacts({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
  userId,
}) {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const filters = { ...filter, userId };

  const [totalItems, contacts] = await Promise.all([
    ContactCollection.countDocuments(filters),
    ContactCollection.find(filters)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasNextPage: totalPages > page,
    hasPreviousPage: page > 1,
  };
}

export const getAllContactsByID = async (contactId, userId) => {
  return await ContactCollection.findOne({ _id: contactId, userId });
};

export const createContact = async (payload, userId) => {
  return await ContactCollection.create({ ...payload, userId });
};

export const deleteContact = async (contactId, userId) => {
  return await ContactCollection.findOneAndDelete({ _id: contactId, userId });
};

export const updateContact = async (
  contactId,
  payload,
  userId,
  options = {},
) => {
  const updatedContact = await ContactCollection.findOneAndUpdate(
    { _id: contactId, userId: userId },
    payload,
    {
      new: true,
      runValidators: true,
      ...options,
    },
  );

  return updatedContact || null;
};
