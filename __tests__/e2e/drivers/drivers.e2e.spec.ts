// @ts-ignore
import request from 'supertest';
// @ts-ignore
import express from 'express';
import { VehicleFeature } from '../../../src/drivers/types/driver';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { DRIVERS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { createDriver } from '../../utils/drivers/create-driver';
import { getDriverById } from '../../utils/drivers/get-driver-by-id';
import { updateDriver } from '../../utils/drivers/update-driver';
import { ResourceType } from '../../../src/core/types/resource-type';
import { DriverInput } from '../../../src/drivers/dto/driver.input';
import { DriverAttributes } from '../../../src/drivers/dto/driver-attributes';

describe('Driver API', () => {
  const app = express();
  setupApp(app);

  const testDriverData: DriverInput = {
    data: {
      type: ResourceType.Drivers,
      attributes: {
        name: 'Valentin',
        phoneNumber: '123-456-7890',
        email: 'valentin@example.com',
        vehicleMake: 'BMW',
        vehicleModel: 'X5',
        vehicleYear: 2021,
        vehicleLicensePlate: 'ABC-123',
        vehicleDescription: null,
        vehicleFeatures: [],
      },
    },
  };
  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await request(app)
      .delete('/api/testing/all-data')
      .expect(HttpStatus.NoContent);
  });

  it('✅ should create driver; POST /api/drivers', async () => {
    await createDriver(app, {
      ...testDriverData.data.attributes,
      name: 'Fedor',
    });
  });

  it('✅ should return drivers list; GET /api/drivers', async () => {
    await createDriver(app);
    await createDriver(app);

    const driverListResponse = await request(app)
      .get(DRIVERS_PATH)
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok);
    expect(driverListResponse.body.data).toBeInstanceOf(Array);
    expect(driverListResponse.body.data.length).toBeGreaterThanOrEqual(2);
  });

  it('✅ should return driver by id; GET /api/drivers/:id', async () => {
    const createResponse = await createDriver(app);

    const driver = await getDriverById(app, createResponse.id);

    expect(driver).toEqual(createResponse);
  });

  it('✅ should update driver; PUT /api/drivers/:id', async () => {
    const createResponse = await createDriver(app);

    const driverUpdateData: DriverAttributes = {
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

    await updateDriver(app, createResponse.id, driverUpdateData);

    const driverResponse = await getDriverById(app, createResponse.id);
    expect(driverResponse).toEqual({
      ...createResponse,
      attributes: { ...createResponse.attributes, ...driverUpdateData },
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
