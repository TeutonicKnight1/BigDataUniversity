// components/CountryDashboard.tsx
"use client";

import { ICountry, ICountryResponse } from "@/services/weatherService";
import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";

interface Props {
  currentCountry: ICountryResponse;
  allCountries: ICountry[];
}

const COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#ef4444",
  "#f97316",
];

export default function CountryDashboard({
  currentCountry,
  allCountries,
}: Props) {
  const [selectedCountry, setSelectedCountry] = useState<ICountry>(
    currentCountry.results
  );

  const parameterData = useMemo(() => {
    return (
      selectedCountry?.parameters?.map((param, idx) => ({
        name: param.displayName || param.name,
        id: param.id,
        unit: param.units,
        fill: COLORS[idx % COLORS.length],
        value: param.id,
      })) || []
    );
  }, [selectedCountry]);

  const countryStats = useMemo(() => {
    return allCountries
      .filter((c) => c.parameters && c.parameters.length > 0)
      .sort((a, b) => (b.parameters?.length || 0) - (a.parameters?.length || 0))
      .slice(0, 10)
      .map((country) => ({
        name: country.code,
        fullName: country.name,
        parameters: country.parameters?.length || 0,
      }));
  }, [allCountries]);

  const radarData = useMemo(() => {
    return parameterData.slice(0, 6).map((param) => ({
      parameter: param.name.slice(0, 10),
      value: Math.min(param.id, 100), 
      fullName: param.name,
    }));
  }, [parameterData]);

  const activeCountries = useMemo(() => {
    return allCountries.filter(
      (c) => c.datetimeFirst && c.datetimeLast
    ).length;
  }, [allCountries]);

  const totalUniqueParams = useMemo(() => {
    const paramSet = new Set<number>();
    allCountries.forEach((country) => {
      country.parameters?.forEach((param) => paramSet.add(param.id));
    });
    return paramSet.size;
  }, [allCountries]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Countries
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {allCountries.length}
              </p>
              <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                {activeCountries} active
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <svg
                className="h-8 w-8 text-blue-600 dark:text-blue-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Unique Parameters
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {totalUniqueParams}
              </p>
              <p className="mt-1 text-xs text-purple-600 dark:text-purple-400">
                across all countries
              </p>
            </div>
            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
              <svg
                className="h-8 w-8 text-purple-600 dark:text-purple-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Selected Country
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {selectedCountry.code}
              </p>
              <p className="mt-1 text-xs text-pink-600 dark:text-pink-400">
                {selectedCountry.parameters?.length || 0} params
              </p>
            </div>
            <div className="rounded-full bg-pink-100 p-3 dark:bg-pink-900">
              <svg
                className="h-8 w-8 text-pink-600 dark:text-pink-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Data Status
              </p>
              <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                Live
              </p>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                Updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
              <svg
                className="h-8 w-8 text-green-600 dark:text-green-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Select Country
          </h2>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {allCountries.length} available
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-6 lg:grid-cols-8">
          {allCountries.slice(0, 32).map((country) => (
            <button
              key={country.id}
              onClick={() => setSelectedCountry(country)}
              className={`group relative rounded-lg p-3 text-sm font-medium transition-all ${
                selectedCountry?.id === country.id
                  ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg ring-2 ring-blue-400"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
              title={country.name}
            >
              <div className="text-center">
                <div className="text-lg">{country.code}</div>
                {country.parameters && country.parameters.length > 0 && (
                  <div className="mt-1 text-xs opacity-75">
                    {country.parameters.length}
                  </div>
                )}
              </div>
              <div className="pointer-events-none absolute -top-10 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white group-hover:block dark:bg-gray-700">
                {country.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            🏆 Top Countries by Parameters
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={countryStats} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={50} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    return (
                      <div className="rounded-lg bg-white p-3 shadow-lg dark:bg-gray-800">
                        <p className="font-bold text-gray-900 dark:text-white">
                          {payload[0].payload.fullName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Parameters: {payload[0].value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="parameters" fill="#3b82f6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            📊 {selectedCountry.name} - Parameters
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={parameterData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name.slice(0, 15)}...`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {parameterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    return (
                      <div className="rounded-lg bg-white p-3 shadow-lg dark:bg-gray-800">
                        <p className="font-bold text-gray-900 dark:text-white">
                          {payload[0].name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Unit: {payload[0].payload.unit}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            🎯 Parameter Radar View
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="parameter" />
              <PolarRadiusAxis />
              <Radar
                name="Parameters"
                dataKey="value"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.6}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    return (
                      <div className="rounded-lg bg-white p-3 shadow-lg dark:bg-gray-800">
                        <p className="font-bold text-gray-900 dark:text-white">
                          {payload[0].payload.fullName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Value: {payload[0].value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            📅 Data Timeline
          </h2>
          <div className="flex h-[350px] flex-col justify-center space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <svg
                  className="h-8 w-8 text-green-600 dark:text-green-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  First Data Recorded
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedCountry.datetimeFirst
                    ? new Date(
                        selectedCountry.datetimeFirst
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Not available"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <svg
                  className="h-8 w-8 text-blue-600 dark:text-blue-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Last Updated
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedCountry.datetimeLast
                    ? new Date(selectedCountry.datetimeLast).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "Not available"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                <svg
                  className="h-8 w-8 text-purple-600 dark:text-purple-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Parameters
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedCountry.parameters?.length || 0} active
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedCountry.parameters && selectedCountry.parameters.length > 0 && (
        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            📋 {selectedCountry.name} - Monitored Parameters
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Parameter Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Display Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Units
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    ID
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedCountry.parameters.map((param, idx) => (
                  <tr
                    key={param.id}
                    className="border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      {param.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {param.displayName || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        {param.units}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      #{param.id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}