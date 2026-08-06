function Navbar() {
  return (
    <nav className="w-[80%] mx-auto mt-4 rounded-3xl bg-linear-to-r from-blue-800 via-blue-600 to-blue-500 text-white shadow-xl z-50 relative border border-blue-400/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo / Brand */}
          <div className="shrink-0 flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-inner overflow-hidden">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-125" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                Interactive Map
              </h1>
              <p className="text-xs text-blue-100 font-medium tracking-wider uppercase">Egypt</p>
            </div>
          </div>

          {/* Right side nav items if any in the future */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-blue-700 bg-white px-4 py-1.5 rounded-full shadow-sm hover:bg-blue-50 transition cursor-pointer">
              Admin Panel
            </span>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
