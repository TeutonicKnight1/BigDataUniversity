// app/page.tsx
import {
  getCountry,
  getCountries,
  getNearbyLocations,
  getParameters,
} from "@/services/weatherService";
import Image from "next/image";
import CountryDashboard from "@/components/CountryDashboard";
import LocationsMap from "@/components/LocationsMap";
import ParametersOverview from "@/components/ParametersOverview";

export default async function Home() {
  // Параллельный запрос всех данных
  const [countryData, allCountries, nearbyLocations, allParameters] =
    await Promise.all([
      getCountry(1),
      getCountries(50),
      getNearbyLocations(51.5, -0.12, 10000, 20),
      getParameters(),
    ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              🌍 Global Air Quality Monitor
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Real-time environmental data from {allCountries.meta.found}{" "}
              countries
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 dark:bg-green-900">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Live Data
              </span>
            </div>
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={120}
              height={24}
              priority
            />
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white shadow-lg">
            <p className="text-sm opacity-90">Countries</p>
            <p className="mt-1 text-3xl font-bold">
              {allCountries.meta.found}
            </p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-4 text-white shadow-lg">
            <p className="text-sm opacity-90">Parameters</p>
            <p className="mt-1 text-3xl font-bold">
              {allParameters.meta.found}
            </p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 p-4 text-white shadow-lg">
            <p className="text-sm opacity-90">Nearby Stations</p>
            <p className="mt-1 text-3xl font-bold">
              {nearbyLocations.meta.found}
            </p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-4 text-white shadow-lg">
            <p className="text-sm opacity-90">Monitoring</p>
            <p className="mt-1 text-2xl font-bold">24/7</p>
          </div>
        </div>

        {/* Main Dashboard */}
        <CountryDashboard
          currentCountry={countryData}
          allCountries={allCountries.results}
        />

        {/* Locations Map Section */}
        <div className="mt-8">
          <LocationsMap locations={nearbyLocations.results} />
        </div>

        {/* Parameters Overview */}
        <div className="mt-8">
          <ParametersOverview parameters={allParameters.results} />
        </div>

        {/* Footer Info */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
            📊 Data Source Information
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                API Provider
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {allCountries.meta.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Website
              </p>
              <a
                href={allCountries.meta.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                {allCountries.meta.website}
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}