// services/weatherService.ts
"use server";

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

export interface ILocation {
  id: number;
  name: string;
  locality: string;
  timezone: string;
  country: {
    id: number;
    code: string;
    name: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  datetimeFirst: string;
  datetimeLast: string;
}

export interface IMeasurement {
  parameter: {
    id: number;
    name: string;
    units: string;
    displayName: string;
  };
  value: number;
  date: {
    utc: string;
    local: string;
  };
}

export interface ICountryResponse {
  meta: IMeta;
  results: ICountry;
}

export interface ILocationsResponse {
  meta: IMeta;
  results: Array<ILocation>;
}

export interface IMeasurementsResponse {
  meta: IMeta;
  results: Array<IMeasurement>;
}

// Получить данные о конкретной стране
export async function getCountry(countryId: number = 1) {
  const res = await fetch(`${process.env.API_URL}/countries/${countryId}`, {
    headers: {
      "X-API-Key": process.env.NEXT_X_API_KEY as string,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Failed to fetch country", await res.statusText);
    throw new Error("Failed to fetch country data");
  }

  return res.json() as Promise<ICountryResponse>;
}

// Получить список всех стран
export async function getCountries(limit: number = 100) {
  const res = await fetch(`${process.env.API_URL}/countries?limit=${limit}`, {
    headers: {
      "X-API-Key": process.env.NEXT_X_API_KEY as string,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Failed to fetch countries", await res.statusText);
    throw new Error("Failed to fetch countries");
  }

  const data = await res.json();
  return data as { meta: IMeta; results: Array<ICountry> };
}

// Получить локации рядом с координатами
export async function getNearbyLocations(
  latitude: number = 51.5,
  longitude: number = -0.12,
  radius: number = 5000,
  limit: number = 20
) {
  const res = await fetch(
    `${process.env.API_URL}/locations?coordinates=${latitude},${longitude}&radius=${radius}&limit=${limit}`,
    {
      headers: {
        "X-API-Key": process.env.NEXT_X_API_KEY as string,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch locations", await res.statusText);
    throw new Error("Failed to fetch locations");
  }

  return res.json() as Promise<ILocationsResponse>;
}

// Получить измерения для конкретной локации
export async function getMeasurements(
  locationId: number,
  limit: number = 100,
  parameterId?: number
) {
  let url = `${process.env.API_URL}/locations/${locationId}/measurements?limit=${limit}`;
  
  if (parameterId) {
    url += `&parameter=${parameterId}`;
  }

  const res = await fetch(url, {
    headers: {
      "X-API-Key": process.env.NEXT_X_API_KEY as string,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Failed to fetch measurements", await res.statusText);
    throw new Error("Failed to fetch measurements");
  }

  return res.json() as Promise<IMeasurementsResponse>;
}

// Получить все параметры
export async function getParameters() {
  const res = await fetch(`${process.env.API_URL}/parameters?limit=100`, {
    headers: {
      "X-API-Key": process.env.NEXT_X_API_KEY as string,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Failed to fetch parameters", await res.statusText);
    throw new Error("Failed to fetch parameters");
  }

  const data = await res.json();
  return data as { meta: IMeta; results: Array<IParameter> };
}

// Backward compatibility
export default getCountry;