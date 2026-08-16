"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { geoPath, geoEquirectangular } from "d3-geo";
import { feature } from "topojson-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { TelemetryDistributionItem } from "@/types/telemetry";

interface WorldMapProps {
  countries: TelemetryDistributionItem[];
  isLoading?: boolean;
}

interface GeoFeature {
  type: string;
  id?: string | number;
  properties?: {
    name?: string;
  };
  geometry: unknown;
}

interface HoveredInfo {
  name: string;
  count: number;
  x: number;
  y: number;
}

export function WorldMap({ countries, isLoading = false }: WorldMapProps) {
  const [topoData, setTopoData] = useState<Record<string, unknown> | null>(null);
  const [hasError, setHasError] = useState(false);
  const [hoveredInfo, setHoveredInfo] = useState<HoveredInfo | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch("/world.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load map");
        return res.json();
      })
      .then((data) => setTopoData(data as Record<string, unknown>))
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
      const objects = topoData.objects as Record<string, unknown>;
      const targetObj = (objects.countries || objects.units) as Parameters<typeof feature>[1];
      const geojson = feature(topoData as Parameters<typeof feature>[0], targetObj) as unknown as {
        features?: GeoFeature[];
      };
      return geojson.features || [];
    } catch {
      return [];
    }
  }, [topoData]);


  const svgWidth = 960;
  const svgHeight = 480;

  const pathGenerator = useMemo(() => {
    const projection = geoEquirectangular()
      .scale(152)
      .translate([svgWidth / 2, svgHeight / 2]);
    return geoPath().projection(projection);
  }, []);

  const getCountryColor = (count: number) => {
    if (count <= 0) return "color-mix(in srgb, var(--muted) 70%, transparent)";
    const ratio = count / maxVisits;
    if (ratio > 0.66) return "var(--primary)";
    if (ratio > 0.33) return "color-mix(in srgb, var(--primary) 70%, var(--muted))";
    return "color-mix(in srgb, var(--primary) 45%, var(--muted))";
  };

  const handleMouseEnter = (e: React.MouseEvent<SVGPathElement>, name: string, count: number) => {
    const parent = containerRef.current?.getBoundingClientRect();
    if (parent) {
      setHoveredInfo({
        name,
        count,
        x: e.clientX - parent.left,
        y: e.clientY - parent.top,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGPathElement>, name: string, count: number) => {
    const parent = containerRef.current?.getBoundingClientRect();
    if (parent) {
      setHoveredInfo({
        name,
        count,
        x: e.clientX - parent.left,
        y: e.clientY - parent.top,
      });
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Geographic Requests</CardTitle>
        <span className="text-xs text-muted-foreground">
          {countries.length} {countries.length === 1 ? "Country" : "Countries"}
        </span>
      </CardHeader>

      <CardContent
        ref={containerRef}
        className="flex-1 min-h-[300px] relative p-4 flex items-center justify-center overflow-hidden"
      >
        {isLoading || !topoData ? (
          <div className="w-full h-full min-h-[280px] flex items-center justify-center">
            <Skeleton className="w-full h-full min-h-[280px] rounded-md" />
          </div>
        ) : hasError ? (
          <div className="text-sm text-destructive flex items-center justify-center h-full">
            Unable to load map data.
          </div>
        ) : (
          <div className="w-full h-full overflow-hidden flex items-center justify-center relative">
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
                  const color = getCountryColor(count);
                  const pathD = pathGenerator(feat);

                  if (!pathD) return null;

                  return (
                    <path
                      key={`${countryCode}-${idx}`}
                      d={pathD}
                      fill={color}
                      stroke="var(--border)"
                      strokeWidth="0.5"
                      className="transition-colors duration-150 hover:opacity-80 focus:outline-none cursor-pointer"
                      onMouseEnter={(e) => handleMouseEnter(e, name, count)}
                      onMouseMove={(e) => handleMouseMove(e, name, count)}
                      onMouseLeave={() => setHoveredInfo(null)}
                    />
                  );
                })}
              </g>
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredInfo && (
              <div
                className="absolute z-30 pointer-events-none px-3 py-1.5 rounded-md bg-popover text-popover-foreground border border-border/80 shadow-md text-xs font-sans -translate-x-1/2 -translate-y-full transition-all duration-75"
                style={{
                  left: `${hoveredInfo.x}px`,
                  top: `${hoveredInfo.y - 8}px`,
                }}
              >
                <p className="font-semibold text-foreground">{hoveredInfo.name}</p>
                <p className="text-muted-foreground">
                  Requests: {hoveredInfo.count.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


