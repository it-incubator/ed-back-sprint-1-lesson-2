import { Request, Response } from 'express';
import { RideCreateInput } from '../../dto/ride.input';
import { driversRepository } from '../../../drivers/repositories/drivers.repository';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';
import { ridesRepository } from '../../repositories/rides.repository';
import { Ride } from '../../types/ride';
import { mapToRideOutput } from '../mappers/map-ride-to-output';

export function createRideHandler(
  req: Request<{}, {}, RideCreateInput>,
  res: Response,
) {
  const attributes = req.body.data.attributes;

  // Поездку можно создать только для существующего водителя.
  const driver = driversRepository.findById(attributes.driverId);

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
    clientName: attributes.clientName,
    driverId: driver.id,
    driverName: driver.name,
    vehicleLicensePlate: driver.vehicleLicensePlate,
    vehicleName: `${driver.vehicleMake} ${driver.vehicleModel}`,
    price: attributes.price,
    currency: attributes.currency,
    createdAt: new Date(),
    updatedAt: null,
    addresses: {
      from: attributes.fromAddress,
      to: attributes.toAddress,
    },
  };

  const createdRide = ridesRepository.create(newRide);
  res.status(HttpStatus.Created).send(mapToRideOutput(createdRide));
}
