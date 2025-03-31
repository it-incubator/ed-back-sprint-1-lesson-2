import express, { Express } from 'express';
import { driversRouter } from './drivers/routers/drivers.router';
import { testingRouter } from './testing/routers/testing.router';
import { DRIVERS_PATH, TESTING_PATH } from './core/paths/paths';

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get('/', (req, res) => {
    res.status(200).send('hello world!!!');
  });

  app.use(DRIVERS_PATH, driversRouter);
  app.use(TESTING_PATH, testingRouter);

  return app;
};
