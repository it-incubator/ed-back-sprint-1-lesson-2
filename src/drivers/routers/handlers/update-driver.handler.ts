import { Request, Response } from 'express';
import { DriverInputDto } from '../../dto/driver.input.dto';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';
import { validateDriverInputDto } from '../../validation/driver-input-dto.validation';
import { driversRepository } from '../../repositories/drivers.repository';

export function updateDriverHandler(
  req: Request<{ id: string }, {}, DriverInputDto>,
  res: Response,
) {
  const errors = validateDriverInputDto(req.body);

  if (errors.length > 0) {
    res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
    return;
  }

  // Репозиторий вернёт false, если водитель с таким id не найден.
  const isUpdated = driversRepository.update(+req.params.id, req.body);

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
