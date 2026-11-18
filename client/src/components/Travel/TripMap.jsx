import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin, Navigation, Maximize2, Minimize2, Layers } from "lucide-react";

const OSM_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "&copy; OpenStreetMap Contributors",
    },
  },
  layers: [
    {
      id: "osm-layer",
      type: "raster",
      source: "osm",
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

export default function TripMap({ activities = [], destination = "Trip Destination", dayTitle = "" }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter activities that have valid coordinates
  const validActivities = activities.filter(
    (a) =>
      typeof a.latitude === "number" &&
      typeof a.longitude === "number" &&
      !isNaN(a.latitude) &&
      !isNaN(a.longitude)
  );

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Default center fallback (India)
    const initialCenter = validActivities.length > 0
      ? [validActivities[0].longitude, validActivities[0].latitude]
      : [77.2090, 28.6139];

    // Initialize MapLibre
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: OSM_STYLE,
      center: initialCenter,
      zoom: validActivities.length > 0 ? 12 : 5,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");

    map.on("load", () => {
      mapRef.current = map;
      renderMarkersAndRoute(map, validActivities);
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Re-render markers and route when activities change (e.g. day tab switched)
  useEffect(() => {
    if (mapRef.current && mapRef.current.isStyleLoaded()) {
      renderMarkersAndRoute(mapRef.current, validActivities);
    }
  }, [activities]);

  const renderMarkersAndRoute = (map, points) => {
    // 1. Remove previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (points.length === 0) return;

    // 2. Add custom HTML number markers
    const bounds = new maplibregl.LngLatBounds();
    const coordinates = [];

    points.forEach((activity, idx) => {
      const lngLat = [activity.longitude, activity.latitude];
      coordinates.push(lngLat);
      bounds.extend(lngLat);

      const el = document.createElement("div");
      el.className =
        "w-8 h-8 rounded-full bg-emerald-700 text-white font-extrabold flex items-center justify-center border-2 border-white shadow-lg text-xs cursor-pointer hover:scale-110 hover:bg-emerald-800 transition-transform";
      el.innerHTML = `<span>${idx + 1}</span>`;

      const popupHtml = `
        <div style="font-family: inherit; padding: 4px;">
          <strong style="color: #064e3b; font-size: 13px;">#${idx + 1} ${activity.title}</strong>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
            🕒 ${activity.time || "Scheduled"} • ⏱️ ${activity.duration || "2 hours"}
          </div>
          ${activity.locationName ? `<div style="font-size: 11px; color: #334155; margin-top: 4px;">📍 ${activity.locationName}</div>` : ""}
          ${activity.estimatedCost ? `<div style="font-size: 11px; font-weight: bold; color: #047857; margin-top: 4px;">Est. Cost: ₹${activity.estimatedCost}</div>` : ""}
        </div>
      `;

      const popup = new maplibregl.Popup({ offset: 25 }).setHTML(popupHtml);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(lngLat)
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });

    // 3. Add or update connecting route polyline
    const geojsonData = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates,
      },
    };

    if (map.getSource("route-source")) {
      map.getSource("route-source").setData(geojsonData);
    } else {
      map.addSource("route-source", {
        type: "geojson",
        data: geojsonData,
      });

      // Background route casing
      map.addLayer({
        id: "route-casing",
        type: "line",
        source: "route-source",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#ffffff",
          "line-width": 6,
        },
      });

      // Main route line
      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route-source",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#047857",
          "line-width": 3.5,
          "line-dasharray": [2, 1],
        },
      });
    }

    // 4. Fit bounds with smooth padding
    if (points.length === 1) {
      map.flyTo({ center: [points[0].longitude, points[0].latitude], zoom: 13 });
    } else if (points.length > 1) {
      map.fitBounds(bounds, { padding: 45, maxZoom: 14, duration: 800 });
    }
  };

  return (
    <div
      className={`bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm transition-all duration-300 ${
        isExpanded ? "fixed inset-4 z-50 shadow-2xl" : "relative w-full"
      }`}
    >
      {/* Map Header Bar */}
      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
            <Navigation className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800">
              Interactive Route Map
            </h4>
            <span className="text-[11px] text-slate-500">
              {validActivities.length} Waypoints plotted in chronological order
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsExpanded(!isExpanded);
            setTimeout(() => mapRef.current?.resize(), 150);
          }}
          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 shadow-xs transition-colors"
          title={isExpanded ? "Minimize map" : "Expand map full screen"}
        >
          {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Map Container */}
      <div
        ref={mapContainerRef}
        className={`w-full bg-slate-100 ${isExpanded ? "h-[calc(100%-53px)]" : "h-[320px] sm:h-[380px]"}`}
      />

      {/* Map Legend */}
      <div className="px-4 py-2 bg-white/95 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
          <span>Numbered pins = Daily stop order</span>
        </div>
        <span>OpenStreetMap vector layer</span>
      </div>
    </div>
  );
}
