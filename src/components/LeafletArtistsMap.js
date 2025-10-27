// components/LeafletArtistsMap.jsx
import React, { useMemo, useEffect } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

// ---- Fix default marker icons in many bundlers ----
import "leaflet/dist/leaflet.css";
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl
});

// Optional: slightly different icons per category (simple color dots)
// You can keep default icons if you prefer.
const makeIcon = (color = "#2E7D32") =>
  L.divIcon({
    className: "custom-pin",
    html: `<span style="
      display:inline-block;width:12px;height:12px;border-radius:50%;
      background:${color};border:2px solid white;box-shadow:0 0 2px rgba(0,0,0,.6);
    "></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

const categoryColor = (cat = "") => {
  const c = cat.toLowerCase();
  if (c.includes("photographer")) return "#1565C0";
  if (c.includes("digital")) return "#6A1B9A";
  if (c.includes("animator")) return "#EF6C00";
  if (c.includes("designer")) return "#00897B";
  if (c.includes("musician")) return "#C62828";
  if (c.includes("fine")) return "#2E7D32";
  return "#455A64";
};

// Auto-fit map to markers
function FitToMarkers({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points || points.length === 0) {
      // Default view: South Africa
      map.setView([-30.5595, 22.9375], 5);
      return;
    }
    const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [points, map]);
  return null;
}

export default function LeafletArtistsMap({
  artists = [],
  onArtistClick,
}) {
  // Keep only artists that have valid lat/lng
  const points = useMemo(
    () => artists.filter(a => Number.isFinite(a.lat) && Number.isFinite(a.lng)),
    [artists]
  );

  return (
    <MapContainer className="leaflet-map" center={[-30.5595, 22.9375]} zoom={5} scrollWheelZoom>
      <TileLayer
        // Free OSM tiles (fine for personal/light traffic; keep attribution)
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <FitToMarkers points={points} />

      {points.map(artist => (
        <Marker
          key={artist.id}
          position={[artist.lat, artist.lng]}
          // comment out icon to use default pin:
          icon={makeIcon(categoryColor(artist.category))}
          eventHandlers={{
            click: () => onArtistClick?.(artist),
          }}
        >
          <Popup>
            <div style={{ minWidth: 180 }}>
              <strong>{artist.name}</strong><br />
              <span>{artist.category}</span><br />
              <span>📍 {artist.city}, {artist.province}</span><br />
              {artist.pricing && (
                <small>From R{artist.pricing.hourly?.toLocaleString?.() ?? artist.pricing.hourly}</small>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
