import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { DriverOutput } from '../../../src/drivers/dto/driver.output';
import { DRIVERS_PATH } from '../../../src/drivers/constants/drivers.paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';

export async function getDriverById(
  app: Express,
  driverId: string,
): Promise<DriverOutput> {
  const driverResponse = await request(app)
    .get(`${DRIVERS_PATH}/${driverId}`)
    .set('Authorization', generateBasicAuthToken())
    .expect(HttpStatus.Ok);

  return driverResponse.body;
}
