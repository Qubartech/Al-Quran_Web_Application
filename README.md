# 📖 Al-Quran Application (Next.js)

A modern, feature-rich, interactive web application built with **Next.js (App Router)**, **Tailwind CSS**, and **Prisma & Supabase** for reading, searching, exploring, and listening to the Holy Quran.

---

## ✨ Features

- 📖 **Surah Directory**: Browse all 114 Surahs with Meccan/Medinan tags, English translations, verse counts, audio playback, and instant search/sorting.
- 📚 **Juz Directory**: Explore the 30 partitions (Paras) of the Holy Quran with starting/ending verse details, quick audio play, and list/grid views.
- 🎨 **Premium Sidebar UI**: Sleek glassmorphic sidebar featuring active route highlighting, smooth transition states, search query clearing, and automatic scroll-to-view of active items.
- 🎧 **Centralized Dynamic Audio Streaming**: Dynamic chapter and segment streaming fetched on-the-fly from the Quran.com API, eliminating hardcoded local audio files.
- 🎙️ **Dynamic Reciter Controls**: Settings drawer and Profile modal allow changing reciters in real-time. Choices are fetched dynamically from the Quran.com resources API.
- 🔄 **Profile & Settings Sync**: Settings (Theme, Translation Language, Edition, Font Size, and Reciter Preference) are stored in cookies (preventing layout shift) and synced directly to the user's database profile when authenticated.
- 🔍 **Dynamic Text Scaling**: Responsive sliding controls for both Translation and Arabic font sizes that dynamically update both normal reading and word-by-word layouts in real-time.
- 🕌 **Prayer Times (Namaz)**: Live calculation of Islamic daily prayer schedules.
- 🔍 **Global Search**: Quick search modal for finding Surahs, Juz, and Ayahs instantly.
- 📌 **Bookmarks & Favorites**: Track recent activity, save favorite Ayahs, and manage bookmarks (backed by Prisma/Supabase).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 13+ (App Router)](https://nextjs.org/)
- **UI & Styling**: [Tailwind CSS](https://tailwindcss.com/), Lucide Icons, Radix UI primitives
- **Database & Auth**: [Prisma ORM](https://www.prisma.io/), PostgreSQL / [Supabase](https://supabase.com/)
- **State & Audio**: React Context API (`AudioProvider`, `UserProvider`)

---

## 🚀 Getting Started

### 1. Prerequisites

Make sure you have Node.js (v18+) installed on your machine.

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/TahirAhmad01/Quran_Application_With_NextJs.git
cd Quran_Application_With_NextJs
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory and set up your Supabase & database connection strings:

```env
DATABASE_URL="your-postgresql-database-url"
DIRECT_URL="your-direct-database-url"
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the app.

---

## 📦 Scripts

- `npm run dev` — Starts the development server
- `npm run build` — Runs Prisma code generation and builds the application for production
- `npm run start` — Starts the production server
- `npm run lint` — Runs ESLint code quality check

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).