import { model, Schema } from 'mongoose';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      default: 'personal',
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    photo: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

export const ContactCollection = model('Contact', contactSchema);
