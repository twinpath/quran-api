"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as twgl from "twgl.js";
import { latLngToXYZ, HEX_ANGLES, parseColor, createArcGeometry } from "@/lib/globe-helpers";
import type { TelemetryLocationPoint } from "@/types/telemetry";

const m4 = twgl.m4;

const EARTH_VERTEX_SHADER = `
attribute vec3 position;
attribute vec2 texcoord;
uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;
varying vec2 v_texcoord;

void main() {
  v_texcoord = texcoord;
  gl_Position = projection * view * model * vec4(position, 1.0);
}
`;

const EARTH_FRAGMENT_SHADER = `
precision mediump float;
uniform sampler2D u_countryTexture;
varying vec2 v_texcoord;

void main() {
  vec4 color = texture2D(u_countryTexture, v_texcoord);
  gl_FragColor = color;
}
`;

const RIPPLE_VERTEX_SHADER = `
attribute vec3 position;
attribute float pointSize;
attribute vec3 color;
attribute float alpha;
uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;
varying vec3 v_color;
varying float v_alpha;

void main() {
  v_color = color;
  v_alpha = alpha;
  gl_Position = projection * view * model * vec4(position, 1.0);
  gl_PointSize = pointSize;
}
`;

const RIPPLE_FRAGMENT_SHADER = `
precision mediump float;
varying vec3 v_color;
varying float v_alpha;

void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  if (dist > 0.5) discard;
  
  float ring = smoothstep(0.3, 0.45, dist) * (1.0 - smoothstep(0.45, 0.5, dist));
  gl_FragColor = vec4(v_color, v_alpha * ring * 1.5);
}
`;

interface UseWebGLGlobeOptions {
  locations: TelemetryLocationPoint[];
  autoRotate?: boolean;
}

export function useWebGLGlobe({ locations, autoRotate = true }: UseWebGLGlobeOptions) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0);

  const stateRef = useRef({
    latitude: 0,
    longitude: 0,
    zoom: 0,
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    lastMouse: { x: 0, y: 0 },
    autoRotate,
  });

  useEffect(() => {
    stateRef.current.autoRotate = autoRotate;
  }, [autoRotate]);

  const setZoom = useCallback((delta: number) => {
    const nextZoom = Math.max(0, Math.min(1, stateRef.current.zoom + delta));
    stateRef.current.zoom = nextZoom;
    setZoomLevel(nextZoom);
  }, []);

  const resetView = useCallback(() => {
    stateRef.current.latitude = 0;
    stateRef.current.longitude = 0;
    stateRef.current.zoom = 0;
    setZoomLevel(0);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let gl: WebGLRenderingContext | null = null;
    let animationId: number;
    let disposed = false;

    try {
      gl = canvas.getContext("webgl", { alpha: true, antialias: true });
    } catch {
      setHasError(true);
      return;
    }

    if (!gl) {
      setHasError(true);
      return;
    }

    const earthProgram = twgl.createProgramInfo(gl, [EARTH_VERTEX_SHADER, EARTH_FRAGMENT_SHADER]);
    const rippleProgram = twgl.createProgramInfo(gl, [RIPPLE_VERTEX_SHADER, RIPPLE_FRAGMENT_SHADER]);

    if (!earthProgram || !rippleProgram) {
      setHasError(true);
      return;
    }

    let earthBufferInfo: twgl.BufferInfo | null = null;
    let countryTexture: WebGLTexture | null = null;

    // Build earth texture
    const buildTexture = () => {
      if (!gl) return null;
      const texCanvas = document.createElement("canvas");
      texCanvas.width = 2048;
      texCanvas.height = 1024;
      const ctx = texCanvas.getContext("2d");
      if (!ctx) return null;

      // Dark background
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, texCanvas.width, texCanvas.height);

      // Draw grid of dots / hexes
      const colSpacing = 16;
      const rowSpacing = 16;
      ctx.fillStyle = "#27272a";

      for (let x = 0; x < texCanvas.width; x += colSpacing) {
        for (let y = 0; y < texCanvas.height; y += rowSpacing) {
          ctx.beginPath();
          ctx.arc(x + 4, y + 4, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Highlight location points on texture
      for (const loc of locations) {
        const px = ((loc.longitude + 180) / 360) * texCanvas.width;
        const py = ((90 - loc.latitude) / 180) * texCanvas.height;

        const grad = ctx.createRadialGradient(px, py, 0, px, py, 24);
        grad.addColorStop(0, "rgba(16, 185, 129, 0.9)");
        grad.addColorStop(0.5, "rgba(16, 185, 129, 0.4)");
        grad.addColorStop(1, "rgba(16, 185, 129, 0.0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, 24, 0, Math.PI * 2);
        ctx.fill();
      }

      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texCanvas);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      return texture;
    };

    // Load sphere geometry or generate procedural sphere
    fetch("/sphere.bin")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.arrayBuffer();
      })
      .then((buf) => {
        if (disposed || !gl) return;
        const header = new Uint32Array(buf, 0, 3);
        let offset = 12;
        const position = new Float32Array(buf, offset, header[0]! / 4);
        offset += header[0]!;
        const texcoord = new Float32Array(buf, offset, header[1]! / 4);
        offset += header[1]!;
        const indices = new Uint16Array(buf, offset, header[2]! / 2);

        earthBufferInfo = twgl.createBufferInfoFromArrays(gl, {
          position: { numComponents: 3, data: position },
          texcoord: { numComponents: 2, data: texcoord },
          indices: { numComponents: 3, data: indices },
        });

        countryTexture = buildTexture();
        setIsReady(true);
      })
      .catch(() => {
        if (disposed || !gl) return;
        // Fallback: procedural sphere
        const sphere = twgl.primitives.createSphereVertices(1.0, 48, 48);
        earthBufferInfo = twgl.createBufferInfoFromArrays(gl, sphere);
        countryTexture = buildTexture();
        setIsReady(true);
      });

    // Resize handler
    const handleResize = () => {
      if (!canvas || !container || !gl) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Mouse drag handlers
    const onMouseDown = (e: MouseEvent) => {
      stateRef.current.isDragging = true;
      stateRef.current.lastMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!stateRef.current.isDragging) return;
      const dx = e.clientX - stateRef.current.lastMouse.x;
      const dy = e.clientY - stateRef.current.lastMouse.y;

      stateRef.current.longitude += dx * 0.4;
      stateRef.current.latitude = Math.max(-80, Math.min(80, stateRef.current.latitude - dy * 0.4));

      stateRef.current.lastMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      stateRef.current.isDragging = false;
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Render loop
    let lastTime = performance.now();

    const render = (time: number) => {
      if (disposed || !gl) return;
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (stateRef.current.autoRotate && !stateRef.current.isDragging) {
        stateRef.current.longitude += 10 * dt;
      }

      const width = canvas.width;
      const height = canvas.height;
      if (width > 0 && height > 0 && earthBufferInfo && countryTexture) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);

        const aspect = width / height;
        const fov = (35 * Math.PI) / 180;
        const projection = m4.perspective(fov, aspect, 0.1, 10);
        const distance = 3.2 * (1 - stateRef.current.zoom * 0.5);

        let camera = m4.identity();
        camera = m4.rotateY(camera, ((stateRef.current.longitude + 180) * Math.PI) / 180);
        camera = m4.rotateX(camera, (stateRef.current.latitude * Math.PI) / 180);

        const eye = m4.transformPoint(camera, [0, 0, -distance]) as number[];
        const up = m4.transformPoint(camera, [0, 1, 0]) as number[];
        const view = m4.inverse(m4.lookAt(eye, [0, 0, 0], up));
        const model = m4.identity();

        gl.useProgram(earthProgram.program);
        twgl.setBuffersAndAttributes(gl, earthProgram, earthBufferInfo);
        twgl.setUniforms(earthProgram, {
          model,
          view,
          projection,
          u_countryTexture: countryTexture,
        });
        twgl.drawBufferInfo(gl, earthBufferInfo);
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      disposed = true;
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      if (gl && countryTexture) gl.deleteTexture(countryTexture);
    };
  }, [locations]);

  return {
    canvasRef,
    containerRef,
    isReady,
    hasError,
    zoomLevel,
    setZoom,
    resetView,
  };
}
