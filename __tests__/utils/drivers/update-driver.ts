import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { DriverInputDto } from '../../../src/drivers/dto/driver.input.dto';
import { DRIVERS_PATH } from '../../../src/drivers/constants/drivers.paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { getDriverDto } from './get-driver-dto';

export async function updateDriver(
  app: Express,
  driverId: number,
  driverDto?: DriverInputDto,
): Promise<void> {
  const testDriverData: DriverInputDto = { ...getDriverDto(), ...driverDto };

  await request(app)
    .put(`${DRIVERS_PATH}/${driverId}`)
    .set('Authorization', generateBasicAuthToken())
    .send(testDriverData)
    .expect(HttpStatus.NoContent);
}
