function Navbar() {
  return (
    <nav className="w-[95%] sm:w-[90%] lg:w-[80%] mx-auto mt-3 sm:mt-4 rounded-2xl sm:rounded-3xl bg-linear-to-r from-blue-800 via-blue-600 to-blue-500 text-white shadow-xl z-50 relative border border-blue-400/50">
      <div className="px-4 sm:px-6">
        <div className="flex justify-between h-14 sm:h-16 items-center">

          {/* Logo / Brand */}
          <div className="shrink-0 flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-12 sm:h-12 flex items-center justify-center bg-white rounded-xl sm:rounded-2xl shadow-inner overflow-hidden">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-125" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm leading-tight">
                Interactive Map
              </h1>
              <p className="text-[10px] sm:text-xs text-blue-100 font-medium tracking-wider uppercase">Egypt</p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm font-bold text-blue-700 bg-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-sm hover:bg-blue-50 transition cursor-pointer whitespace-nowrap">
              Admin Panel
            </span>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
