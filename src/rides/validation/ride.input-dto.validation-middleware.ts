import { body } from 'express-validator';
import { Currency } from '../types/ride';

export const clientNameValidation = body('clientName')
  .isString()
  .withMessage('status should be string')
  .trim()
  .isLength({ min: 3, max: 100 });

export const driverIdValidation = body('driverId')
  .isInt({ gt: 0 })
  .withMessage('ID must be a number');

export const priceValidation = body('price')
  .isFloat({ gt: 0 }) // Проверка, что цена - это число больше 0
  .withMessage('price must be a positive number');

export const currencyValidation = body('currency')
  .isString()
  .withMessage('currency should be string')
  .trim()
  .isIn(Object.values(Currency)) // Проверка на допустимые значения
  .withMessage('currency must be either "usd" or "eu"');

export const startAddressValidation = body('fromAddress')
  .isString()
  .withMessage('startAddress should be string')
  .trim()
  .isLength({ min: 10, max: 200 });

export const endAddressValidation = body('toAddress')
  .isString()
  .withMessage('endAddress should be string')
  .trim()
  .isLength({ min: 10, max: 200 });

export const rideInputDtoValidation = [
  clientNameValidation,
  driverIdValidation,
  priceValidation,
  currencyValidation,
  startAddressValidation,
  endAddressValidation,
];
