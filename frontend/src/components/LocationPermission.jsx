import { useState } from "react";

function LocationPermission({ onLocationGranted, onSkip }) {
  const [status, setStatus] = useState("idle"); // idle | loading | error

  function handleAllow() {
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setStatus("idle");
        onLocationGranted(latitude, longitude);
      },
      (err) => {
        console.error(err);
        setStatus("error");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center">
      {/* Blurred dark overlay */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />

      {/* Card */}
      <div
        className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 max-w-md w-full mx-4 shadow-2xl text-center"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)",
          boxShadow:
            "0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
        }}
      >
        {/* Icon pulsing */}
        <div className="relative inline-flex items-center justify-center w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-blue-500/30" />
          <div className="relative w-20 h-20 rounded-full bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/40">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </div>

        {/* Text */}
        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
          ابحث حواليك
        </h2>
        <p className="text-slate-300 text-base leading-relaxed mb-8">
          سمّحلنا نعرف مكانك عشان نعرّفلك{" "}
          <span className="text-cyan-400 font-semibold">
            أقرب الصيدليات ليك
          </span>{" "}
          دلوقتي فورًا 📍
        </p>

        {/* Error message */}
        {status === "error" && (
          <div className="mb-5 px-4 py-3 bg-red-500/20 border border-red-400/40 rounded-xl text-red-300 text-sm">
            ⚠️ مش قادرين نوصل لمكانك. تأكد إنك سمحت بالوصول للـ Location في
            المتصفح.
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            id="btn-allow-location"
            onClick={handleAllow}
            disabled={status === "loading"}
            className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background:
                "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
              boxShadow: "0 8px 25px rgba(59,130,246,0.4)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 12px 35px rgba(59,130,246,0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 8px 25px rgba(59,130,246,0.4)";
            }}
          >
            {status === "loading" ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                جاري تحديد موقعك...
              </span>
            ) : (
              "📍 السماح بالوصول للموقع"
            )}
          </button>

          <button
            id="btn-skip-location"
            onClick={onSkip}
            className="w-full py-3 rounded-2xl font-medium text-slate-400 text-sm border border-white/10 hover:bg-white/5 hover:text-white transition-all duration-200"
          >
            تخطّي — عرض خريطة مصر كاملة
          </button>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-slate-500 text-xs">
          🔒 موقعك بيتبعتش لأي سيرفر — بيتستخدم بس في متصفحك
        </p>
      </div>
    </div>
  );
}

export default LocationPermission;
