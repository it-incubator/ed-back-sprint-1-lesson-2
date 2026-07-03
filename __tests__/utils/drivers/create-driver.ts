import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { DriverInputDto } from '../../../src/drivers/dto/driver.input.dto';
import { Driver } from '../../../src/drivers/types/driver';
import { DRIVERS_PATH } from '../../../src/drivers/constants/drivers.paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { getDriverDto } from './get-driver-dto';

export async function createDriver(
  app: Express,
  driverDto?: DriverInputDto,
): Promise<Driver> {
  const testDriverData: DriverInputDto = { ...getDriverDto(), ...driverDto };

  const createdDriverResponse = await request(app)
    .post(DRIVERS_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testDriverData)
    .expect(HttpStatus.Created);

  return createdDriverResponse.body;
}
