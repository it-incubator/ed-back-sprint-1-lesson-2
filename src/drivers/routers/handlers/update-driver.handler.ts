import { Request, Response } from 'express';
import { DriverUpdateInput } from '../../dto/driver.input';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';
import { driversRepository } from '../../repositories/drivers.repository';

export function updateDriverHandler(
  req: Request<{ id: string }, {}, DriverUpdateInput>,
  res: Response,
) {
  // В репозиторий передаём атрибуты (доменные поля), а не весь JSON:API-конверт.
  const isUpdated = driversRepository.update(
    +req.params.id,
    req.body.data.attributes,
  );

  if (!isUpdated) {
    res
      .status(HttpStatus.NotFound)
      .send(
        createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
      );
    return;
  }

  res.sendStatus(HttpStatus.NoContent);
}
