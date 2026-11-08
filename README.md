<div align="center">

# 📍 PharmaMap Egypt

**A modern, full-stack GIS web application designed to locate, navigate, and review pharmacies across Egypt in real time.**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

[Features](#-key-features) • [Tech Stack](#-tech-stack) • [System Architecture](#-system-architecture) • [Database Schema](#-database-schema) • [API Documentation](#-api-endpoints) • [Getting Started](#-getting-started) • [Deployment](#-deployment)

</div>

---

## 📖 Overview

**PharmaMap Egypt** is an interactive, location-based web platform built to help citizens and visitors across Egypt quickly find nearby pharmacies, inspect contact details and working hours, navigate along turn-by-turn road routes, and share community reviews.

The platform combines extensive geospatial data imported from **OpenStreetMap (Overpass API)** with verified crowdsourced contributions from users. Engineered for speed and scale, PharmaMap employs viewport bounding-box database queries, marker clustering, dark/light map theming, and an automated keep-alive mechanism to eliminate cold-start latencies on cloud hosting.

---

## ✨ Key Features

### 🗺️ 1. Interactive High-Performance Map
- **Smooth Leaflet Map Engine:** Built with Leaflet and React-Leaflet with responsive zoom, panning, and fly-to transitions.
- **Custom Marker Clustering:** Uses `react-leaflet-cluster` with custom pop-out badges to render thousands of pharmacies smoothly without UI freezing or frame drops.
- **Color-Coded Custom Pins:**
  - 🟢 **Green:** Verified pharmacies imported from OpenStreetMap.
  - 🔴 **Red:** Community-added pharmacies submitted by platform users.
  - 🔵 **Pulsing Blue Ring:** Live, high-precision GPS marker for the user's current location.

### 🧭 2. Real-Time Geolocation & Route Navigation
- **Live GPS Tracking:** Continuously tracks user movement using the HTML5 Geolocation Watch API with high accuracy.
- **Haversine Distance Engine:** Calculates precise mathematical distances (in kilometers) between user coordinates and all nearby pharmacies.
- **Automated Nearest Pharmacy Finder:** Instantly computes and flags the closest available pharmacy relative to the user.
- **Turn-by-Turn Road Routing (OSRM):** Fetches real driving routes from the Open Source Routing Machine and renders a live, styled polyline from the user straight to the destination pharmacy.

### 🔍 3. Viewport-Based Spatial Queries & Instant Search
- **Bounding-Box Optimization:** Instead of loading tens of thousands of records, the backend queries only the pharmacies visible within the map's current bounding coordinates (`north, south, east, west`).
- **Instant Search:** Search across Arabic and English pharmacy names or chain brands (e.g., El-Ezaby, Seif, Roshdy, 19011).

### 🏥 4. Complete Pharmacy Management (CRUD)
- **Map-Click Addition:** Click anywhere on the map to drop a pin and register a new pharmacy.
- **Comprehensive Metadata:** Record pharmacy name, chain/brand, full street address, contact phone, website, opening hours (including 24/7 flags), exterior/interior photo URL, and notes.
- **Edit & Delete:** Update existing pharmacy details or remove obsolete entries with a confirmation guard.

### ⭐ 5. Community Rating & Review System
- Full CRUD system for reviews on every pharmacy.
- Star rating mechanism (1 to 5 stars) with rich text feedback.
- Real-time aggregation showing average customer ratings and total review counts.
- Edit and delete permissions for existing reviews.

### 📱 6. Modern Responsive UI / UX
- **Native Dark & Light Mode:** Seamless theme switching with persistent state saved in `localStorage`, complete with tailored map tiles (CartoDB Light & Dark Matter).
- **Responsive Layout:**
  - **Desktop:** Elegant side-by-side view with an interactive map on the left and a detail drawer on the right.
  - **Mobile:** Fullscreen map with a swipeable, draggable Bottom Sheet drawer.
- **Photo Lightbox Modal:** Click any pharmacy image to view it in high resolution with backdrop blur.
- **Quick Action Triggers:** One-click direct phone call (`tel:`), Google Maps directions redirect, and instant shareable URL copy.

### ⚡ 7. Performance & Zero Cold Starts
- **Keep-Alive Ping Service:** Background interval pinging `/ping` every 13 minutes to keep free-tier backend instances (such as Render) warm and ready.
- **Optimized Networking:** Gzip response compression (`compression` middleware) and Prisma DB connection pre-warming on boot.

### 📥 8. Automated Mass Data Ingestion (OpenStreetMap)
- Standalone CLI importer (`scripts/importOsm.js`) executing Overpass QL queries across all Egypt administrative zones with multi-endpoint fallback and upsert deduplication.
- Secure HTTP Admin endpoint (`/api/pharmacies/admin/import-osm`) protected by `x-admin-secret` for triggering background synchronization.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | `19.2` | Core UI library, hooks, and reactive state management |
| **Vite** | `8.2` | Next-generation frontend tooling and rapid HMR development server |
| **Tailwind CSS** | `4.3` | Utility-first CSS framework with native dark mode support |
| **Leaflet** | `1.9` | Mobile-friendly interactive mapping library |
| **React-Leaflet** | `5.0` | React component bindings for Leaflet maps |
| **React-Leaflet-Cluster** | `4.1` | Efficient marker clustering for large datasets |
| **OSRM API** | *v1* | Open Source Routing Machine for polyline route calculations |
| **Axios** | `1.19` | Promise-based HTTP client with request interceptors |

### Backend
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | `18+` | Server runtime environment |
| **Express** | `5.2` | RESTful API web application framework |
| **Prisma ORM** | `6.19` | Type-safe database client and schema migrations |
| **PostgreSQL** | `16+` | Relational database (Supabase / Render / Neon) |
| **Overpass API** | *v0.7* | OpenStreetMap geospatial query engine |
| **Compression & CORS** | *Latest* | Gzip payload compression and cross-origin security |

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    User["👤 Client / Web Browser"]

    subgraph Frontend ["💻 Frontend (React 19 + Vite + Tailwind v4)"]
        UI["UI Components & Navigation"]
        Map["Leaflet Map Engine"]
        Clusters["Marker Clusters"]
        Geo["Geolocation Watcher"]
    end

    subgraph External ["🌐 External APIs & Services"]
        OSRM["OSRM Routing Engine"]
        Tiles["CartoDB Map Tiles (Light / Dark)"]
        Overpass["Overpass OSM API (Egypt Pharmacies)"]
    end

    subgraph Backend ["⚙️ Backend (Node.js + Express 5)"]
        API["REST API Router"]
        Controllers["Controllers (Bounds & Haversine Filter)"]
        Importer["OSM Ingestion Script"]
        Prisma["Prisma ORM"]
    end

    subgraph Database ["🗄️ Database"]
        Postgres[("PostgreSQL Database (Supabase / Render)")]
    end

    User --> UI
    UI --> Map
    Geo --> Map
    Map <--> Tiles
    Map <--> OSRM
    Map --> Clusters
    UI <--> API
    API --> Controllers
    Controllers <--> Prisma
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
│   │   ├── schema.prisma       # Prisma database models (Pharmacy & Review)
│   │   └── migrations/         # Database migration history
│   ├── scripts/
│   │   └── importOsm.js        # Script to import thousands of pharmacies via Overpass API
│   ├── src/
│   │   ├── controllers/
│   │   │   └── pharmacyController.js # Viewport queries, spatial bounds, search, & CRUD
│   │   ├── routes/
│   │   │   ├── pharmacyRoutes.js     # /api/pharmacies route definitions
│   │   │   └── reviewRoutes.js       # /api/reviews route definitions
│   │   └── index.js            # Express app, compression, CORS, and keep-alive ping
│   ├── .env.example            # Backend environment variables template
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── bg.png              # Background graphic
│   │   ├── logo.png            # PharmaMap logo
│   │   └── favicon.svg         # Tab favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddPharmacyButton.jsx   # Map button to enter coordinate-drop mode
│   │   │   ├── AddPharmacyForm.jsx     # Modal form for adding/editing a pharmacy
│   │   │   ├── AddPharmacyMapClick.jsx # Map event listener to capture clicked coords
│   │   │   ├── LocationPermission.jsx  # Welcome onboarding modal for location permissions
│   │   │   ├── Map.jsx                 # Leaflet map container, clusters, routing, markers
│   │   │   ├── Navbar.jsx              # Header with logo, live stats, and theme toggle
│   │   │   ├── SearchBar.jsx           # Search input with debounce support
│   │   │   └── Sidebar.jsx             # Detailed drawer for pharmacy info & reviews
│   │   ├── services/
│   │   │   └── api.js          # Axios client instance with cache-busting
│   │   ├── App.jsx             # Main layout, live location tracking, and state
│   │   ├── main.jsx            # Application mount point
│   │   └── index.css           # Tailwind v4 configuration & animations
│   ├── .env.example            # Frontend environment variables template
│   └── package.json
│
├── .gitignore                  # Git exclusions (ignores .env and node_modules)
├── package.json                # Root workspace scripts to control both projects
└── README.md                   # Project documentation
```

---

## 🗄️ Database Schema

The database is built on **PostgreSQL** and modeled with **Prisma ORM**:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

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
  pharmacyId String   // Formatted as "db-{id}" or "osm-{id}"
  rating     Int      // Integer from 1 to 5
  text       String
  createdAt  DateTime @default(now())
}
```

---

## 🔌 API Endpoints

### 🏥 Pharmacies (`/api/pharmacies`)
| Method | Endpoint | Query / Body Params | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/pharmacies` | `?north=&south=&east=&west=&search=` | Retrieve pharmacies filtered by current map viewport bounds and/or keyword search |
| `GET` | `/api/pharmacies/nearby` | `?lat=&lng=&radius=` | Retrieve pharmacies within a specific radius (in meters) from coordinates |
| `POST` | `/api/pharmacies` | JSON Body (Pharmacy fields) | Create a new community-added pharmacy |
| `PUT` | `/api/pharmacies/:id` | JSON Body (Updated fields) | Update an existing pharmacy's information |
| `DELETE` | `/api/pharmacies/:id` | None | Remove a pharmacy from the database |
| `POST` | `/api/pharmacies/admin/import-osm` | Header: `x-admin-secret` | Trigger background import of Egypt pharmacies from OpenStreetMap |

### ⭐ Reviews (`/api/reviews`)
| Method | Endpoint | Query / Body Params | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/reviews/:pharmacyId` | None | Get all reviews for a pharmacy, ordered by newest first |
| `POST` | `/api/reviews/:pharmacyId` | `{ "rating": 5, "text": "Great service!" }` | Submit a new review and rating |
| `PUT` | `/api/reviews/:pharmacyId/:reviewId` | `{ "rating": 4, "text": "Updated text" }` | Edit an existing review |
| `DELETE` | `/api/reviews/:pharmacyId/:reviewId` | None | Delete a review |

### 💓 Health Check & Ping
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/ping` | Returns `{ "status": "ok", "ts": ... }` immediately to prevent server cold starts |

---

## 🚀 Getting Started

Follow the steps below to set up and run PharmaMap Egypt locally on your machine:

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
- **Git**: Installed on your system ([Download Git](https://git-scm.com/))
- **PostgreSQL Database**: A local instance or a free cloud-hosted instance (e.g., [Supabase](https://supabase.com/), [Neon](https://neon.tech/), or [Render](https://render.com/)).

---

### 2. Clone the Repository
```bash
git clone https://github.com/Ahmedelfky23/PharmaMap.git
cd PharmaMap
```

---

### 3. Backend Setup
Navigate to the `backend` directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` by copying the example:
```bash
cp .env.example .env
```

Configure your PostgreSQL connection strings in `.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/pharmamap?schema=public"
DIRECT_URL="postgresql://username:password@localhost:5432/pharmamap?schema=public"
PORT=5000
ADMIN_SECRET="your-secure-admin-secret"
```

Push the Prisma schema to your database to generate tables and Prisma client:
```bash
npx prisma db push
```

*(Optional)* Import real pharmacies across Egypt from OpenStreetMap:
```bash
node scripts/importOsm.js
```

Start the backend development server:
```bash
npm run dev
```
The backend API will run at `http://localhost:5000`.

---

### 4. Frontend Setup
In a new terminal window, navigate to the `frontend` directory and install dependencies:
```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```
The frontend application will be live at `http://localhost:5173`.

---

### ⚡ Run Entire Project from Root
From the root `PharmaMap` directory, you can also use the workspace scripts:
```bash
# Install dependencies for both frontend and backend
npm run install:all

# Start backend dev server
npm run dev:backend

# Start frontend dev server
npm run dev:frontend
```

---

## 🌐 Deployment

- **Backend:** Ready for deployment on [Render](https://render.com/), [Railway](https://railway.app/), or any Node.js container hosting.
- **Frontend:** Ready for zero-config deployment on [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. **Fork** the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'feat: add AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a **Pull Request**.

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Author

Developed with ❤️ by **[Ahmed Elfky](https://github.com/Ahmedelfky23)**.

- **GitHub:** [@Ahmedelfky23](https://github.com/Ahmedelfky23)
- **Repository:** [https://github.com/Ahmedelfky23/PharmaMap](https://github.com/Ahmedelfky23/PharmaMap)

<div align="center">
⭐ If you find this project useful, please consider giving it a star on GitHub! ⭐
</div>
