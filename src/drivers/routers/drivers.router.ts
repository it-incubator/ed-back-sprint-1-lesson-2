import { Router } from 'express';
import { getDriverListHandler } from './handlers/get-driver-list.handler';
import { getDriverHandler } from './handlers/get-driver.handler';
import { createDriverHandler } from './handlers/create-driver.handler';
import { updateDriverHandler } from './handlers/update-driver.handler';
import { deleteDriverHandler } from './handlers/delete-driver.handler';
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { driverInputDtoValidation } from '../validation/driver.input-dto.validation-middlewares';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';

export const driversRouter = Router({});

// driversRouter.use(superAdminGuardMiddleware);

driversRouter
  .get('', getDriverListHandler)

  .get('/:id', idValidation, inputValidationResultMiddleware, getDriverHandler)

  .post(
    '',
    superAdminGuardMiddleware,
    driverInputDtoValidation,
    inputValidationResultMiddleware,
    createDriverHandler,
  )

  .put(
    '/:id',
    idValidation,
    superAdminGuardMiddleware,
    driverInputDtoValidation,
    inputValidationResultMiddleware,
    updateDriverHandler,
  )

  .delete(
    '/:id',
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deleteDriverHandler,
  );
