<div align="center">

# 📍 PharmaMap Egypt | خريطة صيدليات مصر

**A full-stack, real-time GIS web application to discover, navigate, and manage pharmacies across Egypt.**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

[English](#english-overview) • [المميزات بالعربية](#-المميزات-الرئيسية-features) • [Tech Stack](#-tech-stack) • [Installation Guide](#-getting-started) • [API Documentation](#-api-endpoints)

</div>

---

## 📖 English Overview

**PharmaMap Egypt** is an interactive, location-based web application tailored for users across Egypt to easily locate nearby pharmacies in real-time, get turn-by-turn driving and walking routes, inspect contact details, and read or submit community ratings and reviews.

The platform integrates data imported directly from **OpenStreetMap (Overpass API)** combined with crowdsourced additions made by users and verified contributors. It is optimized for high performance with viewport bounding-box queries, custom marker clusters, smooth map styling for both dark and light modes, and zero cold-start latency.

---

## 🌟 المميزات الرئيسية (Features)

### 🗺️ 1. خريطة تفاعلية ذكية وسريعة (Smart Interactive Map)
- خريطة مبنية بواسطة **Leaflet & React-Leaflet** تدعم الانتقال السلس والسريع.
- **تجميع العلامات (Marker Clustering):** تجميع آلاف الصيدليات في كتل رقمية مخصصة (`react-leaflet-cluster`) لضمان سلاسة وسرعة التصفح دون أي بطء أو تجميد في المتصفح.
- **تلوين ذكي للمؤشرات:** 
  - 🟢 **أخضر:** صيدليات مستوردة وموثقة من OpenStreetMap.
  - 🔴 **أحمر:** صيدليات مضافة بواسطة المستخدمين في المجتمع.
  - 🔵 **نبض أزرق متحرك:** موقع المستخدم الحالي المباشر بدقة GPS عالية.

### 🧭 2. الملاحة الحية وأقرب صيدلية (Live Geolocation & Turn-by-Turn Routing)
- تتبع الموقع المباشر للمستخدم (`Live GPS Tracking`) لحظة بلحظة مع خيار التفعيل أو الإيقاف.
- **حساب المسافة بدقة عالية:** استخدام معادلة Haversine الرياضية لحساب البعد بالكيلومتر بين موقعك وكل صيدلية.
- **كشف أقرب صيدلية تلقائياً (Nearest Pharmacy Detection):** يتعرف التطبيق تلقائياً على أقرب صيدلية من موقعك.
- **رسم المسار الحي (OSRM Routing):** رسم خط المسار الفعلي (Turn-by-turn polyline) بين مكانك وأقرب صيدلية مباشرة على الخريطة.

### 🔍 3. بحث وفلترة ذكية حسب الإطار المرئي (Viewport & Search Filtering)
- **بحث فوري:** البحث بالاسم العربي أو الإنجليزي أو اسم السلسلة (مثل: العزبي، سيف، رشدي، 19011...).
- **تحسين استهلاك البيانات (Bounding Box Filtering):** الباك إند يقوم بجلب الصيدليات الواقعة ضمن الإطار المعروض على شاشتك فقط (`north, south, east, west`) بدلاً من تحميل آلاف البيانات غير المعروضة.

### 🏥 4. إدارة وإضافة الصيدليات (Crowdsourced Pharmacy CRUD)
- إمكانية إضافة أي صيدلية جديدة بالضغط المباشر على موقعها في الخريطة.
- نموذج مفصل يشمل: (اسم الصيدلية، اسم السلسلة، العنوان، رقم الهاتف، الموقع الإلكتروني، ساعات العمل ومواعيد 24 ساعة، صورة الصيدلية، وملاحظات إضافية).
- تعديل أو حذف الصيدليات المسجلة بسهولة.

### ⭐ 5. نظام التقييمات والمراجعات (Ratings & Reviews System)
- نظام مراجعات كامل (Full CRUD) لكل صيدلية.
- إمكانية إضافة تقييم بالنجوم من 1 إلى 5 مع كتابة رأي وتعليق تفصيلي.
- تعديل أو حذف مراجعاتك السابقة في أي وقت.
- حساب تلقائي لمتوسط التقييم الإجمالي لكل صيدلية وعدد المقيمين.

### 📱 6. واجهة عصرية ومتجاوبة بالكامل (Modern UI / UX)
- **تصميم مريح للعين:** يدعم الوضع المظلم والنهاري (**Dark Mode & Light Mode**) مع حفظ التفضيل في المتصفح تلقائياً.
- **متجاوب 100%:** 
  - في الكمبيوتر (Desktop): شريط جانبي ثابت وأنيق بجانب الخريطة.
  - في الموبايل (Mobile): نافذة سفلية منسدلة (Bottom Sheet Drawer) قابلة للسحب والإغلاق.
- **معاينة الصور (Lightbox):** إمكانية فتح صور الصيدلية في وضع ملء الشاشة بجودة فائقة.
- أزرار تفاعلية سريعة: الاتصال المباشر برقم الهاتف بنقرة واحدة، التوجيه لـ Google Maps، ونسخ الرابط للمشاركة.

### ⚡ 7. أداء فائق وتجاوز مشاكل الاستضافة (Zero Cold Start)
- نظام Keep-Alive دوري (Ping) كل 13 دقيقة لتجنب توقف الخادم على الاستضافات المجانية (مثل Render).
- ضغط البيانات (Gzip / Compression) واتصال مسبق بقاعدة البيانات (Prisma pre-warming) لسرعة استجابة فائقة.

### 📥 8. أداة استيراد الصيدليات الجماعية (OpenStreetMap Mass Ingestion)
- سكريبت مؤتمت (`scripts/importOsm.js`) للاتصال بـ Overpass API وجلب آلاف الصيدليات في كافة محافظات مصر وتخزينها في قاعدة البيانات مع دعم معالجة التكرارات (`Upsert`).

---

## 🛠️ Tech Stack

### Frontend
| Technology | Description |
| :--- | :--- |
| **React 19** | Modern UI components and reactive state management |
| **Vite 8** | High-speed frontend build tool and local dev server |
| **Tailwind CSS v4** | Next-generation utility-first styling with native dark mode |
| **Leaflet & React-Leaflet** | Open-source mobile-friendly interactive maps |
| **React-Leaflet-Cluster** | High-performance marker clustering for dense map points |
| **OSRM API** | Open Source Routing Machine for driving and routing paths |
| **Axios** | HTTP client for smooth REST API integration |

### Backend
| Technology | Description |
| :--- | :--- |
| **Node.js** | Scalable JavaScript runtime environment |
| **Express 5** | High-performance, minimalist Node.js web server framework |
| **Prisma ORM 6** | Next-generation type-safe Node.js & TypeScript ORM |
| **PostgreSQL** | Relational cloud database (hosted via Supabase / Render / Neon) |
| **Overpass API** | OpenStreetMap API for automated geo-data queries |
| **Compression & CORS** | Middleware for Gzip response compression and cross-origin security |

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    User["👤 المستخدم (User / Client)"]
    
    subgraph Frontend ["💻 Frontend (React 19 + Vite + Tailwind v4)"]
        UI["واجهة المستخدم (UI Components)"]
        Map["خريطة تفاعلية (Leaflet Map)"]
        GPS["تتبع الموقع (Geolocation Watcher)"]
    end
    
    subgraph External ["🌐 External Services"]
        OSRM["OSRM Routing Engine (مسارات القيادة)"]
        Tiles["CartoDB / OpenStreetMap (بلاطات الخريطة)"]
        Overpass["Overpass API (بيانات صيدليات مصر)"]
    end
    
    subgraph Backend ["⚙️ Backend (Node.js + Express 5)"]
        API["REST API Routes & Controllers"]
        Importer["OSM Data Importer Script"]
        Prisma["Prisma ORM Client"]
    end
    
    subgraph Database ["🗄️ Database"]
        Postgres[("PostgreSQL Database (Supabase / Render)")]
    end

    User --> UI
    UI --> Map
    GPS --> Map
    Map <--> Tiles
    Map <--> OSRM
    UI <--> API
    API <--> Prisma
    Prisma <--> Postgres
    Importer <--> Overpass
    Importer <--> Prisma
```

---

## 📂 Project Structure

```text
PharmaMap/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema (Pharmacy & Review models)
│   │   └── migrations/         # Prisma migration history
│   ├── scripts/
│   │   └── importOsm.js        # Script to import thousands of pharmacies from Overpass API
│   ├── src/
│   │   ├── controllers/
│   │   │   └── pharmacyController.js # Handles bounds queries, search, CRUD, and nearby calculations
│   │   ├── routes/
│   │   │   ├── pharmacyRoutes.js     # Endpoints for pharmacies & admin import
│   │   │   └── reviewRoutes.js       # Endpoints for reviews and ratings
│   │   └── index.js            # Express server initialization, middleware, keep-alive ping
│   ├── .env.example            # Backend environment variables template
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── bg.png              # Background branding image
│   │   └── logo.png            # Application logo
│   ├── src/
│   │   ├── assets/             # Icons and graphics
│   │   ├── components/
│   │   │   ├── AddPharmacyButton.jsx   # Button to trigger pin drop mode
│   │   │   ├── AddPharmacyForm.jsx     # Modal form for adding/editing pharmacies
│   │   │   ├── AddPharmacyMapClick.jsx # Map event listener to capture clicked coordinates
│   │   │   ├── LocationPermission.jsx  # Welcome onboarding modal for location permissions
│   │   │   ├── Map.jsx                 # Leaflet map container, clusters, routing, markers
│   │   │   ├── Navbar.jsx              # Header with logo, live stats, and dark mode toggle
│   │   │   ├── SearchBar.jsx           # Real-time search input
│   │   │   └── Sidebar.jsx             # Detailed drawer for pharmacy details, reviews, & actions
│   │   ├── services/
│   │   │   └── api.js          # Axios configuration with cache-busting interceptors
│   │   ├── App.jsx             # Main application state and responsive layout
│   │   ├── main.jsx            # React root mount
│   │   └── index.css           # Tailwind CSS imports & custom animations
│   ├── .env.example            # Frontend environment variables template
│   └── package.json
│
├── .gitignore
├── package.json                # Root workspace scripts to run both apps simultaneously
└── README.md                   # Project documentation
```

---

## 🗄️ Database Schema

The database utilizes **PostgreSQL** managed through **Prisma ORM**:

```prisma
model Pharmacy {
  id            Int      @id @default(autoincrement())
  name          String
  chain         String?
  address       String?
  phone         String?
  email         String?
  website       String?
  openingHours  String?
  rating        String?
  notes         String?
  image         String?
  latitude      Float
  longitude     Float
  osmId         String?  @unique
  source        String?  @default("user") // "osm" or "user"
  createdAt     DateTime @default(now())
}

model Review {
  id         Int      @id @default(autoincrement())
  pharmacyId String   // References "db-{id}" or "osm-{id}"
  rating     Int      // 1 to 5 stars
  text       String
  createdAt  DateTime @default(now())
}
```

---

## 🔌 API Endpoints

### 🏥 Pharmacies (`/api/pharmacies`)
| Method | Endpoint | Query / Body | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/pharmacies` | `?north=&south=&east=&west=&search=` | Fetch pharmacies filtered by map bounds and/or search term |
| `GET` | `/api/pharmacies/nearby` | `?lat=30.04&lng=31.23&radius=3000` | Fetch pharmacies near given coordinates within radius in meters |
| `POST` | `/api/pharmacies` | JSON Body (Pharmacy details) | Create a new user-added pharmacy |
| `PUT` | `/api/pharmacies/:id` | JSON Body (Pharmacy updates) | Update pharmacy data |
| `DELETE` | `/api/pharmacies/:id` | None | Delete a pharmacy |
| `POST` | `/api/pharmacies/admin/import-osm` | Header: `x-admin-secret` | Trigger background Overpass API sync for all pharmacies in Egypt |

### ⭐ Reviews (`/api/reviews`)
| Method | Endpoint | Query / Body | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/reviews/:pharmacyId` | None | Get all reviews for a specific pharmacy ordered by date |
| `POST` | `/api/reviews/:pharmacyId` | `{ rating: 5, text: "ممتازة جداً" }` | Add a new review and rating |
| `PUT` | `/api/reviews/:pharmacyId/:reviewId` | `{ rating: 4, text: "تعديل المراجعة" }` | Edit an existing review |
| `DELETE` | `/api/reviews/:pharmacyId/:reviewId` | None | Delete a review |

### 💓 Health Check & Ping
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/ping` | Fast 200 OK ping to keep free-tier instances warm |

---

## 🚀 Getting Started

Follow these steps to run the application locally on your machine:

### 1. المتطلبات الأساسية (Prerequisites)
- [Node.js](https://nodejs.org/) (Version 18 or newer)
- [Git](https://git-scm.com/)
- A [PostgreSQL](https://www.postgresql.org/) database (Local or free cloud instance like [Supabase](https://supabase.com/) or [Neon](https://neon.tech/))

---

### 2. استنساخ المشروع (Clone Repository)
```bash
git clone https://github.com/Ahmedelfky23/PharmaMap.git
cd PharmaMap
```

---

### 3. إعداد السيرفر (Backend Setup)
```bash
cd backend
npm install
```

قم بإنشاء ملف `.env` داخل مجلد `backend` وأضف بيانات الاتصال بقاعدة البيانات:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/pharmamap?schema=public"
DIRECT_URL="postgresql://username:password@localhost:5432/pharmamap?schema=public"
PORT=5000
ADMIN_SECRET="my_secret_key"
```

تطبيق التغييرات على قاعدة البيانات وتوليد Prisma Client:
```bash
npx prisma db push
```

*(اختياري)* استيراد صيدليات مصر من OpenStreetMap إلى قاعدة بياناتك:
```bash
node scripts/importOsm.js
```

تشغيل الخادم في وضع التطوير:
```bash
npm run dev
```
سيعمل السيرفر على: `http://localhost:5000`

---

### 4. إعداد الواجهة الأمامية (Frontend Setup)
في نافذة جديدة:
```bash
cd frontend
npm install
npm run dev
```
ستعمل الواجهة على: `http://localhost:5173`

---

### ⚡ تشغيل المشروع بالكامل بأمر واحد (Root Workspace)
من المجلد الرئيسي `PharmaMap`:
```bash
# تثبيت جميع الحزم للباك إند والفرونت إند
npm run install:all

# تشغيل الفرونت إند
npm run dev:frontend

# تشغيل الباك إند
npm run dev:backend
```

---

## 🌐 Deployment (النشر)

- **Backend:** جاهز للنشر على منصات مثل [Render](https://render.com/), [Railway](https://railway.app/), أو [Vercel Serverless Functions].
- **Frontend:** جاهز للنشر على [Vercel](https://vercel.com/) أو [Netlify](https://www.netlify.com/).

---

## 🤝 المساهمة (Contributing)

المساهمات مرحب بها دائماً! إذا كان لديك أي اقتراح أو تحسين:
1. قم بعمل **Fork** للمشروع.
2. أنشئ فرعاً لميزتك (`git checkout -b feature/AmazingFeature`).
3. سجّل التعديلات (`git commit -m 'Add some AmazingFeature'`).
4. ارفع الفرع (`git push origin feature/AmazingFeature`).
5. افتح **Pull Request**.

---

## 📄 الترخيص (License)

هذا المشروع مرخص تحت رخصة **ISC License**.

---

## 👨‍💻 المطور (Author)

تم التطوير بكل ❤️ بواسطة **[Ahmed Elfky](https://github.com/Ahmedelfky23)**.

- **GitHub:** [@Ahmedelfky23](https://github.com/Ahmedelfky23)
- **Project Repository:** [https://github.com/Ahmedelfky23/PharmaMap](https://github.com/Ahmedelfky23/PharmaMap)

<div align="center">
⭐ إذا أعجبك المشروع، لا تنسَ ترك نجمة (Star) على GitHub! ⭐
</div>

