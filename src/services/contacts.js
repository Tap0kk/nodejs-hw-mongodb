import { ContactCollection } from '../db/models/contactModel.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactCollection.find();

  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }
  if (filter.isFavourite !== undefined) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [contactsCount, contacts] = await Promise.all([
    ContactCollection.find().merge(contactsQuery).countDocuments(),
    contactsQuery
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

export const getAllContactsByID = async (contactId) => {
  return await ContactCollection.findById(contactId);
};

export const createContact = async (payload) => {
  return await ContactCollection.create(payload);
};

export const deleteContact = async (contactId) => {
  return await ContactCollection.findOneAndDelete({ _id: contactId });
};

export const updateContact = async (contactId, payload, options = {}) => {
  const updatedContact = await ContactCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      runValidators: true,
      ...options,
    },
  );

  return updatedContact || null;
};