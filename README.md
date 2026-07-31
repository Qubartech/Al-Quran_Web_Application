# 📖 Al-Quran Application (Next.js 13+ App Router)

A state-of-the-art, feature-rich, interactive web application built with **Next.js (App Router)**, **Tailwind CSS**, **Prisma ORM**, and **Supabase** for reading, searching, exploring, listening to, and learning the Holy Quran.

---

## ✨ Key Features

### 🕌 1. Surah & Juz Reading Experience
- 📖 **Surah Directory**: Browse all 114 Surahs with Meccan/Medinan tags, English translations, verse counts, quick audio playback, and instant search/filtering.
- 🎨 **Grand Islamic Hero Banner**: Majestic header with Rub el Hizb 8-pointed star geometric pattern backdrop, Mihrab arch silhouettes, gradient Arabic calligraphy, and a 1-click **"Play Full Surah"** button.
- 📚 **Juz / Para Directory**: Explore all 30 partitions (Paras) with starting/ending verse keys, quick audio play, and responsive grid views.
- ✨ **Text-Only Active Word Highlight**: Synchronized audio word-by-word highlight featuring a vibrant emerald text glow without bulky container boxes.
- 🌐 **Word Meaning Tooltips & User Toggle**: Auto-popup translation & transliteration tooltips during recitation with full user toggle control (accessible via the Floating Audio Player toolbar and the Settings Drawer).

### 🎓 2. Comprehensive Quran Learning Academy (`/learn`)
- 🏆 **8 Complete Academy Levels (33 Curriculum Modules)**:
  - **Level 1**: *Arabic Alphabets & Qaida* (All 28 Arabic letters with vocal tract Makharij articulation tips across interactive slides).
  - **Level 2**: *Essential Tajweed Rules* (Ghunnah, Noon Sakinah, Meem Sakinah, Qalqalah, Madd).
  - **Level 3**: *Quranic Vocabulary & Roots* (Top 100 high-frequency Quranic words & root verbs).
  - **Level 4**: *Quranic Arabic Grammar* (Nouns, Verbs, Particles, Pronouns, Sentence Structures).
  - **Level 5**: *Tafseer & Contextual Study* (Asbab al-Nuzul, Surah themes, and historical contexts).
  - **Level 6**: *Hifz & Memorization Techniques* (Spaced repetition, visual page anchoring, revision loops).
  - **Level 7**: *Advanced Qira'at & Variant Recitations* (The 10 Mutawatir Qira'at, Warsh vs. Hafs, Shatibiyyah rules, and Isnad chains).
  - **Level 8**: *Advanced Quranic Rhetoric & Eloquence (Balagha)* (Ilm al-Bayan metaphors, Ilm al-Ma'ani word order emphasis/Taqdeem, and structural I'jaz inimitability).
- ✍️ **130+ Interactive Quiz Questions**: Comprehensive multi-choice quizzes with instant feedback, explanations, retry mechanisms, and academy score counters.
- 📚 **Collapsible Reference Library**: Collapsible resource section showcasing 4 curriculum resource categories (Tajweed foundations, Quranic vocabulary, Tafseer context, and digital datasets).

### 🎧 3. Centralized Audio & Player Controls
- ⚡ **Instant Synchronous Audio Playback**: Direct Reciter CDN mapping ensures instant playback on user clicks, completely bypassing browser autoplay policy restrictions.
- 🔄 **Reciter Hot-Swapping**: Seamlessly change reciters mid-verse without losing your current audio timestamp or position.
- 🎵 **Floating Audio Player**: Glassmorphic player card with timeline seeking, repeat loop, speed controls (`0.5x` to `2x`), volume slider, and word tooltip auto-popup toggle button.

### ⚙️ 4. Personalization & Settings
- 🎨 **Theme Toggle**: Light, Dark, and System preference support with zero FOUC.
- 🌐 **Language & Translation Selection**: Multi-language translations fetched dynamically from Quran.com API.
- 🔤 **Dynamic Font Resizing**: Independent sliders for Arabic script size and Translation font size.
- 🔄 **Settings Persistence & Sync**: Settings persist via cookies and `localStorage`, automatically syncing to PostgreSQL database profiles when logged in.
- 📱 **RTL-Optimized Mobile Layout**: Right-aligned action controls on mobile screens matching natural Arabic Right-to-Left reading flow.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 13+ (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), Vanilla CSS design system, Lucide Icons
- **Database & Auth**: [Prisma ORM](https://www.prisma.io/), PostgreSQL / [Supabase](https://supabase.com/)
- **State Management**: React Context API (`AudioProvider`, `UserProvider`)
- **API Integration**: Quran.com API v4 (Verses, Translations, Recitations, Segments)

---

## 🚀 Getting Started

### 1. Prerequisites

Node.js (v18+) and npm/yarn installed on your machine.

### 2. Installation

```bash
git clone https://github.com/TahirAhmad01/Quran_Application_With_NextJs.git
cd Quran_Application_With_NextJs
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

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

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 📦 Scripts

- `npm run dev` — Starts dev server (`localhost:3000`)
- `npm run build` — Runs Prisma code generation and builds production bundle
- `npm run start` — Starts production server
- `npm run lint` — Runs ESLint checks

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).