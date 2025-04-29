// @ts-ignore
import request from 'supertest';
// @ts-ignore
import express from 'express';
import { VehicleFeature } from '../../../src/drivers/types/driver';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { DRIVERS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { clearDb } from '../../utils/clear-db';
import { createDriver } from '../../utils/drivers/create-driver';
import { getDriverById } from '../../utils/drivers/get-driver-by-id';
import { DriverInput } from '../../../src/drivers/dto/driver.input';
import { ResourceType } from '../../../src/core/types/resource-type';

describe('Driver API body validation check', () => {
  const app = express();
  setupApp(app);

  const correctTestDriverData: DriverInput = {
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
        vehicleDescription: 'Some description',
        vehicleFeatures: [VehicleFeature.ChildSeat],
      },
    },
  };

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await clearDb(app);
  });

  it(`❌ should not create driver when incorrect body passed; POST /api/drivers'`, async () => {
    await request(app)
      .post(DRIVERS_PATH)
      .send(correctTestDriverData)
      .expect(HttpStatus.Unauthorized);

    const invalidDataSet1 = await request(app)
      .post(DRIVERS_PATH)
      .set('Authorization', generateBasicAuthToken())
      .send({
        data: {
          ...correctTestDriverData.data,
          attributes: {
            ...correctTestDriverData.data.attributes,
            name: '   ',
            phoneNumber: '    ',
            email: 'invalid email',
            vehicleMake: '',
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorMessages).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .post(DRIVERS_PATH)
      .set('Authorization', generateBasicAuthToken())
      .send({
        data: {
          ...correctTestDriverData.data,
          attributes: {
            ...correctTestDriverData.data.attributes,
            phoneNumber: '', // empty string
            vehicleModel: '', // empty string
            vehicleYear: 'year', // incorrect number
            vehicleLicensePlate: '', // empty string
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorMessages).toHaveLength(4);

    const invalidDataSet3 = await request(app)
      .post(DRIVERS_PATH)
      .set('Authorization', generateBasicAuthToken())
      .send({
        data: {
          ...correctTestDriverData.data,
          attributes: {
            ...correctTestDriverData.data.attributes,
            name: 'F', // to short
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorMessages).toHaveLength(1);

    // check что никто не создался
    const driverListResponse = await request(app)
      .get(DRIVERS_PATH)
      .set('Authorization', adminToken);
    console.log('driverListResponse.body:', driverListResponse.body.data);
    expect(driverListResponse.body.data).toHaveLength(0);
  });

  it('❌ should not update driver when incorrect data passed; PUT /api/drivers/:id', async () => {
    const createdDriver = await createDriver(app);
    console.log('-createdDriver:', createdDriver);
    const invalidDataSet1 = await request(app)
      .put(`${DRIVERS_PATH}/${createdDriver.id}`)
      .set('Authorization', generateBasicAuthToken())
      .send({
        data: {
          type: ResourceType.Drivers,
          attributes: {
            ...correctTestDriverData.data.attributes,
            name: '   ',
            phoneNumber: '    ',
            email: 'invalid email',
            vehicleMake: '',
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorMessages).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .put(`${DRIVERS_PATH}/${createdDriver.id}`)
      .set('Authorization', generateBasicAuthToken())
      .send({
        data: {
          type: ResourceType.Drivers,
          attributes: {
            ...correctTestDriverData.data.attributes,
            phoneNumber: '', // empty string
            vehicleModel: '', // empty string
            vehicleYear: 'year', // incorrect number
            vehicleLicensePlate: '', // empty string
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorMessages).toHaveLength(4);

    const invalidDataSet3 = await request(app)
      .put(`${DRIVERS_PATH}/${createdDriver.id}`)
      .set('Authorization', generateBasicAuthToken())
      .send({
        data: {
          type: ResourceType.Drivers,
          attributes: {
            ...correctTestDriverData.data.attributes,
            name: 'F', // to short
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorMessages).toHaveLength(1);

    const driverResponse = await getDriverById(app, createdDriver.id);
    expect(driverResponse).toEqual(createdDriver);
  });

  it('❌ should not update driver when incorrect features passed; PUT /api/drivers/:id', async () => {
    const createdDriver = await createDriver(
      app,
      correctTestDriverData.data.attributes,
    );

    await request(app)
      .put(`${DRIVERS_PATH}/${createdDriver.id}`)
      .set('Authorization', generateBasicAuthToken())
      .send({
        data: {
          ...correctTestDriverData.data,
          attributes: {
            ...correctTestDriverData.data.attributes,
            vehicleFeatures: [
              VehicleFeature.ChildSeat,
              'invalid-feature' as VehicleFeature,
              VehicleFeature.WiFi,
            ],
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    const driverResponse = await getDriverById(app, createdDriver.id);

    expect(driverResponse).toEqual(createdDriver);
  });
});
