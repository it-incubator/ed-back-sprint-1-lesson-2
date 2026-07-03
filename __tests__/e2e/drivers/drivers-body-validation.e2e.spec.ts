import request from 'supertest';
import express from 'express';
import { VehicleFeature } from '../../../src/drivers/types/driver';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { ResourceType } from '../../../src/core/types/resource-type';
import { DriverAttributes } from '../../../src/drivers/dto/driver-attributes';
import { DRIVERS_PATH } from '../../../src/drivers/constants/drivers.paths';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { clearDb } from '../../utils/clear-db';
import { getDriverDto } from '../../utils/drivers/get-driver-dto';
import { createDriver } from '../../utils/drivers/create-driver';
import { getDriverById } from '../../utils/drivers/get-driver-by-id';

describe('Driver API body validation check', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();
  const correctAttributes: DriverAttributes = {
    ...getDriverDto(),
    vehicleDescription: 'Some description',
    vehicleFeatures: [VehicleFeature.ChildSeat],
  };

  // JSON:API-конверты создания и обновления.
  const createBody = (attributes: object) => ({
    data: { type: ResourceType.Drivers, attributes },
  });
  const updateBody = (id: string, attributes: object) => ({
    data: { type: ResourceType.Drivers, id, attributes },
  });

  beforeAll(async () => {
    await clearDb(app);
  });

  it('❌ should return 401 without auth; POST /api/drivers', async () => {
    await request(app)
      .post(DRIVERS_PATH)
      .send(createBody(correctAttributes))
      .expect(HttpStatus.Unauthorized);
  });

  it(`❌ should not create driver when incorrect body passed; POST /api/drivers`, async () => {
    const invalidDataSet1 = await request(app)
      .post(DRIVERS_PATH)
      .set('Authorization', adminToken)
      .send(
        createBody({
          ...correctAttributes,
          name: '   ',
          phoneNumber: '    ',
          email: 'invalid email',
          vehicleMake: '',
        }),
      )
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorMessages).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .post(DRIVERS_PATH)
      .set('Authorization', adminToken)
      .send(
        createBody({
          ...correctAttributes,
          phoneNumber: '', // empty string
          vehicleModel: '', // empty string
          vehicleYear: 'year', // incorrect number
          vehicleLicensePlate: '', // empty string
        }),
      )
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorMessages).toHaveLength(4);

    const invalidDataSet3 = await request(app)
      .post(DRIVERS_PATH)
      .set('Authorization', adminToken)
      .send(createBody({ ...correctAttributes, name: 'A' })) // too short
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorMessages).toHaveLength(1);

    // check что никто не создался
    const driverListResponse = await request(app)
      .get(DRIVERS_PATH)
      .set('Authorization', adminToken);
    expect(driverListResponse.body.data).toHaveLength(0);
  });

  it('❌ should not update driver when incorrect data passed; PUT /api/drivers/:id', async () => {
    const createdDriver = await createDriver(app, correctAttributes);
    const createdId = createdDriver.data.id;

    const invalidDataSet1 = await request(app)
      .put(`${DRIVERS_PATH}/${createdId}`)
      .set('Authorization', adminToken)
      .send(
        updateBody(createdId, {
          ...correctAttributes,
          name: '   ',
          phoneNumber: '    ',
          email: 'invalid email',
          vehicleMake: '',
        }),
      )
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorMessages).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .put(`${DRIVERS_PATH}/${createdId}`)
      .set('Authorization', adminToken)
      .send(updateBody(createdId, { ...correctAttributes, name: 'A' }))
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorMessages).toHaveLength(1);

    // Данные водителя не должны измениться.
    const driverResponse = await getDriverById(app, createdId);
    expect(driverResponse).toEqual(createdDriver);
  });
});
