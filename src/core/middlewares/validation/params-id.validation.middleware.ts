import { body, param } from 'express-validator';

// В in-memory-хранилище id — обычное число, поэтому проверяем, что параметр
// присутствует и является числовой строкой.
export const idValidation = param('id')
  .exists()
  .withMessage('ID is required')
  .isString()
  .withMessage('ID must be a string')
  .isNumeric()
  .withMessage('ID must be a numeric string');

// Для JSON:API-обновления: id в теле (data.id) должен совпадать с id в URL.
export const dataIdMatchValidation = body('data.id')
  .exists()
  .withMessage('ID in body is required')
  .custom((value, { req }) => {
    if (String(value) !== req.params?.id) {
      throw new Error('ID in URL and body must match');
    }
    return true;
  });
