"use client";

import { RotateCcw, ZoomIn, ZoomOut, Globe as GlobeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWebGLGlobe } from "@/hooks/useWebGLGlobe";
import type { TelemetryLocationPoint } from "@/types/telemetry";

interface GlobeProps {
  locations: TelemetryLocationPoint[];
  autoRotate?: boolean;
}

export function Globe({ locations, autoRotate = true }: GlobeProps) {
  const { canvasRef, containerRef, isReady, hasError, zoomLevel, setZoom, resetView } =
    useWebGLGlobe({ locations, autoRotate });

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[340px] flex items-center justify-center overflow-hidden bg-muted/20 rounded-lg border border-border/50"
    >
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 size-full cursor-grab active:cursor-grabbing transition-opacity duration-500 ${
          isReady ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Loading Skeleton */}
      {!isReady && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="relative aspect-square w-3/4 max-w-[280px]">
            <Skeleton className="size-full rounded-full" />
          </div>
        </div>
      )}

      {/* Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-muted-foreground gap-2">
          <GlobeIcon className="size-8 text-muted-foreground/60" />
          <p className="text-sm">3D WebGL Globe is unavailable on this device.</p>
        </div>
      )}

      {/* Floating Control Buttons */}
      {isReady && !hasError && (
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 bg-background/80 backdrop-blur-md p-1 rounded-md border border-border/60 shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            title="Zoom Out"
            disabled={zoomLevel <= 0}
            onClick={() => setZoom(-0.15)}
          >
            <ZoomOut className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            title="Reset View"
            onClick={resetView}
          >
            <RotateCcw className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            title="Zoom In"
            disabled={zoomLevel >= 1}
            onClick={() => setZoom(0.15)}
          >
            <ZoomIn className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
