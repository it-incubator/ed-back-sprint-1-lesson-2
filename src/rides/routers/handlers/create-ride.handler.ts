import { Request, Response } from 'express';
import { RideInputDto } from '../../dto/ride.input.dto';
import { driversRepository } from '../../../drivers/repositories/drivers.repository';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';
import { ridesRepository } from '../../repositories/rides.repository';
import { Ride } from '../../types/ride';

export function createRideHandler(
  req: Request<{}, {}, RideInputDto>,
  res: Response,
) {
  // Поездку можно создать только для существующего водителя.
  const driver = driversRepository.findById(req.body.driverId);

  if (!driver) {
    res
      .status(HttpStatus.BadRequest)
      .send(
        createErrorMessages([
          { field: 'driverId', message: 'Driver not found' },
        ]),
      );
    return;
  }

  // Данные водителя и его машины копируем в поездку в момент создания.
  const newRide: Omit<Ride, 'id'> = {
    clientName: req.body.clientName,
    driverId: driver.id,
    driverName: driver.name,
    vehicleLicensePlate: driver.vehicleLicensePlate,
    vehicleName: `${driver.vehicleMake} ${driver.vehicleModel}`,
    price: req.body.price,
    currency: req.body.currency,
    createdAt: new Date(),
    updatedAt: null,
    addresses: {
      from: req.body.fromAddress,
      to: req.body.toAddress,
    },
  };

  const createdRide = ridesRepository.create(newRide);
  res.status(HttpStatus.Created).send(createdRide);
}
