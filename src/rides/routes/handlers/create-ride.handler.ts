import { Request, Response } from 'express';

import { driversRepository } from '../../../drivers/repositories/drivers.repository';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validtion-result.middleware';
import { ridesRepository } from '../../repositories/rides.repository';
import { Ride } from '../../types/ride';
import { db } from '../../../db/in-memory.db';
import { mapToRideOutput } from '../mappers/map-ride-to-output';
import { RideCreateInput } from '../../dto/ride.input';

export function createRideHandler(
  req: Request<{}, {}, RideCreateInput>,
  res: Response,
) {
  const driverId = req.body.data.attributes.driverId;

  const driver = driversRepository.findById(driverId);

  if (!driver) {
    res
      .status(HttpStatus.BadRequest)
      .send(
        createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
      );

    return;
  }
  const { attributes } = req.body.data;
  const newRide: Ride = {
    id: db.rides.length ? db.rides[db.rides.length - 1].id + 1 : 1,
    clientName: attributes.clientName,
    driverId: attributes.driverId,
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

  ridesRepository.createRide(newRide);

  res.status(HttpStatus.Created).send(mapToRideOutput(newRide));
}
