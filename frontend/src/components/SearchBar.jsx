function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    // Mobile: 90% wide, centered
    // Tablet (md): 60% wide, centered
    // Desktop (lg+): fixed 450px
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-2000 w-[88%] md:w-[55%] lg:w-112.5">
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <span className="text-slate-400 text-base sm:text-lg">🔍</span>
        </div>
        <input
          type="text"
          placeholder="ابحث عن صيدلية..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/85 dark:bg-slate-800/85 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-white/80 dark:border-slate-700/80 p-3 md:p-4 pl-11 pr-5 text-slate-700 dark:text-slate-200 outline-none transition-all focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 text-sm md:text-base"
          dir="rtl"
        />
      </div>
    </div>
  );
}

export default SearchBar;