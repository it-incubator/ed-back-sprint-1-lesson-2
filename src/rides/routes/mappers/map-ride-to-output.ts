import { ResourceType } from '../../../core/types/resource-type';
import { RideOutput } from '../../dto/ride.output';
import { Ride } from '../../types/ride';

export const mapToRideOutput = (ride: Ride): RideOutput => {
  return {
    type: ResourceType.Rides,
    id: ride.id,
    attributes: {
      clientName: ride.clientName,
      driverId: ride.driverId,
      driverName: ride.driverName,
      vehicleLicensePlate: ride.vehicleLicensePlate,
      vehicleName: ride.vehicleName,
      price: ride.price,
      currency: ride.currency,
      startedAt: ride.createdAt,
      addresses: {
        from: ride.addresses.from,
        to: ride.addresses.to,
      },
    },
  };
};
