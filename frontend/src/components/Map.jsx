import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import SearchBar from "./SearchBar";
import AddPharmacyButton from "./AddPharmacyButton";
import AddPharmacyMapClick from "./AddPharmacyMapClick";

import { getEgyptPharmacies, getNearbyPharmacies } from "../services/overpass";
import api from "../services/api";
import L from "leaflet";

// Default blue marker icon
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Green icon for DB pharmacies
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

// Component to zoom to user location — uses setView (instant) instead of flyTo
// because flyTo animations can be interrupted on slow mobile devices.
function FlyToLocation({ userLocation }) {
  const map = useMap();
  const didFly = useRef(false);

  useEffect(() => {
    if (userLocation && !didFly.current) {
      didFly.current = true;
      // Small delay ensures the map tile layer is ready before zooming
      setTimeout(() => {
        map.setView([userLocation.lat, userLocation.lon], 15, { animate: true });
      }, 300);
    }
  }, [userLocation, map]);

  return null;
}

// Component to auto-zoom map based on search results
function FitBoundsOnSearch({ searchTerm, osmPharmacies, dbPharmacies }) {
  const map = useMap();

  useEffect(() => {
    // We only want to zoom if the user actually typed something
    if (!searchTerm || searchTerm.trim().length === 0) return;

    // Debounce the fitBounds so it doesn't jump crazily on every keystroke
    const timeout = setTimeout(() => {
      const allLatsLons = [];

      osmPharmacies.forEach((p) => {
        const lat = p.lat ?? p.center?.lat;
        const lon = p.lon ?? p.center?.lon;
        if (lat && lon) allLatsLons.push([lat, lon]);
      });

      dbPharmacies.forEach((p) => {
        if (p.latitude && p.longitude) {
          allLatsLons.push([p.latitude, p.longitude]);
        }
      });

      if (allLatsLons.length > 0) {
        const bounds = L.latLngBounds(allLatsLons);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16, animate: true, duration: 1 });
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm, osmPharmacies, dbPharmacies, map]);

  return null;
}

// Custom Marker Cluster Icon (Pop-out Design)
const createCustomClusterIcon = (cluster) => {
  const count = cluster.getChildCount();
  
  // Dynamic size based on count
  let sizeClass = "w-10 h-10 text-sm";
  let bgClass = "bg-linear-to-br from-blue-600 to-blue-700 shadow-blue-500/50";
  let pointerClass = "bg-blue-700";

  if (count >= 100) {
    sizeClass = "w-12 h-12 text-base";
    bgClass = "bg-linear-to-br from-indigo-600 to-indigo-700 shadow-indigo-500/50";
    pointerClass = "bg-indigo-700";
  }
  if (count >= 500) {
    sizeClass = "w-14 h-14 text-lg";
    bgClass = "bg-linear-to-br from-purple-600 to-purple-700 shadow-purple-500/50";
    pointerClass = "bg-purple-700";
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
  userLocation, // { lat, lon } or null
  locationStatus,
  isDarkMode,
}) {
  const [osmPharmacies, setOsmPharmacies] = useState([]);
  const [myPharmacies, setMyPharmacies] = useState([]);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [loadingDB, setLoadingDB] = useState(false);
  const [osmError, setOsmError] = useState(false); // true when all Overpass endpoints fail
  const [retryKey, setRetryKey] = useState(0);    // increment to retry

  // Load OSM pharmacies based on location status
  useEffect(() => {
    if (locationStatus === "pending") return;
    // If location was granted but coords aren't ready yet, wait for next render
    if (locationStatus === "granted" && !userLocation) return;

    let cancelled = false;

    async function loadOSM() {
      setOsmError(false);
      setLoadingNearby(true);
      try {
        let osm = [];
        if (locationStatus === "granted" && userLocation) {
          // 5km radius — large enough to find pharmacies even in less-dense areas
          osm = await getNearbyPharmacies(
            userLocation.lat,
            userLocation.lon,
            5000
          );
        } else {
          // If skipped, load all Egypt pharmacies
          osm = await getEgyptPharmacies();
        }
        // Only update state if this effect run is still current
        if (!cancelled) {
          setOsmPharmacies(osm);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setOsmError(true);
        }
      } finally {
        if (!cancelled) {
          setLoadingNearby(false);
        }
      }
    }

    loadOSM();
    return () => { cancelled = true; };
  // retryKey added so user can manually retry after an error
  }, [locationStatus, userLocation, retryKey]);


  // Reload DB pharmacies whenever refreshKey changes
  useEffect(() => {
    const controller = new AbortController();

    async function loadMyPharmacies() {
      setLoadingDB(true);
      try {
        const res = await api.get("/pharmacies", {
          signal: controller.signal,
        });
        setMyPharmacies(res.data);
      } catch (err) {
        if (err.name !== "AbortError" && err.code !== "ERR_CANCELED") {
          console.error(err);
        }
      } finally {
        setLoadingDB(false);
      }
    }

    loadMyPharmacies();
    return () => controller.abort();
  }, [refreshKey]);

  const filteredOSM = osmPharmacies.filter((pharmacy) =>
    (pharmacy.tags?.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const filteredDB = myPharmacies.filter((pharmacy) =>
    (pharmacy.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

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

      {/* Loading overlay — OSM pharmacies */}
      {loadingNearby && (
        <div
          className="absolute inset-0 z-1000 flex flex-col items-center justify-center gap-4"
          style={{ background: "rgba(15,23,42,0.65)", backdropFilter: "blur(4px)" }}
        >
          <div className="w-14 h-14 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin" />
          <p className="text-white font-semibold text-lg">
            جاري البحث عن صيدليات قريبة منك...
          </p>
        </div>
      )}

      {/* Error overlay — all Overpass endpoints failed */}
      {osmError && !loadingNearby && (
        <div
          className="absolute inset-0 z-1000 flex flex-col items-center justify-center gap-5 px-6"
          style={{ background: "rgba(15,23,42,0.75)", backdropFilter: "blur(4px)" }}
        >
          <div className="text-5xl">⚠️</div>
          <p className="text-white font-bold text-lg text-center">
            مش قادر يحمل بيانات الصيدليات
          </p>
          <p className="text-slate-300 text-sm text-center">
            فيه مشكلة في الاتصال بخرائط OpenStreetMap. اتأكد من النت وحاول تاني.
          </p>
          <button
            onClick={() => setRetryKey((k) => k + 1)}
            className="mt-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-95"
          >
            🔄 إعادة المحاولة
          </button>
        </div>
      )}

      {/* "No pharmacies found" notice — fetch succeeded but 0 results */}
      {!loadingNearby && !osmError && osmPharmacies.length === 0 && locationStatus === "granted" && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-1000 bg-slate-900/90 backdrop-blur-sm text-white text-sm font-medium px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 whitespace-nowrap">
          📍 مافيش صيدليات مسجّلة في نطاق 5 كم
        </div>
      )}

      {/* Loading indicator — DB pharmacies (top-right badge) */}
      {loadingDB && !loadingNearby && (
        <div className="absolute top-4 right-4 z-1000 flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg">
          <div className="w-3 h-3 rounded-full border-2 border-blue-400/40 border-t-blue-400 animate-spin" />
          جاري تحميل البيانات...
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

        {/* Fly to user location smoothly */}
        {userLocation && <FlyToLocation userLocation={userLocation} />}

        {/* Fit bounds to search results */}
        <FitBoundsOnSearch 
          searchTerm={searchTerm} 
          osmPharmacies={filteredOSM} 
          dbPharmacies={filteredDB} 
        />

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
          {/* OSM pharmacies */}
          {filteredOSM.map((pharmacy) => {
          const lat = pharmacy.lat ?? pharmacy.center?.lat;
          const lon = pharmacy.lon ?? pharmacy.center?.lon;

          if (!lat || !lon) return null;

          return (
            <Marker
              key={`osm-${pharmacy.id}`}
              position={[lat, lon]}
              icon={defaultIcon}
              eventHandlers={{
                click: () => setSelectedPharmacy(pharmacy),
              }}
            />
          );
        })}

        {/* DB pharmacies */}
        {filteredDB.map((pharmacy) => (
          <Marker
            key={`db-${pharmacy.id}`}
            position={[pharmacy.latitude, pharmacy.longitude]}
            icon={greenIcon}
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