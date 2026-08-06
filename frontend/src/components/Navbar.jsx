function Navbar() {
  return (
    // Mobile: full width, no margin, no rounded corners
    // Tablet (md): full width with slight rounding
    // Desktop (lg): 80% centered with full rounding
    <nav className="
      w-full mx-0 mt-0 rounded-none
      md:w-[90%] md:mx-auto md:mt-3 md:rounded-2xl
      lg:w-[80%] lg:mt-4 lg:rounded-3xl
      bg-linear-to-r from-blue-800 via-blue-600 to-blue-500
      text-white shadow-xl z-50 relative border-b border-blue-400/50
      md:border
    ">
      <div className="px-4 sm:px-6">
        <div className="flex justify-between h-13 sm:h-14 md:h-16 items-center">

          {/* Logo / Brand */}
          <div className="shrink-0 flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-inner overflow-hidden">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-125" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg md:text-2xl font-bold tracking-tight text-white drop-shadow-sm leading-tight">
                Interactive Map
              </h1>
              <p className="text-[9px] sm:text-[10px] md:text-xs text-blue-100 font-medium tracking-wider uppercase">Egypt</p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm font-bold text-blue-700 bg-white px-2.5 sm:px-3 md:px-4 py-1 md:py-1.5 rounded-full shadow-sm hover:bg-blue-50 transition cursor-pointer whitespace-nowrap">
              Admin Panel
            </span>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
