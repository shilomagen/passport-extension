interface CommonResponse {
  Success: boolean;
  Page: number;
  ResultsPerPage: number;
  TotalResults: number;
  ErrorMessage?: any;
  ErrorNumber: number;
  Messages?: any;
}

export interface CommonResultsResponse<T> extends CommonResponse {
  Results: T | null;
}

export interface CommonDataResponse<T> extends CommonResponse{
  Data: T
}


