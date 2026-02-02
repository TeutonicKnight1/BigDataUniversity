"use client";

import { IParameter } from "@/services/weatherService";
import { useState, useMemo } from "react";

interface Props {
  parameters: IParameter[];
}

export default function ParametersOverview({ parameters }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<string>("all");

  const uniqueUnits = useMemo(() => {
    const units = new Set(parameters.map((p) => p.units));
    return Array.from(units).sort();
  }, [parameters]);

  const filteredParameters = useMemo(() => {
    return parameters.filter((param) => {
      const matchesSearch =
        param.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        param.displayName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesUnit =
        selectedUnit === "all" || param.units === selectedUnit;
      return matchesSearch && matchesUnit;
    });
  }, [parameters, searchTerm, selectedUnit]);

  const parametersByUnit = useMemo(() => {
    const grouped: Record<string, IParameter[]> = {};
    filteredParameters.forEach((param) => {
      if (!grouped[param.units]) {
        grouped[param.units] = [];
      }
      grouped[param.units].push(param);
    });
    return grouped;
  }, [filteredParameters]);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          🔬 Environmental Parameters
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Complete catalog of {parameters.length} monitored parameters
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search parameters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pl-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <svg
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="md:w-64">
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Units ({parameters.length})</option>
            {uniqueUnits.map((unit) => {
              const count = parameters.filter((p) => p.units === unit).length;
              return (
                <option key={unit} value={unit}>
                  {unit} ({count})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredParameters.length} of {parameters.length} parameters
        </p>
        {(searchTerm || selectedUnit !== "all") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedUnit("all");
            }}
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            Clear filters
          </button>
        )}
      </div>

      {Object.keys(parametersByUnit).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(parametersByUnit).map(([unit, params]) => (
            <div key={unit}>
              <div className="mb-3 flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Unit: {unit}
                </h3>
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  {params.length}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {params.map((param) => (
                  <div
                    key={param.id}
                    className="group rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all hover:border-blue-300 hover:bg-white hover:shadow-md dark:border-gray-700 dark:bg-gray-700/50 dark:hover:bg-gray-700"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {param.displayName || param.name}
                        </h4>
                        {param.displayName && param.displayName !== param.name && (
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            ({param.name})
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        #{param.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-gray-400 dark:text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {param.units}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <svg
            className="mb-4 h-16 w-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-600 dark:text-gray-400">
            No parameters found matching your filters
          </p>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-200 pt-6 dark:border-gray-700 md:grid-cols-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {parameters.length}
          </p>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            Total Parameters
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {uniqueUnits.length}
          </p>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            Unique Units
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {
              parameters.filter((p) => p.displayName && p.displayName !== p.name)
                .length
            }
          </p>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            With Display Names
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {filteredParameters.length}
          </p>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            Filtered Results
          </p>
        </div>
      </div>
    </div>
  );
}