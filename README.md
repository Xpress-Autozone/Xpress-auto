# Xpress Autozone - E-commerce Platform

A modern, high-performance automotive parts marketplace designed for speed, discoverability, and ease of use. This platform serves as the primary customer-facing interface for the Xpress Autozone ecosystem.

## ✨ Key Features

### 1. Smart Discovery & Search
- **Faceted Search**: Powerful search engine with dynamic filtering for **Price Range**, **Brand**, **Condition**, and **Part Type**.
- **Contextual Results**: Results are grouped by relevance and stock status.
- **Deep Category Navigation**: Specialized landing pages for the 8 canonical automotive categories (Body & Parts, Engine, etc.).

### 2. Premium UX/UI
- **Fluid Animations**: Implemented with `Framer Motion` for smooth transitions and interactive feedback.
- **Skeleton Loading**: Professional loading states to minimize perceived latency.
- **Responsive Design**: Mobile-first architecture ensured across all pages.

### 3. PWA (Progressive Web App)
- **Installable**: Full support for PWA installation on iOS and Android devices.
- **Custom Branding**: Specialized browser icons and app manifests for a native look and feel.
- **Optimization**: Fast Refresh and asset caching via Vite.

### 4. Interactive Services
- **Real-time Availability**: Direct integration with the inventory backend.
- **Service Booking**: (Onboarding) Specialized flow for vehicle identification and personalized maintenance.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 (Vite) |
| **State Management** | Redux Toolkit |
| **Animations** | Framer Motion |
| **Styling** | TailwindCSS |
| **Icons** | Lucide React |
| **PWA Support** | Web App Manifest / Service Workers |

---

## 📦 Getting Started

### Prerequisites
- Node.js `v18+`
- npm or yarn

### Installation
1. Navigate to the app directory:
   ```bash
   cd xpress-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### API Configuration
The frontend communicates with the centralized backend API at:
`https://xpress-backend-eeea.onrender.com`

---

## 🌍 Deployment
The application is optimized for deployment on Vercel or GitHub Pages, with automated CI/CD integrated for the `main` branch.

---
© 2026 Xpress Autozone. All rights reserved.
