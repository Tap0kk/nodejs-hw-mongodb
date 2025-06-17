import { ContactCollection } from '../db/models/contactModel.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const query = { userId };

  if (filter.type) {
    query.contactType = filter.type;
  }
  if (filter.isFavourite !== undefined) {
    query.isFavourite = filter.isFavourite;
  }

  const [contactsCount, contacts] = await Promise.all([
    ContactCollection.countDocuments(query),
    ContactCollection.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

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
    { _id: contactId, userId },
    payload,
    {
      new: true,
      runValidators: true,
      ...options,
    },
  );

  return updatedContact || null;
};