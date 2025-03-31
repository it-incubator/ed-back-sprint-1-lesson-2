import express, { Express } from 'express';
import { driversRouter } from './drivers/routers/drivers.router';
import { testingRouter } from './testing/routers/testing.router';
import { DRIVERS_PATH, RIDES_PATH, TESTING_PATH } from './core/paths/paths';
import { ridesRoute } from './rides/routes/rides.route';

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get('/', (req, res) => {
    res.status(200).send('hello world!!!');
  });

  app.use(DRIVERS_PATH, driversRouter);
  app.use(TESTING_PATH, testingRouter);
  app.use(RIDES_PATH, ridesRoute);

  return app;
};
