import { Request, Response } from 'express';
import { driversRepository } from '../../repositories/drivers.repository';
import { mapToDriverListOutput } from '../mappers/map-list-drivers-to-output';

export function getDriverListHandler(req: Request, res: Response) {
  const drivers = driversRepository.findAll();
  const mappedDrivers = mapToDriverListOutput(drivers);
  res.send(mappedDrivers);
}
