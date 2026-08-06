import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import SearchBar from "./SearchBar";
import AddPharmacyButton from "./AddPharmacyButton";
import AddPharmacyMapClick from "./AddPharmacyMapClick";

import api from "../services/api";
import L from "leaflet";

// Green icon for imported OSM pharmacies
const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Red icon for user-added pharmacies
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Red/pulse icon for user's location
const userIcon = new L.DivIcon({
  className: "",
  html: `
    <div style="
      position: relative;
      width: 20px;
      height: 20px;
    ">
      <div style="
        position: absolute;
        inset: -8px;
        border-radius: 50%;
        background: rgba(59,130,246,0.25);
        animation: userPulse 1.8s ease-out infinite;
      "></div>
      <div style="
        position: absolute;
        inset: -4px;
        border-radius: 50%;
        background: rgba(59,130,246,0.4);
        animation: userPulse 1.8s ease-out infinite 0.4s;
      "></div>
      <div style="
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: linear-gradient(135deg, #3b82f6, #06b6d4);
        border: 3px solid white;
        box-shadow: 0 3px 12px rgba(59,130,246,0.6);
      "></div>
    </div>
    <style>
      @keyframes userPulse {
        0%   { transform: scale(1); opacity: 0.7; }
        100% { transform: scale(2.5); opacity: 0; }
      }
    </style>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Component to zoom to user location
function FlyToLocation({ userLocation }) {
  const map = useMap();
  const didFly = useRef(false);

  useEffect(() => {
    if (!userLocation) {
      didFly.current = false;
      return;
    }
    if (!didFly.current) {
      didFly.current = true;
      setTimeout(() => {
        map.setView([userLocation.lat, userLocation.lon], 15, { animate: true });
      }, 300);
    }
  }, [userLocation, map]);

  return null;
}

// Component to track map bounds
function MapBoundsTracker({ setBounds }) {
  const map = useMapEvents({
    moveend: () => {
      const b = map.getBounds();
      setBounds({
        north: b.getNorth(),
        south: b.getSouth(),
        east: b.getEast(),
        west: b.getWest(),
      });
    },
    zoomend: () => {
      const b = map.getBounds();
      setBounds({
        north: b.getNorth(),
        south: b.getSouth(),
        east: b.getEast(),
        west: b.getWest(),
      });
    },
  });

  // Initial bounds on mount
  useEffect(() => {
    const b = map.getBounds();
    setBounds({
      north: b.getNorth(),
      south: b.getSouth(),
      east: b.getEast(),
      west: b.getWest(),
    });
  }, [map, setBounds]);

  return null;
}

// Custom Marker Cluster Icon (Pop-out Design)
const createCustomClusterIcon = (cluster) => {
  const count = cluster.getChildCount();
  
  let sizeClass = "w-10 h-10 text-sm";
  let bgClass = "bg-linear-to-br from-green-600 to-green-700 shadow-green-500/50";
  let pointerClass = "bg-green-700";

  if (count >= 100) {
    sizeClass = "w-12 h-12 text-base";
    bgClass = "bg-linear-to-br from-teal-600 to-teal-700 shadow-teal-500/50";
    pointerClass = "bg-teal-700";
  }
  if (count >= 500) {
    sizeClass = "w-14 h-14 text-lg";
    bgClass = "bg-linear-to-br from-emerald-600 to-emerald-700 shadow-emerald-500/50";
    pointerClass = "bg-emerald-700";
  }

  return new L.DivIcon({
    html: `
      <div class="flex flex-col items-center group cursor-pointer">
        <div class="relative flex items-center justify-center text-white font-extrabold rounded-full ${sizeClass} ${bgClass} border-[3px] border-white shadow-2xl transition-transform duration-300 group-hover:scale-110 z-10">
          ${count}
        </div>
        <div class="w-3.5 h-3.5 ${pointerClass} rotate-45 -mt-2 border-b-[3px] border-r-[3px] border-white shadow-lg transition-transform duration-300 group-hover:translate-y-1"></div>
      </div>
    `,
    className: "custom-cluster-marker bg-transparent border-none",
    iconSize: L.point(40, 50, true),
    iconAnchor: [20, 50],
  });
};

function Map({
  searchTerm,
  setSearchTerm,
  setSelectedPharmacy,
  isAdding,
  setIsAdding,
  setShowForm,
  setNewLocation,
  refreshKey,
  userLocation,
  locationStatus,
  onToggleLocation,
  isDarkMode,
}) {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bounds, setBounds] = useState(null);

  // Fetch pharmacies based on bounds and search term
  useEffect(() => {
    if (!bounds && !searchTerm) return;

    const controller = new AbortController();

    async function loadPharmacies() {
      setLoading(true);
      try {
        const params = {};
        
        if (bounds) {
          params.north = bounds.north;
          params.south = bounds.south;
          params.east = bounds.east;
          params.west = bounds.west;
        }

        if (searchTerm) {
          params.search = searchTerm;
        }

        const res = await api.get("/pharmacies", {
          params,
          signal: controller.signal,
        });
        
        setPharmacies(res.data);
      } catch (err) {
        if (err.name !== "AbortError" && err.code !== "ERR_CANCELED") {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    }

    // Debounce to prevent spamming the backend during map dragging or typing
    const timeoutId = setTimeout(loadPharmacies, 300);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [bounds, searchTerm, refreshKey]);

  const initialCenter = userLocation
    ? [userLocation.lat, userLocation.lon]
    : [26.8206, 30.8025];
  const initialZoom = userLocation ? 14 : 6;

  const tileUrl = isDarkMode
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const tileAttribution = isDarkMode
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : "© OpenStreetMap";

  return (
    <>
      <AddPharmacyButton isAdding={isAdding} setIsAdding={setIsAdding} />

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Live location toggle button */}
      <button
        id="btn-toggle-location"
        onClick={onToggleLocation}
        title={locationStatus === "granted" ? "إيقاف تتبع موقعي" : "تفعيل موقعي"}
        className="absolute bottom-6 right-4 z-1000 flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-sm shadow-xl transition-all duration-300 active:scale-95"
        style={locationStatus === "granted" ? {
          background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
          color: "white",
          boxShadow: "0 8px 25px rgba(59,130,246,0.45)",
        } : {
          background: "rgba(15,23,42,0.82)",
          color: "#94a3b8",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(8px)",
        }}
      >
        {locationStatus === "granted" ? (
          <>
            <span style={{
              display: "inline-block",
              width: 10, height: 10,
              borderRadius: "50%",
              background: "white",
              boxShadow: "0 0 0 3px rgba(255,255,255,0.35)",
              animation: "userPulse 1.8s ease-out infinite",
            }} />
            موقعي شغّال
          </>
        ) : (
          <>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            تفعيل موقعي
          </>
        )}
      </button>

      {/* Loading indicator */}
      {loading && (
        <div className="absolute top-4 right-4 z-1000 flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg">
          <div className="w-3 h-3 rounded-full border-2 border-blue-400/40 border-t-blue-400 animate-spin" />
          جاري التحميل...
        </div>
      )}

      {/* "No pharmacies found" notice */}
      {!loading && pharmacies.length === 0 && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-1000 bg-slate-900/90 backdrop-blur-sm text-white text-sm font-medium px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 whitespace-nowrap">
          📍 لا توجد صيدليات هنا
        </div>
      )}

      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution={tileAttribution}
          url={tileUrl}
        />

        <MapBoundsTracker setBounds={setBounds} />

        {/* Fly to user location smoothly */}
        {userLocation && <FlyToLocation userLocation={userLocation} />}

        <AddPharmacyMapClick
          isAdding={isAdding}
          setNewLocation={setNewLocation}
          setShowForm={setShowForm}
        />

        {/* User location marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lon]}
            icon={userIcon}
          />
        )}

        <MarkerClusterGroup 
          chunkedLoading={true} 
          maxClusterRadius={50}
          showCoverageOnHover={false}
          iconCreateFunction={createCustomClusterIcon}
        >
          {pharmacies.map((pharmacy) => (
            <Marker
              key={pharmacy.id}
              position={[pharmacy.latitude, pharmacy.longitude]}
              icon={pharmacy.source === "osm" ? greenIcon : redIcon}
              eventHandlers={{
                click: () => setSelectedPharmacy(pharmacy),
              }}
            />
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </>
  );
}

export default Map;