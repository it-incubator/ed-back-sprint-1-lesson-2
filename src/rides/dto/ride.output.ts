import { ResourceType } from '../../core/types/resource-type';
import { Currency } from '../types/ride';

export type RideOutput = {
  type: ResourceType.Rides;
  id: number;
  attributes: {
    clientName: string;
    driverId: number;
    driverName: string;
    vehicleLicensePlate: string;
    vehicleName: string;
    price: number;
    currency: Currency;
    startedAt: Date | null;
    addresses: {
      from: string;
      to: string;
    };
  };
};
