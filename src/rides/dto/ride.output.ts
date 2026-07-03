import {
  JsonApiListResponse,
  JsonApiSingleResponse,
} from '../../core/types/json-api';
import { ResourceType } from '../../core/types/resource-type';
import { Ride } from '../types/ride';

// Атрибуты поездки в ответе = доменные поля Ride без служебных id/createdAt/updatedAt.
export type RideResourceAttributes = Omit<
  Ride,
  'id' | 'createdAt' | 'updatedAt'
>;

// Ответ с одной поездкой: { data: { type, id, attributes } }.
export type RideOutput = JsonApiSingleResponse<
  ResourceType.Rides,
  RideResourceAttributes
>;

// Ответ со списком поездок: { meta, data: [...] }.
export type RideListOutput = JsonApiListResponse<
  ResourceType.Rides,
  RideResourceAttributes
>;
