import { overridable } from '../overridable';
import { SearchAvailableSlotsResponse, SearchAvailableSlotsResult } from '@src/lib/api';

const defaultResponse = (): SearchAvailableSlotsResponse => {
  return {
    Success: true,
    Results: [{ Time: 528 }, { Time: 552 }],
    Page: 0,
    ResultsPerPage: 0,
    TotalResults: 18,
    ErrorMessage: null,
    ErrorNumber: 0,
    Messages: [],
  };
};

export const SearchAvailableSlotsResponseFixtures = {
  valid: overridable(() => defaultResponse()),
};
