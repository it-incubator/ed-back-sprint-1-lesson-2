import { RideCreateInput } from '../../../src/rides/dto/ride.input';
import { Currency } from '../../../src/rides/types/ride';
import { ResourceType } from '../../../src/core/types/resource-type';

export function getRideDto(driverId: number): RideCreateInput {
  return {
    data: {
      type: ResourceType.Rides,
      attributes: {
        driverId,
        clientName: 'Bob',
        price: 200,
        currency: Currency.USD,
        fromAddress: '123 Main St, Springfield, IL',
        toAddress: '456 Elm St, Shelbyville, IL',
      },
    },
  };
}
