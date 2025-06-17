import express from 'express';
import multer from 'multer';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contact.js';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.use(authenticate);

router.get('/', ctrlWrapper(getContactsController));
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));

router.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));
router.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  (req, res, next) => {
    try {
      const { error } = updateContactSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          status: 400,
          message: 'BadRequestError',
          data: { message: error.details[0].message },
        });
      }
      next();
    } catch (err) {
      next(err);
    }
  },
  ctrlWrapper(patchContactController),
);

export default router;
