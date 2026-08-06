import { useMapEvents } from "react-leaflet";

function AddPharmacyMapClick({
  isAdding,
  setNewLocation,
  setShowForm,
}) {
  useMapEvents({
    click(e) {
      if (!isAdding) return;

      setNewLocation({
        lat: e.latlng.lat,
        lon: e.latlng.lng,
      });

      setShowForm(true);
    },
  });

  return null;
}

export default AddPharmacyMapClick;