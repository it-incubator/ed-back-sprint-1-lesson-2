import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { db } from '../../../db/in-memory.db';
import { Driver } from '../../types/driver';
import { driversRepository } from '../../repositories/drivers.repository';
import { DriverInput } from '../../dto/driver.input';
import { mapToDriverOutput } from '../mappers/map-driver-to-output';

export function createDriverHandler(
  req: Request<{}, {}, DriverInput>,
  res: Response,
) {
  const attributes = req.body.data.attributes;
  const newDriver: Driver = {
    id: db.drivers.length ? db.drivers[db.drivers.length - 1].id + 1 : 1,
    name: attributes.name,
    phoneNumber: attributes.phoneNumber,
    email: attributes.email,
    vehicleMake: attributes.vehicleMake,
    vehicleModel: attributes.vehicleModel,
    vehicleYear: attributes.vehicleYear,
    vehicleLicensePlate: attributes.vehicleLicensePlate,
    vehicleDescription: attributes.vehicleDescription,
    vehicleFeatures: attributes.vehicleFeatures,
    createdAt: new Date(),
  };
  driversRepository.create(newDriver);
  res.status(HttpStatus.Created).send(mapToDriverOutput(newDriver));
}
