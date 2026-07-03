import { Ride } from '../../types/ride';
import { RideListOutput } from '../../dto/ride.output';
import { mapRideToResource } from './map-ride-to-output';

// Ответ со списком поездок (JSON:API list). Каждый элемент маппится тем же
// mapRideToResource, что и одиночный ресурс — без дублирования логики.
export const mapToRideListOutput = (rides: Ride[]): RideListOutput => {
  return {
    meta: {},
    data: rides.map(mapRideToResource),
  };
};
