export interface IMeta {
  name: string;
  website: string;
  page: number;
  limit: number;
  found: number;
}

export interface IParameter {
  id: number;
  name: string;
  units: string;
  displayName: string | null;
}

export interface ICountry {
  id: number;
  code: string;
  name: string;
  datetimeFirst: string | null;
  datetimeLast: string | null;
  parameters: Array<IParameter> | null;
}

export interface ICountryResponse {
  meta: IMeta;
  results: Array<ICountry>;
}
