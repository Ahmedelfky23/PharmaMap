import { useState, useEffect } from "react";
import api from "../services/api";


// ─── Lightbox ───────────────────────────────────────────────────────────────
function Lightbox({ src, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />
      <div
        className="relative z-10 max-w-4xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/70 hover:text-white text-4xl font-light transition"
          aria-label="Close"
        >
          ×
        </button>
        <img
          src={src}
          alt="Pharmacy full size"
          className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
        />
      </div>
    </div>
  );
}

// ─── Main Sidebar ────────────────────────────────────────────────────────────
function Sidebar({ pharmacy, onEdit, onDelete }) {
  const isDatabasePharmacy =
    pharmacy?.name !== undefined && pharmacy?.id !== undefined;
  const currentPharmacyId = pharmacy
    ? isDatabasePharmacy
      ? `db-${pharmacy.id}`
      : `osm-${pharmacy.id}`
    : null;
  const tags = pharmacy?.tags || {};

  const [reviews, setReviews] = useState([]);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [imgError, setImgError] = useState(false);

  // Reset image error when pharmacy changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImgError(false);
  }, [currentPharmacyId]);

  useEffect(() => {
    if (currentPharmacyId) {
      const fetchReviews = async () => {
        try {
          const res = await api.get(`/reviews/${currentPharmacyId}`);
          setReviews(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchReviews();
    }
  }, [currentPharmacyId]);

  if (!pharmacy) {
    return (
      <div className="w-full bg-white rounded-2xl shadow-lg border border-slate-200/60 flex flex-col items-center justify-center p-8 text-center h-full">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">📍</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-700 mb-2">إختر صيدلية</h2>
        <p className="text-slate-500">
          اضغط على أي علامة في الخريطة لعرض تفاصيل الصيدلية هنا.
        </p>
      </div>
    );
  }

  async function handleAddReview(e) {
    e.preventDefault();
    if (!newReviewText.trim()) return;
    setIsSubmitting(true);
    try {
      await api.post(`/reviews/${currentPharmacyId}`, {
        rating: newReviewRating,
        text: newReviewText,
      });
      setNewReviewText("");
      setNewReviewRating(5);
      const res = await api.get(`/reviews/${currentPharmacyId}`);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to add review.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const getRatingColor = (rating) => {
    switch (rating) {
      case "A": return "bg-blue-100 text-blue-700 border-blue-200";
      case "B": return "bg-green-100 text-green-700 border-green-200";
      case "C": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "D": return "bg-red-100 text-red-700 border-red-200";
      default:  return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  // Resolve values for both DB and OSM pharmacies
  const pharmacyName = isDatabasePharmacy
    ? pharmacy.name
    : tags.name || "Unknown Pharmacy";

  const pharmacyImage = isDatabasePharmacy
    ? pharmacy.image
    : tags.image || null;

  const pharmacyWebsite = isDatabasePharmacy
    ? pharmacy.website
    : tags.website || tags["contact:website"] || tags.url || null;

  const pharmacyAddress = isDatabasePharmacy
    ? pharmacy.address
    : tags["addr:street"] || tags["addr:full"] || null;

  const pharmacyPhone = isDatabasePharmacy
    ? pharmacy.phone
    : tags.phone || tags["contact:phone"] || null;

  const hasImage = pharmacyImage && !imgError;

  return (
    <>
      {/* Lightbox */}
      {lightboxSrc && (
        <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}

      <div className="w-full bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden flex flex-col h-full">

        {/* ── Hero Image ─────────────────────────────────── */}
        <div className="relative w-full group" style={{ height: hasImage ? "15rem" : "10rem" }}>
          {hasImage ? (
            <>
              <img
                src={pharmacyImage}
                alt={pharmacyName}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105 cursor-zoom-in"
                onClick={() => setLightboxSrc(pharmacyImage)}
              />
              {/* Zoom hint */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition">
                <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                  🔍 عرض كامل
                </span>
              </div>
            </>
          ) : (
            /* No image — elegant gradient placeholder */
            <div className="w-full h-full bg-linear-to-br from-slate-800 via-slate-700 to-slate-900 flex items-center justify-center">
              <div className="text-center">
                <span className="text-5xl opacity-30">🏥</span>
                <p className="text-white/30 text-xs mt-2 font-medium tracking-widest uppercase">
                  No Photo
                </p>
              </div>
            </div>
          )}

          {/* Gradient overlay + title */}
          <div className="absolute inset-0 bg-linear-to-trom-slate-900/85 via-slate-900/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-5 right-5 pointer-events-none">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-xs font-semibold tracking-wider uppercase mb-2">
              {isDatabasePharmacy ? pharmacy.chain || "Independent" : "OSM Data"}
            </span>
            <h1 className="text-2xl font-bold text-white drop-shadow-md leading-snug">
              {pharmacyName}
            </h1>
          </div>
        </div>

        {/* ── Info Section ───────────────────────────────── */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          <div className="space-y-3">

            {/* Address */}
            <InfoCard
              icon="📍"
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
              label="العنوان"
              value={pharmacyAddress}
            />

            {/* Phone */}
            <InfoCard
              icon="📞"
              iconBg="bg-green-100"
              iconColor="text-green-600"
              label="التليفون"
              value={pharmacyPhone}
              isLink={pharmacyPhone ? `tel:${pharmacyPhone}` : null}
            />

            {/* Website — show only if available */}
            {pharmacyWebsite && (
              <div className="flex items-start gap-4 p-4 rounded-xl bg-indigo-50 border border-indigo-100 transition hover:border-indigo-300 hover:shadow-sm">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 text-lg">
                  🌐
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
                    الموقع الإلكتروني
                  </p>
                  <a
                    href={
                      pharmacyWebsite.startsWith("http")
                        ? pharmacyWebsite
                        : `https://${pharmacyWebsite}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 font-medium text-sm hover:text-indigo-800 hover:underline break-all transition"
                  >
                    {pharmacyWebsite}
                  </a>
                </div>
              </div>
            )}

            {/* DB-only fields */}
            {isDatabasePharmacy && (
              <>
                {/* Opening Hours */}
                {pharmacy.openingHours && (
                  <InfoCard
                    icon="🕐"
                    iconBg="bg-orange-100"
                    iconColor="text-orange-600"
                    label="مواعيد العمل"
                    value={pharmacy.openingHours}
                  />
                )}

                {/* Rating */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 transition hover:border-blue-200 hover:shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 shrink-0">
                    ⭐
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
                      التصنيف
                    </p>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold border self-start ${getRatingColor(pharmacy.rating)}`}
                    >
                      Class {pharmacy.rating || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                {pharmacy.notes && (
                  <InfoCard
                    icon="📝"
                    iconBg="bg-purple-100"
                    iconColor="text-purple-600"
                    label="ملاحظات"
                    value={pharmacy.notes}
                  />
                )}
              </>
            )}
          </div>

          {/* ── Reviews ──────────────────────────────────── */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">التقييمات</h3>

            <div className="space-y-4 mb-6">
              {reviews.length === 0 ? (
                <p className="text-slate-500 text-sm text-center">
                  لا توجد تقييمات بعد. كن أول من يقيّم!
                </p>
              ) : (
                reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-slate-50 p-4 rounded-xl border border-slate-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex gap-0.5 text-yellow-400 text-base">
                        {Array(rev.rating).fill("★").join("")}
                        <span className="text-slate-300">
                          {Array(5 - rev.rating).fill("★").join("")}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString("ar-EG")}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700">{rev.text}</p>
                  </div>
                ))
              )}
            </div>

            <form
              onSubmit={handleAddReview}
              className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm"
            >
              <h4 className="text-sm font-bold text-blue-800 mb-3">
                أضف تقييمك
              </h4>
              <div className="mb-3 flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-600">
                  التقييم:
                </label>
                <select
                  value={newReviewRating}
                  onChange={(e) => setNewReviewRating(Number(e.target.value))}
                  className="text-sm border border-slate-200 rounded p-1 focus:outline-none focus:border-blue-400"
                >
                  {[5, 4, 3, 2, 1].map((num) => (
                    <option key={num} value={num}>
                      {num} ★
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                className="w-full border border-slate-200 rounded-lg p-2 text-sm mb-3 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                placeholder="اكتب تقييمك هنا..."
                rows={3}
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-sm transition disabled:opacity-50"
              >
                {isSubmitting ? "جاري الإرسال..." : "إرسال التقييم"}
              </button>
            </form>
          </div>
        </div>

        {/* ── Edit / Delete — DB only ─────────────────────── */}
        {isDatabasePharmacy && (
          <div className="border-t border-slate-100 p-5 bg-slate-50/50 flex gap-3">
            <button
              onClick={() => onEdit(pharmacy)}
              className="flex-1 bg-white border-2 border-blue-600 text-blue-700 hover:bg-blue-50 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-sm"
            >
              <span>✏️</span> تعديل
            </button>
            <button
              onClick={() => onDelete(pharmacy)}
              className="flex-1 bg-linear-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white py-3 rounded-xl font-bold transition shadow-md shadow-red-500/20 flex items-center justify-center gap-2"
            >
              <span>🗑️</span> حذف
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Reusable Info Card ──────────────────────────────────────────────────────
function InfoCard({ icon, iconBg, iconColor, label, value, isLink }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 transition hover:border-blue-200 hover:shadow-sm">
      <div
        className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center ${iconColor} shrink-0 text-lg`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
          {label}
        </p>
        {isLink ? (
          <a
            href={isLink}
            className="text-slate-700 font-medium hover:text-blue-600 transition"
          >
            {value || "غير متاح"}
          </a>
        ) : (
          <p className="text-slate-700 font-medium leading-relaxed wrap-break-word">
            {value || "غير متاح"}
          </p>
        )}
      </div>
    </div>
  );
}

export default Sidebar;