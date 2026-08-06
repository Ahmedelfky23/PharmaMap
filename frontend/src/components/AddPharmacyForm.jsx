import { useState } from "react";
import api from "../services/api";

const placeholderImage =
  "https://placehold.co/600x300?text=No+Image";


function PharmacyForm({
  showForm,
  setShowForm,
  newLocation,
  refresh,
  mode = "add",
  pharmacyData = null,
}) {

  const emptyForm = {
    name: "",
    chain: "Independent",
    address: "",
    phone: "",
    email: "",
    website: "",
    openingHours: "",
    rating: "A",
    notes: "",
    image: "",
  };

  // Initialize with pharmacyData when in edit mode, otherwise use empty form
  const [formData, setFormData] = useState(() => {
    if (mode === "edit" && pharmacyData) {
      return {
        name: pharmacyData.name || "",
        chain: pharmacyData.chain || "Independent",
        address: pharmacyData.address || "",
        phone: pharmacyData.phone || "",
        email: pharmacyData.email || "",
        website: pharmacyData.website || "",
        openingHours: pharmacyData.openingHours || "",
        rating: pharmacyData.rating || "A",
        notes: pharmacyData.notes || "",
        image: pharmacyData.image || "",
      };
    }
    return emptyForm;
  });



  if(!showForm) return null;



  function handleChange(e){

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  }



  function selectRating(rating){

    setFormData({
      ...formData,
      rating
    });

  }



  async function handleSave(){

    if(!formData.name.trim()){

      alert("Please enter pharmacy name.");
      return;

    }


    try{


      const data = {

        ...formData,

        latitude:newLocation.lat,
        longitude:newLocation.lon

      };



      if(mode === "add"){


        await api.post("/pharmacies",data);


      }else{


        await api.put(
          `/pharmacies/${pharmacyData.id}`,
          data
        );


      }



      await refresh();


      alert(
        mode === "add"
        ? "Pharmacy Added Successfully ✅"
        : "Pharmacy Updated Successfully ✅"
      );


      setShowForm(false);


      setFormData(emptyForm);



    }catch(error){
      console.error(error);
      alert("Error: " + (error.response?.data?.message || error.message));
    }


  }




  const ratings=[

    {
      value:"A",
      color:"bg-blue-600"
    },

    {
      value:"B",
      color:"bg-yellow-500"
    },

    {
      value:"C",
      color:"bg-orange-500"
    },

    {
      value:"D",
      color:"bg-red-600"
    }

  ];




return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-3000 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:w-162.5 max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-700 transition-colors duration-300">
        
        {/* Header */}
        <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 p-6 flex items-center justify-between transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-xl shadow-sm border border-slate-100 dark:border-slate-600 flex items-center justify-center text-2xl">
              {mode === "add" ? "✨" : "📝"}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {mode === "add" ? "Add New Pharmacy" : "Edit Pharmacy"}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                {mode === "add" ? "Fill in the details below" : "Update pharmacy information"}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowForm(false)}
            className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200 transition flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-5 sm:space-y-6 flex-1 custom-scrollbar">
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Pharmacy Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl p-3.5 outline-none transition focus:bg-white dark:focus:bg-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800 dark:text-white font-medium"
                placeholder="e.g., Al-Amal Pharmacy"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Chain</label>
                <select
                  name="chain"
                  value={formData.chain}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl p-3.5 outline-none transition focus:bg-white dark:focus:bg-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800 dark:text-white font-medium appearance-none"
                >
                  <option>Independent</option>
                  <option>El Ezaby</option>
                  <option>Seif</option>
                  <option>Roshdy</option>
                  <option>Misr</option>
                  <option>19011</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Phone</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl p-3.5 outline-none transition focus:bg-white dark:focus:bg-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800 dark:text-white font-medium"
                  placeholder="01xxxxxxxxx"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Address</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl p-3.5 outline-none transition focus:bg-white dark:focus:bg-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800 dark:text-white font-medium"
                placeholder="Full address details"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl p-3.5 outline-none transition focus:bg-white dark:focus:bg-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800 dark:text-white font-medium"
                  placeholder="contact@pharmacy.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Opening Hours</label>
                <input
                  name="openingHours"
                  value={formData.openingHours}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl p-3.5 outline-none transition focus:bg-white dark:focus:bg-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800 dark:text-white font-medium"
                  placeholder="e.g., 24/7 or 9 AM - 12 PM"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Rating Classification</label>
              <div className="flex gap-3 flex-wrap">
                {ratings.map(item => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => selectRating(item.value)}
                    className={`w-14 h-14 rounded-2xl text-white font-bold text-lg transition-all shadow-sm flex items-center justify-center
                      ${item.color}
                      ${formData.rating === item.value 
                        ? "ring-4 ring-offset-2 ring-blue-500 scale-105 shadow-lg shadow-blue-500/30" 
                        : "opacity-70 hover:opacity-100 hover:scale-105"}
                    `}
                  >
                    {item.value}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Notes</label>
              <textarea
                rows="3"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl p-3.5 outline-none transition focus:bg-white dark:focus:bg-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800 dark:text-white font-medium resize-none"
                placeholder="Additional details or landmarks..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Cover Image URL</label>
              <input
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl p-3.5 outline-none transition focus:bg-white dark:focus:bg-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800 dark:text-white font-medium mb-4"
                placeholder="https://..."
              />
              <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-600 h-48 bg-slate-100 dark:bg-slate-800 relative group">
                <img
                  src={formData.image || placeholderImage}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  alt="preview"
                />
                {!formData.image && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-800/10 backdrop-blur-sm">
                    <span className="bg-white/90 text-slate-700 px-4 py-2 rounded-lg font-medium shadow-sm">Preview Area</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-100 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Latitude</label>
                <input
                  readOnly
                  value={newLocation.lat?.toFixed(6) || ""}
                  className="w-full bg-transparent border-none p-0 text-slate-700 dark:text-slate-300 font-mono font-medium outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Longitude</label>
                <input
                  readOnly
                  value={newLocation.lon?.toFixed(6) || ""}
                  className="w-full bg-transparent border-none p-0 text-slate-700 dark:text-slate-300 font-mono font-medium outline-none"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 p-6 flex gap-4 transition-colors">
          <button
            onClick={() => setShowForm(false)}
            className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 py-3.5 rounded-xl font-bold transition shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3.5 rounded-xl font-bold transition shadow-md shadow-blue-500/20"
          >
            {mode === "add" ? "Save Pharmacy" : "Update Pharmacy"}
          </button>
        </div>

      </div>
    </div>
);


}


export default PharmacyForm;