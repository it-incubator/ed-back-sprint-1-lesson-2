import { Request, Response } from 'express';
import { DriverCreateInput } from '../../dto/driver.input';
import { HttpStatus } from '../../../core/types/http-statuses';
import { Driver } from '../../types/driver';
import { driversRepository } from '../../repositories/drivers.repository';
import { mapToDriverOutput } from '../mappers/map-driver-to-output';

export function createDriverHandler(
  req: Request<{}, {}, DriverCreateInput>,
  res: Response,
) {
  // Тело уже проверено middleware-валидаторами. Данные лежат в data.attributes.
  const attributes = req.body.data.attributes;

  const newDriver: Omit<Driver, 'id'> = {
    ...attributes,
    createdAt: new Date(),
  };

  const createdDriver = driversRepository.create(newDriver);
  res.status(HttpStatus.Created).send(mapToDriverOutput(createdDriver));
}
