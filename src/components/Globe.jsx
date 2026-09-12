import React, { useState, useEffect, useRef } from "react";
import { geoOrthographic, geoPath } from "d3-geo";

// Direct CDN fetch for high-detail Natural Earth GeoJSON landmass data
const GEOJSON_URL = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson";

export default function RealisticGlobe() {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [geoData, setGeoData] = useState(null);

  // Fetch real coastlines & landmasses
  useEffect(() => {
    fetch(GEOJSON_URL)
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Error loading GeoJSON:", err));
  }, []);

  // Smooth continuous rotation loop
  useEffect(() => {
    let frameId;
    const animate = () => {
      if (!isDragging) {
        setRotation((r) => (r + 0.3) % 360);
      }
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isDragging]);

  // Configure D3 Orthographic 3D Globe Projection
  const width = 400;
  const height = 400;
  const radius = 160;

  const projection = geoOrthographic()
    .scale(radius)
    .translate([width / 2, height / 2])
    .rotate([-rotation, -10, 0]) // Sync x-rotation with mouse drag state
    .clipAngle(90); // Clip points hidden behind the globe horizon

  const pathGenerator = geoPath().projection(projection);

  // Drag controls
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX;
    setRotation((r) => (r + deltaX * 0.4) % 360);
    setDragStartX(e.clientX);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-950 rounded-3xl shadow-2xl border border-slate-800 text-white max-w-2xl mx-auto my-6">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-emerald-400">Realistic 3D GeoJSON Globe</h2>
        <p className="text-xs text-slate-400 mt-1">Interactive rotation using orthographic projection & vector coastlines</p>
      </div>

      <div
        className="relative cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
      >
        <svg width={width} height={height}>
          <defs>
            {/* Ocean Sphere 3D Gradient */}
            <radialGradient id="oceanGrad" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="60%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>

            {/* Atmosphere Rim Glow Effect */}
            <radialGradient id="atmosphereGlow" cx="50%" cy="50%" r="50%">
              <stop offset="70%" stopColor="rgba(56, 189, 248, 0)" />
              <stop offset="95%" stopColor="rgba(56, 189, 248, 0.25)" />
              <stop offset="100%" stopColor="rgba(56, 189, 248, 0.6)" />
            </radialGradient>
          </defs>

          {/* Ocean Sphere */}
          <circle cx={width / 2} cy={height / 2} r={radius} fill="url(#oceanGrad)" stroke="#1E293B" strokeWidth="1" />

          {/* Real Vector Landmasses */}
          {geoData && (
            <path
              d={pathGenerator(geoData)}
              fill="#10B981"
              stroke="#047857"
              strokeWidth="0.5"
              opacity="0.9"
            />
          )}

          {/* Graticules (Latitude & Longitude Gridlines) */}
          <path
            d={pathGenerator({ type: "Sphere" })}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="0.5"
            opacity="0.1"
          />

          {/* Atmospheric Rim Overlay */}
          <circle cx={width / 2} cy={height / 2} r={radius} fill="url(#atmosphereGlow)" pointerEvents="none" />
        </svg>
      </div>
    </div>
  );
}