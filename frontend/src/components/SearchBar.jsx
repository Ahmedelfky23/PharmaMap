function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-2000 w-450px">
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <span className="text-slate-400 text-lg">🔍</span>
        </div>
        <input
          type="text"
          placeholder="ابحث عن صيدلية..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-200/50 border border-white p-4 pl-12 pr-6 text-slate-700 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
          dir="rtl"
        />
      </div>
    </div>
  );
}

export default SearchBar;