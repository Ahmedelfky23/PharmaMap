import { useState } from "react";

import Navbar from "./components/Navbar";
import Map from "./components/Map";
import Sidebar from "./components/Sidebar";
import PharmacyForm from "./components/AddPharmacyForm";
import LocationPermission from "./components/LocationPermission";
import api from "./services/api";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  // Location state
  // "pending" = showing permission screen
  // "granted" = user allowed location
  // "skipped" = user skipped
  const [locationStatus, setLocationStatus] = useState("pending");
  const [userLocation, setUserLocation] = useState(null); // { lat, lon }

  // Add form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLocation, setNewLocation] = useState({ lat: 0, lon: 0 });

  // Edit form state
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingPharmacy, setEditingPharmacy] = useState(null);

  // Refresh map pharmacies
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = () => setRefreshKey((k) => k + 1);

  // Handlers for location permission screen
  function handleLocationGranted(lat, lon) {
    setUserLocation({ lat, lon });
    setLocationStatus("granted");
  }

  function handleLocationSkip() {
    setLocationStatus("skipped");
  }

  // Open edit form
  function handleEdit(pharmacy) {
    setEditingPharmacy(pharmacy);
    setShowEditForm(true);
  }

  // Delete pharmacy
  async function handleDelete(pharmacy) {
    const confirmed = window.confirm(
      `هل أنت متأكد إنك عايز تمسح "${pharmacy.name}"؟`
    );
    if (!confirmed) return;

    try {
      await api.delete(`/pharmacies/${pharmacy.id}`);
      setSelectedPharmacy(null);
      refresh();
    } catch (error) {
      console.error(error);
      alert("حصل خطأ أثناء الحذف، حاول تاني.");
    }
  }

  return (
    <div
      className="flex flex-col h-screen overflow-hidden font-['Outfit'] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          'linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.85)), url("/bg.png")',
      }}
    >
      {/* Location Permission Screen */}
      {locationStatus === "pending" && (
        <LocationPermission
          onLocationGranted={handleLocationGranted}
          onSkip={handleLocationSkip}
        />
      )}

      <Navbar />

      {/* Desktop layout: side-by-side | Mobile: map full, sidebar as bottom sheet */}
      <div className="flex flex-1 overflow-hidden lg:px-[10%] lg:py-6 lg:gap-8 relative">
        {/* Map Container */}
        <div className="flex-1 min-w-0 relative rounded-none lg:rounded-3xl overflow-hidden shadow-xl border-0 lg:border lg:border-slate-200 bg-white">
          <Map
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedPharmacy={selectedPharmacy}
            setSelectedPharmacy={setSelectedPharmacy}
            isAdding={isAdding}
            setIsAdding={setIsAdding}
            setShowForm={setShowAddForm}
            setNewLocation={setNewLocation}
            refreshKey={refreshKey}
            userLocation={locationStatus !== "pending" ? userLocation : null}
          />
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-95 shrink-0 overflow-y-auto">
          <Sidebar
            pharmacy={selectedPharmacy}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Mobile Bottom Sheet Sidebar */}
        <div
          className={`lg:hidden fixed inset-x-0 bottom-0 z-2500 transition-transform duration-500 ease-in-out ${
            selectedPharmacy ? "translate-y-0" : "translate-y-full"
          }`}
          style={{ maxHeight: "75vh" }}
        >
          {/* Pull handle */}
          <div className="bg-white rounded-t-3xl pt-3 pb-0 flex justify-center border-t border-slate-200 shadow-2xl">
            <div className="w-10 h-1 bg-slate-300 rounded-full mb-2" />
          </div>
          {/* Close button */}
          {selectedPharmacy && (
            <button
              onClick={() => setSelectedPharmacy(null)}
              className="absolute top-3 right-4 z-10 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition"
            >
              ✕
            </button>
          )}
          <div className="bg-white overflow-y-auto" style={{ maxHeight: "calc(75vh - 32px)" }}>
            <Sidebar
              pharmacy={selectedPharmacy}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isMobile={true}
            />
          </div>
        </div>

        {/* Mobile backdrop when sidebar open */}
        {selectedPharmacy && (
          <div
            className="lg:hidden fixed inset-0 bg-black/30 z-2400"
            onClick={() => setSelectedPharmacy(null)}
          />
        )}
      </div>

      {/* Add Form */}
      <PharmacyForm
        showForm={showAddForm}
        setShowForm={setShowAddForm}
        newLocation={newLocation}
        refresh={refresh}
        mode="add"
      />

      {/* Edit Form */}
      {editingPharmacy && (
        <PharmacyForm
          key={editingPharmacy.id}
          showForm={showEditForm}
          setShowForm={setShowEditForm}
          newLocation={{
            lat: editingPharmacy.latitude,
            lon: editingPharmacy.longitude,
          }}
          refresh={() => {
            refresh();
            setSelectedPharmacy(null);
          }}
          mode="edit"
          pharmacyData={editingPharmacy}
        />
      )}
    </div>
  );
}

export default App;