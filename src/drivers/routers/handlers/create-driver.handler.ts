import {Request, Response} from 'express';
import {DriverInputDto} from '../../dto/driver.input-dto';
import {HttpStatus} from '../../../core/types/http-statuses';
import {db} from '../../../db/in-memory.db';
import {Driver} from '../../types/driver';
import {driversRepository} from "../../repositories/drivers.repository";

export function createDriverHandler(
  req: Request<{}, {}, DriverInputDto>,
  res: Response,
) {
  const newDriver: Driver = {
    id: db.drivers.length ? db.drivers[db.drivers.length - 1].id + 1 : 1,
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    vehicleMake: req.body.vehicleMake,
    vehicleModel: req.body.vehicleModel,
    vehicleYear: req.body.vehicleYear,
    vehicleLicensePlate: req.body.vehicleLicensePlate,
    vehicleDescription: req.body.vehicleDescription,
    vehicleFeatures: req.body.vehicleFeatures,
    createdAt: new Date(),
  };

  driversRepository.create(newDriver);
  res.status(HttpStatus.Created).send(newDriver);
}
