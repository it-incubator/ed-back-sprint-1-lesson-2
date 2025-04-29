import { Request, Response } from 'express';
import { ridesRepository } from '../../repositories/rides.repository';
import { mapToRideListOutput } from '../mappers/map-list-rides-to-output';

export function getRideListHandler(req: Request, res: Response) {
  const rides = ridesRepository.findAll();
  res.send(mapToRideListOutput(rides));
}
