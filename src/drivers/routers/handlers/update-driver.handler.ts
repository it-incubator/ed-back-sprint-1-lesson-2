import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';
import { driversRepository } from '../../repositories/drivers.repository';
import { DriverUpdateInput } from '../../dto/driver-update.input';

export function updateDriverHandler(
  req: Request<{ id: string }, {}, DriverUpdateInput>,
  res: Response,
) {
  const id = parseInt(req.params.id);
  const driver = driversRepository.findById(id);

  if (!driver) {
    res
      .status(HttpStatus.NotFound)
      .send(
        createErrorMessages([{ field: 'id', message: 'Vehicle not found' }]),
      );
    return;
  }

  driversRepository.update(id, req.body.data.attributes);
  res.sendStatus(HttpStatus.NoContent);
}
