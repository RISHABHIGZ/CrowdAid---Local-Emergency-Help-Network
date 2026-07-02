# 🚨 CrowdAid — Local Emergency Help Network

> A production-grade full-stack platform connecting people in emergencies with verified local volunteers in real time.

![CrowdAid](https://img.shields.io/badge/CrowdAid-Emergency%20Help%20Network-red?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green?style=flat-square&logo=springboot)
![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=java)

---

## 🌟 Features

- 🔐 JWT Authentication (Register / Login / Roles: USER, HELPER, ADMIN)
- 🚨 Real-time emergency broadcasting via WebSocket / STOMP
- 📍 Location-aware helper matching using Haversine formula
- 🗺️ Live map with OpenStreetMap + Leaflet
- 🤖 AI urgency classifier (keyword-weighted severity scoring)
- 📊 Admin analytics dashboard with charts
- ⭐ Trust score & ratings system
- 🔔 Real-time notifications
- 🌙 Dark / Light mode
- 📱 Fully responsive (mobile, tablet, desktop)

## 🛠️ Tech Stack

**Frontend:** React 19, TypeScript, Tailwind CSS, Framer Motion, Recharts, React Leaflet, Zustand, React Query

**Backend:** Java 21, Spring Boot 3.2, Spring Security, JWT, WebSocket/STOMP, Spring Data JPA, MySQL, Flyway

## 🚀 Quick Start

### Prerequisites
- Java 21
- Maven 3.9+
- MySQL 8+
- Node.js 18+

### Backend
```bash
cd backend
# Edit src/main/resources/application.yml with your DB credentials
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:3000
```

### Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@crowdaid.com | Admin@123 |
| Helper | helper@crowdaid.com | Helper@123 |

## 📁 Project Structure

```
CrowdAid/
├── backend/                  # Spring Boot API
│   └── src/main/java/com/crowdaid/
│       ├── controller/       # REST controllers
│       ├── service/          # Business logic
│       ├── repository/       # JPA repositories
│       ├── entity/           # JPA entities
│       ├── dto/              # Request/Response DTOs
│       ├── security/         # JWT + Spring Security
│       ├── websocket/        # WebSocket service
│       └── util/             # AI classifier, GeoUtils
├── frontend/                 # React + Vite app
│   └── src/
│       ├── pages/            # All pages
│       ├── components/       # Reusable UI components
│       ├── api/              # Axios API layer
│       ├── store/            # Redux store
│       ├── hooks/            # Custom hooks (WebSocket)
│       └── types/            # TypeScript types
└── docs/                     # Documentation
```

## 🌐 Deployment

- **Frontend:** Vercel
- **Backend:** Railway
- **Database:** Railway MySQL

## 📄 License
MIT
