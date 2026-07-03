import { Currency } from '../types/ride';

// Данные, которые клиент присылает при создании поездки.
export type RideInputDto = {
  clientName: string;
  price: number;
  currency: Currency;
  driverId: number;
  fromAddress: string;
  toAddress: string;
};
