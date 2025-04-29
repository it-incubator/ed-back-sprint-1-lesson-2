import { Currency } from '../types/ride';

export type RideAttributes = {
  clientName: string;
  price: number;
  currency: Currency;
  driverId: number;
  fromAddress: string;
  toAddress: string;
};
