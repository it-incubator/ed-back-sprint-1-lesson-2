import { Request, Response } from 'express';
import { ridesRepository } from '../../repositories/rides.repository';
import { HttpStatus } from '../../../core/types/http-statuses';

export function getRideListHandler(req: Request, res: Response) {
  res.status(HttpStatus.Ok).send(ridesRepository.findAll());
}
