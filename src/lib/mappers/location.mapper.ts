import { LocationSearchResult } from '../api';
import { Location } from '../internal-types';

export function toLocation(result: LocationSearchResult): Location {
  return {
    id: result.LocationId,
    city: result.City,
    address: `${result.Address1} ${result.Address2}`,
    description: result.Description,
    name: result.LocationName
  }

}
