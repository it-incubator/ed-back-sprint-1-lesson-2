import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { ResourceType } from '../../../src/core/types/resource-type';
import { RideAttributes } from '../../../src/rides/dto/ride-attributes';
import { RideCreateInput } from '../../../src/rides/dto/ride.input';
import { RideOutput } from '../../../src/rides/dto/ride.output';
import { RIDES_PATH } from '../../../src/rides/constants/rides.paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { createDriver } from '../drivers/create-driver';
import { getRideDto } from './get-ride-dto';

export async function createRide(
  app: Express,
  rideAttributes?: Partial<RideAttributes>,
): Promise<RideOutput> {
  // Для поездки нужен существующий водитель. id ресурса — строка, driverId — число.
  const driver = await createDriver(app);
  const driverId = Number(driver.data.id);

  const testRideData: RideCreateInput = {
    data: {
      type: ResourceType.Rides,
      attributes: { ...getRideDto(driverId), ...rideAttributes },
    },
  };

  const createdRideResponse = await request(app)
    .post(RIDES_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testRideData)
    .expect(HttpStatus.Created);

  return createdRideResponse.body;
}
