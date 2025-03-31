import request from 'supertest';
import express from 'express';
import { VehicleFeature } from '../../../src/drivers/types/driver';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { DriverInputDto } from '../../../src/drivers/dto/driver.input-dto';
import { DRIVERS_PATH } from '../../../src/core/paths/paths';
import { getDriverDto } from '../../utils/drivers/get-driver-dto';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { createDriver } from '../../utils/drivers/create-driver';
import { clearDb } from '../../utils/clear-db';
import { getDriverById } from '../../utils/drivers/get-driver-by-id';
import { updateDriver } from '../../utils/drivers/update-driver';

describe('Driver API', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await clearDb(app);
  });

  it('✅ should create driver; POST /api/drivers', async () => {
    const newDriver: DriverInputDto = {
      ...getDriverDto(),
      name: 'Feodor',
      email: 'feodor@example.com',
    };

    await createDriver(app, newDriver);
  });

  it('✅ should return drivers list; GET /api/drivers', async () => {
    await createDriver(app);
    await createDriver(app);

    const response = await request(app)
      .get(DRIVERS_PATH)
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
  });

  it('✅ should return driver by id; GET /api/drivers/:id', async () => {
    const createdDriver = await createDriver(app);

    const driver = await getDriverById(app, createdDriver.id);

    expect(driver).toEqual({
      ...createdDriver,
      id: expect.any(Number),
      createdAt: expect.any(String),
    });
  });

  it('✅ should update driver; PUT /api/drivers/:id', async () => {
    const createdDriver = await createDriver(app);

    const driverUpdateData: DriverInputDto = {
      name: 'Updated Name',
      phoneNumber: '999-888-7777',
      email: 'updated@example.com',
      vehicleMake: 'Tesla',
      vehicleModel: 'Model S',
      vehicleYear: 2022,
      vehicleLicensePlate: 'NEW-789',
      vehicleDescription: 'Updated vehicle description',
      vehicleFeatures: [VehicleFeature.ChildSeat],
    };

    await updateDriver(app, createdDriver.id, driverUpdateData);

    const driverResponse = await getDriverById(app, createdDriver.id);

    expect(driverResponse).toEqual({
      ...driverUpdateData,
      id: createdDriver.id,
      createdAt: expect.any(String),
    });
  });

  it('✅ should delete driver and check after "NOT FOUND"; DELETE /api/drivers/:id', async () => {
    const createdDriver = await createDriver(app);

    await request(app)
      .delete(`${DRIVERS_PATH}/${createdDriver.id}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NoContent);

    await request(app)
      .get(`${DRIVERS_PATH}/${createdDriver.id}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NotFound);
  });
});
