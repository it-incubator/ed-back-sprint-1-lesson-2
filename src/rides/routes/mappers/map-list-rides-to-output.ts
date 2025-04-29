import { ResourceType } from '../../../core/types/resource-type';
import { Ride } from '../../types/ride';
import { RideListOutput } from '../../dto/ride-list-paginated.output';

export const mapToRideListOutput = (rides: Ride[]): RideListOutput => {
  return {
    meta: {},
    data: rides.map((ride) => ({
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
    })),
  };
};
