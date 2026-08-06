function AddPharmacyButton({ isAdding, setIsAdding }) {
  return (
    <button
      onClick={() => setIsAdding(!isAdding)}
      className={`absolute bottom-6 sm:bottom-8 left-4 sm:left-8 z-2000 px-4 sm:px-6 py-3 sm:py-4 rounded-full text-white font-bold shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 hover:-translate-y-1 hover:shadow-xl text-sm sm:text-base
      ${
        isAdding
          ? "bg-linear-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-red-500/30"
          : "bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-blue-500/30"
      }`}
    >
      <span className="text-lg sm:text-xl">{isAdding ? "❌" : "➕"}</span>
      <span className="hidden xs:inline sm:inline">{isAdding ? "Cancel Adding" : "Add Pharmacy"}</span>
    </button>
  );
}

export default AddPharmacyButton;