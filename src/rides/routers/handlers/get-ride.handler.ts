import { Request, Response } from 'express';
import { ridesRepository } from '../../repositories/rides.repository';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';
import { mapToRideOutput } from '../mappers/map-ride-to-output';

export function getRideHandler(req: Request<{ id: string }>, res: Response) {
  const ride = ridesRepository.findById(+req.params.id);

  if (!ride) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Ride not found' }]));
    return;
  }

  res.status(HttpStatus.Ok).send(mapToRideOutput(ride));
}
