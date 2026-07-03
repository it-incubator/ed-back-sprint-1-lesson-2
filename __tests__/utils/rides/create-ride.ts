import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { RideInputDto } from '../../../src/rides/dto/ride.input.dto';
import { Ride } from '../../../src/rides/types/ride';
import { RIDES_PATH } from '../../../src/rides/constants/rides.paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { createDriver } from '../drivers/create-driver';
import { getRideDto } from './get-ride-dto';

export async function createRide(
  app: Express,
  rideDto?: RideInputDto,
): Promise<Ride> {
  // Для поездки нужен существующий водитель — создаём его через хелпер.
  const driver = await createDriver(app);

  const testRideData: RideInputDto = { ...getRideDto(driver.id), ...rideDto };

  const createdRideResponse = await request(app)
    .post(RIDES_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testRideData)
    .expect(HttpStatus.Created);

  return createdRideResponse.body;
}
