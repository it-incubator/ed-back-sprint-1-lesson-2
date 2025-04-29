import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';
import { driversRepository } from '../../repositories/drivers.repository';
import { mapToDriverOutput } from '../mappers/map-driver-to-output';

export function getDriverHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  const driver = driversRepository.findById(id);

  if (!driver) {
    res
      .status(HttpStatus.NotFound)
      .send(
        createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
      );
    return;
  }
  res.send(mapToDriverOutput(driver));
}
