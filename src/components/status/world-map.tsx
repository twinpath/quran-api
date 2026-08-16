"use client";

import { useEffect, useState, useMemo } from "react";
import { geoPath, geoEquirectangular } from "d3-geo";
import { feature } from "topojson-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { TelemetryDistributionItem } from "@/types/telemetry";

interface WorldMapProps {
  countries: TelemetryDistributionItem[];
  isLoading?: boolean;
}

interface GeoFeature {
  type: string;
  id: string;
  properties: {
    name?: string;
  };
  geometry: any;
}

export function WorldMap({ countries, isLoading = false }: WorldMapProps) {
  const [topoData, setTopoData] = useState<any>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    fetch("/world.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load map");
        return res.json();
      })
      .then((data) => setTopoData(data))
      .catch(() => setHasError(true));
  }, []);

  const countryStatsMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of countries) {
      map.set(item.name.toUpperCase(), item.count);
    }
    return map;
  }, [countries]);

  const maxVisits = useMemo(() => {
    return Math.max(...countries.map((c) => c.count), 1);
  }, [countries]);

  const mapFeatures = useMemo(() => {
    if (!topoData || !topoData.objects) return [];
    try {
      const geojson: any = feature(topoData, topoData.objects.countries || topoData.objects.units);
      return (geojson.features || []) as GeoFeature[];
    } catch {
      return [];
    }
  }, [topoData]);

  const svgWidth = 960;
  const svgHeight = 480;

  const pathGenerator = useMemo(() => {
    const projection = geoEquirectangular()
      .scale(150)
      .translate([svgWidth / 2, svgHeight / 2]);
    return geoPath().projection(projection);
  }, []);

  const getCountryColor = (countryCode: string, count: number) => {
    if (count <= 0) return "var(--muted)";
    const ratio = count / maxVisits;
    if (ratio > 0.66) return "var(--primary)";
    if (ratio > 0.33) return "color-mix(in srgb, var(--primary) 70%, var(--muted))";
    return "color-mix(in srgb, var(--primary) 40%, var(--muted))";
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Geographic Requests</CardTitle>
        <span className="text-xs text-muted-foreground">
          {countries.length} {countries.length === 1 ? "Country" : "Countries"}
        </span>
      </CardHeader>

      <CardContent className="flex-1 min-h-[300px] relative p-4 flex items-center justify-center">
        {isLoading || !topoData ? (
          <div className="w-full h-full min-h-[280px] flex items-center justify-center">
            <Skeleton className="w-full h-full min-h-[280px] rounded-md" />
          </div>
        ) : hasError ? (
          <div className="text-sm text-destructive flex items-center justify-center h-full">
            Unable to load map data.
          </div>
        ) : (
          <div className="w-full h-full overflow-hidden flex items-center justify-center">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto max-h-[400px] select-none"
              aria-label="World distribution map"
            >
              <g>
                {mapFeatures.map((feat, idx) => {
                  const countryCode = String(feat.id || "").toUpperCase();
                  const name = feat.properties?.name || countryCode || "Unknown";
                  const count = countryStatsMap.get(countryCode) || 0;
                  const color = getCountryColor(countryCode, count);
                  const pathD = pathGenerator(feat as any);

                  if (!pathD) return null;

                  return (
                    <Tooltip key={`${countryCode}-${idx}`}>
                      <TooltipTrigger>
                        <path
                          d={pathD}
                          fill={color}
                          stroke="var(--background)"
                          strokeWidth="0.5"
                          className="transition-colors duration-200 hover:opacity-85 focus:outline-none cursor-pointer"
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs font-sans">
                        <p className="font-semibold">{name}</p>
                        <p className="text-muted-foreground">
                          Requests: {count.toLocaleString()}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </g>
            </svg>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
