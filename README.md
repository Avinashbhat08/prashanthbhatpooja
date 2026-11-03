# Shree Prashanth Bhat - Traditional Pooja Services & Samagri Management Platform

A modern, full-stack, responsive web application for a Hindu priest and traditional Vedic Pooja services business based in Bangalore North, Karnataka.

Featuring an authentic spiritual design palette (Saffron, Maroon, Warm Ivory, Sacred Gold), role-based access control, bilingual internationalization (English & ಕನ್ನಡ), custom Lord Ganesha and Sudarshana Chakra branding, and a high-fidelity client/server PDF generation engine that renders Kannada Unicode conjunct ligatures with 100% typographic fidelity.

---

## 🌟 Key Features

### 1. Spiritual & Responsive Design
- **Custom Sacred Branding**: SVG vector logo featuring Lord Ganesha surrounded by a 16-flame Sudarshana Chakra.
- **Traditional Color Palette**: Radiant Saffron (`#E65100`), Auspicious Maroon (`#7B1113`), Warm Ivory / Cream (`#FDFBF7`), and Temple Gold (`#D4AF37`).
- **Bilingual Typography**: Seamless rendering of English and Kannada using Google Fonts (*Noto Sans Kannada*, *Cinzel*, and *Inter*).
- **Mobile First**: Responsive layouts, compact cards for mobile checklists, touch-friendly checkboxes, and mobile navigation drawers.

### 2. Public Pages
- **Home Page**: Hero section with sacred Vedic Shloka (*Vakratunda Mahakaya...*), Purohit profile preview, configurable Pooja service cards (Satyanarayana Swamy Pooja, Grihapravesha, Maha Ganapathi Homam, Navagraha Shanti, Sudarshana Homam, Rudrabhisheka), gallery preview, and direct phone/Google Maps directions.
- **About Page**: Dedicated profile of Shree Prashanth Bhat, contact phone (`9242359692`), address in R.K. Hegde Nagar, Bangalore North, rituals performed, and one-click English/Kannada content toggle.
- **Photo Gallery**: Categorized photo grid (*Pooja Ceremonies*, *Homam*, *Festivals*, *Traditional Rituals*, *Other Events*) with responsive lightbox, bilingual captions, zoom, and keyboard navigation.

### 3. Protected Pooja Samagri Generator
- **Authenticated Access Only**: Strict backend and frontend route guards; unauthenticated visitors are automatically redirected to the login page.
- **Bilingual Search**: Search simultaneously across English item names and Kannada names (e.g. searching `ಅಕ್ಕಿ` or `Rice`, `ತೆಂಗಿನಕಾಯಿ` or `Coconut`).
- **Category Filtering**: Flowers & Garlands, Fruits, Pooja Essentials, Deepa & Lighting, Kalasha Items, Turmeric & Kumkum, Rice & Grains, Prasada Ingredients, Other Items.
- **Selection Controls**: Select All, Deselect All, Clear Selection, dynamic item count badge, and optional quantity adjustment per item.
- **Custom Item Addition**: Devotees can add custom items with both English and Kannada names on the fly.
- **Selection Persistence**: Selected items and quantities remain intact across category filtering and searching.

### 4. Professional Bilingual PDF Generation & Sharing
- **Filtered Output**: Generates an A4 PDF containing **only** the selected items.
- **Pooja Details (Sankalpa)**: Integrates Pooja Name, Date, Time, Yajamana Person Name, Gothra, Nakshatra, Contact Number, Location, and Special Notes.
- **Flawless Kannada Text Rendering**: Utilizes browser native text shaping with `html2canvas` (2x high-DPI scaling) and `jsPDF` to avoid broken conjunct ligatures (*vattakshara* and *matras*).
- **Branding Elements**: Header with Ganesha + Sudarshana Chakra logo, Shree Prashanth Bhat contact details, structured bilingual table (*No. | English Name | ಕನ್ನಡ ಹೆಸರು | Quantity*), sacred footer blessing (*ಲೋಕಾಃ ಸಮಸ್ತಾಃ ಸುಖಿನೋ ಭವಂತು*), and page numbers.
- **Native Sharing & WhatsApp Fallback**: Uses the Web Share API with a PDF file when supported; provides one-click WhatsApp sharing with prefilled details and automatic download.

### 5. Administrator Dashboard
- **Overview Metrics**: Total items, active items, categories, and gallery photos.
- **Pooja Items Management (CRUD)**: Create new items, edit English & Kannada names, adjust default quantities, assign categories, toggle active status, and delete with confirmation.
- **Category Management (CRUD)**: Add, edit, and delete categories with live item count association.
- **Gallery Management**: Upload images or link external photo URLs, add bilingual captions, categorize, and delete.
- **Website Content Settings**: Centralized management of Purohit name, phone number, address, and Google Maps URL.

### 6. Authentication & Security
- **Role-Based Access Control**: `ADMIN` and `USER` roles.
- **Backend Authorization**: Public registration always defaults to `USER` role; administrative endpoints are strictly guarded by `requireAdmin` middleware.
- **Password Security**: Passwords hashed with `bcryptjs` (salt rounds: 10).
- **JWT Authentication**: JSON Web Tokens with 7-day expiration.
- **Login Rate Limiting**: In-memory rate limiting preventing brute-force login attempts (lockout after 5 failed attempts).
- **Database Snapshots**: Pooja request items store snapshots of English and Kannada names so historical records remain unchanged even if master items are edited.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, React Router v6, Lucide React |
| **Forms & Validation** | React Hook Form, Zod, @hookform/resolvers |
| **PDF & Canvas** | jsPDF, html2canvas (High-DPI Unicode rendering) |
| **Backend** | Node.js, Express, TypeScript |
| **Database & ORM** | Prisma ORM with SQLite (Default / Zero-dependency) or PostgreSQL |
| **Security** | JWT, bcryptjs, CORS, Multer (File uploads), Rate limiting |

---

## 📂 Project Structure

```
Pooja/
├── package.json              # Root orchestration package
├── client/                   # Frontend Vite + React + TypeScript
│   ├── public/
│   │   ├── logo.svg          # Lord Ganesha & Sudarshana Chakra Logo
│   │   └── ...
│   ├── src/
│   │   ├── assets/           # Static assets
│   │   ├── components/
│   │   │   ├── common/       # Toast notifications, buttons
│   │   │   ├── gallery/      # Lightbox viewer
│   │   │   ├── layout/       # Navbar, Footer, ProtectedRoute
│   │   │   └── pooja/        # PoojaDetailsModal, PdfViewerModal
│   │   ├── contexts/         # AuthContext, LanguageContext
│   │   ├── i18n/             # English and Kannada translation dictionaries
│   │   ├── pages/            # Home, About, Samagri, Gallery, Login, Register, Admin
│   │   ├── services/         # API client
│   │   ├── types/            # TypeScript data contracts
│   │   ├── App.tsx           # Route definitions
│   │   ├── main.tsx          # React DOM entry
│   │   └── index.css         # Tailwind & print styles
│   ├── tailwind.config.js    # Spiritual theme extensions
│   ├── vite.config.ts        # Vite proxy for /api and /uploads
│   └── package.json
└── server/                   # Backend Express + TypeScript + Prisma
    ├── prisma/
    │   ├── schema.prisma     # Relational schema (SQLite / PostgreSQL)
    │   └── dev.db            # SQLite database file
    ├── src/
    │   ├── config/           # Environment configuration
    │   ├── middleware/       # Auth (JWT) & Admin authorization
    │   ├── routes/           # Auth, Items, Categories, Gallery, Requests, Settings
    │   ├── index.ts          # Express application entry
    │   ├── prisma.ts         # Prisma client singleton
    │   └── seed.ts           # Initial sample data seeder
    ├── uploads/              # Local storage for uploaded gallery images
    ├── .env                  # Environment secrets
    ├── .env.example          # Environment template
    └── package.json
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher (v24 LTS tested)
- **npm**: v9.0.0 or higher

### 1. Database Setup & Seeding
The backend is configured with SQLite by default for instant local execution without needing an external database server:

```powershell
# Navigate to the server directory
cd server

# Install dependencies (if not already installed)
npm install

# Generate Prisma Client and sync database schema
npx prisma generate
npx prisma db push

# Seed the database with users, categories, items, and settings
npm run seed
```

> **Using PostgreSQL instead:**
> In `server/prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"`. Update `DATABASE_URL` in `server/.env` to your PostgreSQL connection string (e.g. `postgresql://user:password@localhost:5432/poojadb?schema=public`), then run `npx prisma db push && npm run seed`.

### 2. Default Login Credentials

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Administrator** | `admin@poojaservices.com` | `admin123` | Full access to Admin Dashboard, item CRUD, translations, gallery, and settings |
| **Devotee / User** | `user@poojaservices.com` | `user123` | Access to Pooja Samagri generator, PDF download, and public pages |

*(One-click demo buttons are available on the Login page for immediate testing.)*

### 3. Running the Application

You can start the backend and frontend servers in separate terminals:

**Terminal 1 (Backend Server):**
```powershell
cd server
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```powershell
cd client
npm run dev
# Vite dev server starts on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## 🧪 Testing the Complete Workflow

1. **Public Browsing**:
   - Open `http://localhost:5173`.
   - Click the language toggle (`ಕನ್ನಡ` / `English`) in the top right to verify bilingual translations.
   - Navigate to **About Purohit** to review Shree Prashanth Bhat's details.
   - Navigate to **Gallery** to test category filters and click any image to test the lightbox viewer.
2. **Access Protection**:
   - Without logging in, click **Pooja Samagri** in the navigation.
   - Observe automatic redirection to `/login` with an informational notice.
3. **Login**:
   - Click the **Devotee Demo** button (or enter `user@poojaservices.com` / `user123`).
   - Click **Sign In**. You will be securely logged in and redirected back to `/samagri`.
4. **Pooja Samagri Checklist**:
   - Search for `ಅಕ್ಕಿ` or `Flowers`.
   - Toggle category pills (e.g. *Turmeric and Kumkum*, *Prasada Ingredients*).
   - Select and deselect items with checkboxes; watch the item counter update in real time.
   - Click **Add Custom Item** to add a custom bilingual item (e.g. *Copper Plate / ತಾಮ್ರದ ತಟ್ಟೆ*).
5. **PDF Generation & Sharing**:
   - Click **Generate PDF**.
   - Review and fill in the required fields (Pooja Name, Date, Time, Person Name) and optional fields (Gothra, Nakshatra, Location).
   - Click **Generate Official PDF**.
   - Inspect the generated document: verify Ganesha & Sudarshana Chakra logo, Purohit contact details, only selected items, and sharp Kannada Unicode typography.
   - Click **Download PDF** to save the `.pdf` file.
   - Test **Share via WhatsApp** to verify prefilled messaging.
6. **Admin Dashboard**:
   - Log out, then log in using **Admin Demo** (`admin@poojaservices.com` / `admin123`).
   - Click the **Admin Dashboard** button in the navbar.
   - Test adding, editing, or deleting Pooja items and categories.
   - Update Purohit website settings and save.

---

## 🔒 Security Best Practices Implemented

- **Password Hashing**: Strong bcrypt salt hashing.
- **Server-Side Authorization**: Endpoints `/api/pooja-items` (write), `/api/categories` (write), `/api/gallery` (write), and `/api/settings` (write) enforce `requireAdmin`.
- **Role Tampering Prevention**: The registration endpoint explicitly ignores client-supplied roles and always assigns `USER`.
- **Brute Force Protection**: IP & account based exponential delay after repeated failed logins.
- **Input Validation**: Robust schema validation using Zod on both client and server.
- **XSS & Injection Protection**: Parameterized queries via Prisma ORM and sanitization of user text before rendering in PDF.

---

## 🏛️ Deployment Instructions

### Production Build
```powershell
# Build frontend bundle
cd client
npm run build

# Build backend
cd ../server
npm run build
```

### Static Hosting & Reverse Proxy
- **Frontend**: The `client/dist` directory contains static assets ready for deployment on Nginx, Vercel, Netlify, or AWS S3/CloudFront.
- **Backend**: Run `node dist/index.js` using a process manager like **PM2** (`pm2 start dist/index.js --name pooja-server`).
- **Nginx Config Example**:
  ```nginx
  server {
      listen 80;
      server_name yourpoojadomain.com;

      location / {
          root /var/www/pooja/client/dist;
          try_files $uri $uri/ /index.html;
      }

      location /api {
          proxy_pass http://localhost:5000;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
      }

      location /uploads {
          proxy_pass http://localhost:5000;
      }
  }
  ```

---

## 🙏 Credits & Blessings
- **Priest**: Shree Prashanth Bhat (ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್)
- **Phone**: 9242359692
- **Location**: R.K. Hegde Nagar, Bangalore North, Karnataka - 560077
- **Blessing**: *ಲೋಕಾಃ ಸಮಸ್ತಾಃ ಸುಖಿನೋ ಭವಂತು* (May all beings everywhere be happy and peaceful).

