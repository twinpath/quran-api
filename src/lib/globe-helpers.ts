/**
 * Math and geometry helpers for WebGL 3D Globe rendering.
 * Pure functions - no React or DOM rendering logic.
 */

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

/** Pre-calculated angles for flat-top hexagon rendering */
export const HEX_ANGLES = Array.from({ length: 6 }, (_, i) => {
  const angle = (Math.PI / 3) * i;
  return [Math.cos(angle), Math.sin(angle)] as const;
});

/**
 * Convert latitude/longitude (degrees) and radius to 3D Cartesian XYZ coordinates.
 */
export function latLngToXYZ(lat: number, lng: number, radius = 1.0): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return [x, y, z];
}

/**
 * Parse hex or RGB color string to [R, G, B] normalized array (0.0 to 1.0).
 */
export function parseColor(colorStr: string): [number, number, number] {
  if (colorStr.startsWith("#")) {
    const hex = colorStr.replace("#", "");
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16) / 255;
      const g = parseInt(hex[1] + hex[1], 16) / 255;
      const b = parseInt(hex[2] + hex[2], 16) / 255;
      return [r, g, b];
    }
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;
      return [r, g, b];
    }
  }
  if (colorStr.startsWith("rgb")) {
    const matches = colorStr.match(/\d+/g);
    if (matches && matches.length >= 3) {
      return [
        parseInt(matches[0], 10) / 255,
        parseInt(matches[1], 10) / 255,
        parseInt(matches[2], 10) / 255,
      ];
    }
  }
  return [0.1, 0.8, 0.5]; // Default emerald theme color
}

/**
 * Generate 3D arc curve positions between two latitude/longitude points.
 */
export function createArcGeometry(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  steps = 50,
  maxAlt = 0.35,
) {
  const p1 = latLngToXYZ(startLat, startLng, 1.002);
  const p2 = latLngToXYZ(endLat, endLng, 1.002);

  const positions: number[] = [];
  const alphas: number[] = [];
  const dashParams: number[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;

    // Linear interpolation between p1 and p2
    const x = p1[0] + (p2[0] - p1[0]) * t;
    const y = p1[1] + (p2[1] - p1[1]) * t;
    const z = p1[2] + (p2[2] - p1[2]) * t;

    // Normalize and add altitude curve (parabola max at t=0.5)
    const len = Math.sqrt(x * x + y * y + z * z);
    const altitude = 1.0 + Math.sin(t * Math.PI) * maxAlt;
    const factor = altitude / (len || 1);

    positions.push(x * factor, y * factor, z * factor);

    // Alpha curve (fade in at ends)
    const alpha = Math.sin(t * Math.PI);
    alphas.push(alpha);
    dashParams.push(t);
  }

  return {
    positions: new Float32Array(positions),
    alphas: new Float32Array(alphas),
    dashParams: new Float32Array(dashParams),
  };
}
