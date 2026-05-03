# 🩸 RaktSetu — Real-Time Blood Donor Finder

> **"Ek Boond, Ek Zindagi"** — One Drop, One Life

RaktSetu (meaning "Blood Bridge" in Gujarati) is an AI-powered real-time blood donor finder web app built for Gujarat, India. It connects patients in need with verified blood donors instantly.

🌐 **Live Demo:** [raktsetu-blood-bridge.vercel.app](https://raktsetu-blood-bridge.vercel.app)

---

## ✨ Features

- 🔍 **Find Donors** — Search by blood type, city, and urgency
- 🚨 **SOS Alerts** — One-click emergency blood requests
- 🗺️ **Donor Map** — Live map showing nearby donors
- 🌡️ **Blood Heatmap** — City-wise blood availability heatmap
- 🏆 **Leaderboard** — Top donors recognition podium
- 📋 **Blood Requests** — Live requests with WhatsApp share
- ✅ **Donor Registration** — Simple donor registration form
- 🔐 **Admin Dashboard** — Password protected admin panel

---

## 🏙️ Supported Cities

Ahmedabad, Surat, Vadodara, Rajkot, Gandhinagar, Anand, Mehsana

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| React + TypeScript | Frontend |
| TanStack Start | SSR Framework |
| TanStack Router | Routing |
| Tailwind CSS | Styling |
| Supabase | Database |
| Leaflet + OpenStreetMap | Maps |
| Vercel | Deployment |
| Lucide React | Icons |

---

## 🗄️ Database Schema

```sql
donors: id, name, blood_type, phone, city, available, donations_count, verified
blood_requests: id, patient_name, blood_type, hospital, city, urgency, contact_phone, status
sos_alerts: id, blood_type, hospital, contact_phone, status
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repo
git clone https://github.com/hetpatel7-coder/raktsetu-blood-bridge.git

# Go into the folder
cd raktsetu-blood-bridge

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📁 Project Structure
src/
├── routes/          # All pages (TanStack Router)
│   ├── index.tsx    # Home page
│   ├── find.tsx     # Find donors
│   ├── register.tsx # Donor registration
│   ├── requests.tsx # Blood requests
│   ├── map.tsx      # Donor map
│   ├── heatmap.tsx  # Blood heatmap
│   ├── leaderboard.tsx # Top donors
│   └── admin.tsx    # Admin dashboard
├── components/      # Reusable components
├── integrations/    # Supabase client
└── styles.css       # Global styles

---

## 🎨 Design System

| Token | Value |
|---|---|
| Background | `#080808` |
| Cards | `#111111` |
| Primary Red | `#dc2626` |
| Text | `#f5f5f0` |
| Success | `#22c55e` |
| Gold | `#f59e0b` |

---

## 👨‍💻 Developer

**Het Patel**
- GitHub: [@hetpatel7-coder](https://github.com/hetpatel7-coder)

---

## 📄 License

MIT License — feel free to use and contribute!

---

<p align="center">Made with ❤️ for Gujarat 🩸</p>