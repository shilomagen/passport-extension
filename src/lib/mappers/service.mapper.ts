import { Service } from '../internal-types';
import { LocationServicesResult } from '../api';

export function toService(result: LocationServicesResult): Service {
  return {
    id: result.serviceId,
    description: result.description,
    name: result.serviceName,
    locationId: result.LocationId,
  };
}
