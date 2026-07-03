export enum Currency {
  USD = 'usd',
  EUR = 'eur',
}

// Данные храним в массиве в памяти, поэтому id — обычное число.
// Данные водителя и машины копируются в поездку в момент создания.
export type Ride = {
  id: number;
  clientName: string;
  driverId: number;
  driverName: string;
  vehicleLicensePlate: string;
  vehicleName: string;
  price: number;
  currency: Currency;
  createdAt: Date;
  updatedAt: Date | null;
  addresses: {
    from: string;
    to: string;
  };
};
