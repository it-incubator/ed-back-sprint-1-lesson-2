import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { rideCreateInputValidation } from '../validation/ride.input-dto.validation-middleware';
import { createRideHandler } from './handlers/create-ride.handler';
import { getRideListHandler } from './handlers/get-ride-list.handler';
import { getRideHandler } from './handlers/get-ride.handler';

export const ridesRoute = Router({});

ridesRoute.use(superAdminGuardMiddleware);

ridesRoute.get('', getRideListHandler);

ridesRoute.get(
  '/:id',
  idValidation,
  inputValidationResultMiddleware,
  getRideHandler,
);

ridesRoute.post(
  '',
  rideCreateInputValidation,
  inputValidationResultMiddleware,
  createRideHandler,
);
