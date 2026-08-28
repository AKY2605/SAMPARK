# 🏛️ Sampark (सम्पर्क) — Varanasi Civic Issue Portal

[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Deploy Status](https://img.shields.io/badge/Deploy-GitHub_Pages-22C55E?logo=github&logoColor=white)](https://AKY2605.github.io/SAMPARK/)

**Sampark (सम्पर्क)** is a modern, transparent, and information-dense civic issue reporting and SLA resolution platform built for citizens and officials of **Varanasi Nagar Nigam (Uttar Pradesh)**. Inspired by centralized municipal portals, it provides a single window to report civic grievances, track SLA progress in real time, view live map data, verify resolution photos, and reward citizen participation.

---

## 🌟 Key Features

- 🗺️ **Interactive Live Civic Map**: Filter issues by category (*Roads, Drainage, Garbage, Streetlights, Water*) and status (*Pending, In Progress, Resolved, SLA Breached*) over Varanasi landmarks including **BHU Lanka Gate**, **Varanasi Cantt Station**, **Godowlia Chowk**, **Dashashwamedh**, **Sigra Stadium**, and the **Holy Ganga River**.
- 📍 **3-Step Geo-Tagged Issue Reporting**: Simple step-by-step reporting with auto-location detection, latitude/longitude capture, photo upload, category tagging, and severity selection.
- ⏱️ **SLA Monitoring & Auto-Escalation**:
  - Garbage: **12 Hours** (Monsoon Drive)
  - Drainage & Water: **24 Hours**
  - Roads & Potholes: **48 Hours**
  - Tickets exceeding SLA are automatically flagged as **SLA Breached** and escalated to the **Municipal Commissioner**.
- 🔍 **Real-Time Ticket Tracking (`VNS-20481`)**: Complete timeline visualization (`Reported` → `Assigned` → `In Progress` → `Resolved` → `Verified`) with citizen verification voting ("Issue Fixed" or "Still a Problem").
- 🏛️ **Municipal Admin Dashboard**: Officer view for Department heads (*PWD Roads, Sanitation, Electrical, Jal Nigam*) to reassign tickets, update SLA progress, and post resolution notes.
- 📢 **Official Municipal Announcements**: Official notices regarding monsoon drainage clearance, road repairs, and LED streetlight replacement drives.
- 🤝 **Civic Finance & Community Fund**: Transparent breakdown of annual government budget allocations (*AMRUT 2.0, SBM-U, Smart City*) alongside a citizen-powered Community Fund pool.
- 🎖️ **Citizen Impact Rewards & Certificates**: Community upvoting system with tier ranks (*Active Citizen* → *Civic Champion* → *Varanasi Shield*), brand discount vouchers, and printable **Certificates of Civic Contribution**.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 19, TypeScript 5.7
- **Styling & UI**: Tailwind CSS v4 (`@tailwindcss/vite`), Custom CSS Design Tokens
- **Build System**: Vite 8 with React & Tailwind plugins
- **Icons & Visuals**: Inline SVG, GitHub Alert Markdown Tokens, Standard Icons

---

## 🚀 Local Setup & Installation

Follow these steps to run the application locally on your machine:

```bash
# 1. Clone the repository
git clone https://github.com/AKY2605/SAMPARK.git

# 2. Navigate into the project folder
cd SAMPARK

# 3. Install dependencies
npm install

# 4. Start the Vite development server
npm run dev
```

Open `http://localhost:8443` or `http://localhost:5173` in your browser.

### Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with Hot Module Reloading (HMR) |
| `npm run build` | Compiles production assets into the `dist/` directory |
| `npm run preview` | Previews the compiled production build locally |
| `npx tsc --noEmit` | Verifies TypeScript types without emitting code |

---

## 📦 How to Upload & Host on GitHub (`AKY2605`)

Follow these instructions to push this project to your GitHub profile and host it live via **GitHub Pages**:

### Step 1: Initialize Git and Commit All Files

Open your terminal inside the project root folder (`SAMPARK`) and run:

```bash
git init
git add .
git commit -m "Feat: Complete Sampark Varanasi Civic Portal setup"
```

### Step 2: Create a Repository on GitHub

1. Go to [GitHub New Repository](https://github.com/new).
2. Name your repository: `SAMPARK` (or `sampark-varanasi`).
3. Keep it **Public**.
4. Do **NOT** initialize with a README (we already created one).
5. Click **Create repository**.

### Step 3: Connect Local Repository & Push Code

Run the following commands in your terminal (replace `AKY2605` if needed):

```bash
git branch -M main
git remote add origin https://github.com/AKY2605/SAMPARK.git
git push -u origin main
```

---

## 🌐 How to Turn On Free Live Hosting (GitHub Pages)

### Method A: Automated GitHub Actions (Recommended)

This repository includes `.github/workflows/deploy.yml` which automatically builds and deploys your website on every `push`.

1. Go to your repository on GitHub: `https://github.com/AKY2605/SAMPARK`
2. Click **Settings** → **Pages** (in the left sidebar).
3. Under **Build and deployment** → **Source**, select **GitHub Actions**.
4. Wait 1–2 minutes for the workflow to complete.
5. Your website will be live at: **`https://AKY2605.github.io/SAMPARK/`**

### Method B: Manual Static Hosting (Vercel / Netlify)

If you prefer Vercel or Netlify:
- **Vercel**: Import repository `AKY2605/SAMPARK` → Framework Preset: **Vite** → Deploy.
- **Netlify**: Import repository `AKY2605/SAMPARK` → Build Command: `npm run build` → Publish directory: `dist`.

---

## 📄 License

This project is licensed under the MIT License. Created as a prototype civic demonstration portal for **Varanasi Nagar Nigam**.
