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

      <div className="flex flex-1 overflow-hidden px-[10%] py-6 gap-8">
        {/* Map Container */}
        <div className="flex-2 relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-white">
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

        {/* Sidebar */}
        <Sidebar
          pharmacy={selectedPharmacy}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
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