import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard.middleware';
import { idValidation } from '../../core/middlewares/validation/params-id.validation.middleware';
import { rideCreateInputValidation } from '../validation/ride.input-dto.validation-middlewares';
import { createRideHandler } from './handlers/create-ride.handler';
import { getRideListHandler } from './handlers/get-ride-list.handler';
import { getRideHandler } from './handlers/get-ride.handler';
import { RIDES_ROUTES } from '../constants/rides.paths';

export const ridesRouter = Router({});

// Все эндпоинты поездок доступны только супер-админу (Basic Auth).
ridesRouter.use(superAdminGuardMiddleware);

// Каждая цепочка: валидация -> проверка её результата -> handler.
ridesRouter
  .get(RIDES_ROUTES.ROOT, getRideListHandler)

  .get(
    RIDES_ROUTES.BY_ID,
    idValidation,
    inputValidationResultMiddleware,
    getRideHandler,
  )

  .post(
    RIDES_ROUTES.ROOT,
    rideCreateInputValidation,
    inputValidationResultMiddleware,
    createRideHandler,
  );
