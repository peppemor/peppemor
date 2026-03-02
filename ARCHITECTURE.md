# 🏗️ Architettura del Progetto - Prisma + Express + ESM

**Stack:** Node.js 18+ + Express.js + Prisma ORM + PostgreSQL + React + Vite + TypeScript
**Module System:** ESM (Native ES Modules everywhere)
**Auth:** JWT (jose library) + bcrypt + SessionStorage
**Status:** Production-ready

## Diagramma dell'architettura

```
┌─────────────────────────────────────────────────────────────┐
│                     BROWSER (Cliente)                       │
│           React App (Vite) - http://localhost:5173          │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │          Frontend React Components                     │ │
│  │  - App.tsx                                             │ │
│  │  - Pages (Home, Account, Auth, Gallery, etc.)         │ │
│  │  - Components (Modal, Card, Navigation, etc)          │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ▲                                   │
│                          │ REST API Calls                    │
│                          │ (fetch with JWT token)           │
│                          ▼                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │          Context API (State Management)                │ │
│  │  - AuthContext (user, token, login, logout)           │ │
│  │  - CartContext (cart items)                            │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                             │
                        CORS enabled
                             │
                    HTTP/REST API Calls
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                 Express.js Backend Server                   │
│            (Node.js) - http://localhost:3001                │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                 API Routes                              │ │
│  │  /api/auth/      - Login, Signup, Profile              │ │
│  │  /api/itineraries - Lista itinerari, dettagli          │ │
│  │  /health         - Server health check                 │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ▲                                   │
│                          │                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Controllers & Middleware                   │ │
│  │  - authController (signup, signin, getMe)              │ │
│  │  - itineraryController (getItineraries, etc)           │ │
│  │  - authMiddleware (JWT verification)                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ▲                                   │
│                          │                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Services (Business Logic)                  │ │
│  │  - AuthService (with JWT, bcrypt)                      │ │
│  │  - ProfileService                                      │ │
│  │  - ItineraryService                                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ▲                                   │
│                          │                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           Prisma ORM (Database Queries)                │ │
│  │  - Single PrismaClient instance (src/lib/prisma.ts)    │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ▲                                   │
├──────────────────────────┼──────────────────────────────────┤
│                          │                                   │
│        PostgreSQL Connection Pool                           │
│                                                              │
└─────────────────────────►▼─────────────────────────────────┘
                    ┌──────────────┐
                    │ PostgreSQL   │
                    │ Database     │
                    │              │
                    │ Tables:      │
                    │ - users      │
                    │ - profiles   │
                    │ - user_roles │
                    │ - itineraries│
                    │ - point_of_  │
                    │   interest   │
                    │ - prints     │
                    │ - orders     │
                    │ - order_items│
                    └──────────────┘
                    (localhost:5432)
```

---

## 📂 Struttura dei file

```
project-root/
│
├── 📦 Configurazione
│   ├── .env                           ← Variabili d'ambiente (DB, JWT, etc)
│   ├── .env.example                   ← Template
│   ├── .gitignore                     ← Git ignore (aggiornato)
│   ├── package.json                   ← Dipendenze e script (type: module)
│   ├── tsconfig.json                  ← Frontend TypeScript (bundler mode)
│   ├── tsconfig.server.json           ← Backend TypeScript (NodeNext ESM)
│   ├── tsconfig.node.json             ← Vite/Node tools config
│   ├── vite.config.ts                 ← Vite config
│   └── eslint.config.js               ← ESLint rules
│
├── 🎨 Frontend (SPA React/Vite)
│   └── src/
│       ├── App.tsx               ← Componente principale
│       ├── main.tsx              ← Entry point (senza Supabase)
│       ├── index.css             ← Global styles
│       ├── vite-env.d.ts        ← Vite types
│       │
│       ├── 📄 components/        ← Componenti React
│       │   ├── Footer.tsx
│       │   ├── MainContent.tsx
│       │   ├── NavigationBar.tsx
│       │   ├── PrintModal.tsx
│       │   ├── PrivateRoute.tsx
│       │   ├── itinerary/       ← Componenti itinerari
│       │   │   ├── ItineraryCard.tsx
│       │   │   ├── ItineraryMapView.tsx
│       │   │   └── PointOfInterestCard.tsx
│       │   └── ui/               ← Componenti base
│       │       ├── Avatar.tsx
│       │       ├── Button.tsx
│       │       └── Input.tsx
│       │
│       ├── 🎯 pages/             ← Pagine dell'app
│       │   ├── Account.tsx       ← Profilo utente
│       │   ├── AuthForm.tsx      ← Login/Signup
│       │   ├── Cart.tsx          ← Carrello
│       │   ├── Contact.tsx
│       │   ├── Gallery.tsx
│       │   ├── Home.tsx
│       │   ├── ItinerariesAdmin.tsx
│       │   ├── ItinerariesList.tsx
│       │   ├── ItineraryDetail.tsx
│       │   └── NotFound.tsx
│       │
│       ├── 🔒 contexts/          ← Context API (State Management)
│       │   ├── AuthContext.tsx   ← Autenticazione (API REST)
│       │   └── CartContext.tsx   ← Carrello
│       │
│       ├── 🎣 hooks/             ← Custom React Hooks
│       │   ├── index.ts
│       │   ├── useAuthService.ts
│       │   ├── useItineraryService.ts
│       │   └── useProfileService.ts
│       │
│       ├── 📡 services/          ← Business Logic (Prisma + ESM)
│       │   ├── index.ts              ← Barrel export (ESM)
│       │   ├── authService.ts        ← JWT (jose) + bcrypt + async
│       │   ├── itineraryService.ts   ← Prisma queries
│       │   ├── profileService.ts     ← Avatar handling
│       │   └── orderService.ts       ← Future: order logic
│       │
│       ├── 🏛️ lib/               ← Utilities e configurazioni
│       │   └── prisma.ts         ← PrismaClient singleton
│       │
│       ├── 🔀 routes/            ← Routing
│       │   ├── indexRoutes.tsx
│       │   └── pathConstants.tsx
│       │
│       ├── 📊 types/             ← TypeScript types
│       │   ├── index.ts
│       │   ├── app-types.ts       ← ✨ Aggiornato per Prisma
│       │   └── (supabase.ts)     ← DEPRECATO
│       │
│       ├── 📂 data/              ← Dati statici (fallback)
│       │   ├── itineraries.ts
│       │   └── prints.ts
│       │
│       └── 🔧 utils/             ← Funzioni utility
│           ├── helpers.ts
│           ├── index.ts
│           └── userHelpers.ts
│
├── 🖥️ Backend (Express.js + ESM + NodeNext)
│   └── server/
│       ├── index.ts                  ← Server principale (ESM)
│       │
│       ├── 🔐 middleware/            ← Middleware Express
│       │   └── auth.ts               ← JWT verification (async jose)
│       │
│       ├── 🎮 controllers/           ← Route handlers
│       │   ├── authController.ts     ← Auth + avatar hardening
│       │   ├── itineraryController.ts
│       │   └── contactController.ts
│       │
│       └── 🛣️ routes/                ← Routing Express
│           ├── auth.ts               ← /api/auth (signup/signin/avatar)
│           ├── itineraries.ts        ← /api/itineraries (GET)
│           ├── contact.ts            ← /api/contact (POST message)
│           └── users.ts              ← /api/users/:id/avatar (GET)
│
├── 🗄️ Prisma (Database ORM)
│   └── prisma/
│       ├── schema.prisma         ← ✨ Schema completo
│       ├── seed.ts               ← Seeding script
│       ├── .env                  ← (symlink a root .env)
│       └── migrations/           ← (auto-generated)
│           └── *_init/
│               └── migration.sql
│
├── 📚 Database (PostgreSQL)
│   └── peppemor
│       ├── users              ← Utenti app
│       ├── profiles           ← Dati profilo
│       ├── user_roles         ← Ruoli (admin, user)
│       ├── itineraries        ← Itinerari turistici
│       ├── points_of_interest ← Punti di interesse
│       ├── prints             ← Stampe/poster
│       ├── orders             ← Ordini
│       └── order_items        ← Dettagli ordini
│
└── 📖 Documentazione
    ├── README.md                ← (originale)
    ├── MIGRATION_CHECKLIST.md  ← (originale)
    ├── MIGRATION_SETUP.md       ← ✨ Setup completo
    ├── MIGRATION_COMPLETE.md    ← ✨ Riepilogo finale
    └── QUICKSTART.md            ← ✨ Launch veloce
```

---

## 🔄 Flusso dati

### **Autenticazione (Signup/Login)**

```
Browser Form Input
    ↓
AuthForm Component
    ↓
AuthContext.signup/login()  [API Call]
    ↓
Express /api/auth/signup|signin
    ↓
authController.signup/signin()
    ↓
AuthService.signUp/signIn()
    ↓
Prisma (bcrypt, JWT)
    ↓
PostgreSQL (create user, store password)
    ↓
Return: { user, profile, token }
    ↓
AuthContext (save token to localStorage)
    ↓
Frontend Updates State + Redirect
```

### **Recupero Itinerari**

```
ItinerariesList Component
    ↓
useAuth() + fetch()
    ↓
Express GET /api/itineraries
    ↓
itineraryController.getItineraries()
    ↓
ItineraryService.fetchItineraries()
    ↓
Prisma (query all itineraries)
    ↓
PostgreSQL
    ↓
Return: [ Itinerary[] ]
    ↓
Component renders lista
```

### **Dettagli Itinerario con PoI**

```
ItineraryDetail Component + itineraryId
    ↓
fetch /api/itineraries/{id}/with-pois
    ↓
itineraryController.getItineraryWithPOIs()
    ↓
ItineraryService.fetchItineraryWithPOIs()
    ↓
Prisma { include: { pointsOfInterest } }
    ↓
PostgreSQL JOIN query
    ↓
Return: { itinerary, pointsOfInterest[] }
    ↓
ItineraryMapView renders mappa + markers
```

---

## 🔐 Sicurezza

### **Password Hashing**
- Bcrypt con salt rounds = 10
- Password mai salvate in plain text
- Hash verificato al login

### **Autenticazione JWT**
- Libreria: jose (ESM-native, async)
- Token firmato con JWT_SECRET (HS256)
- Expiration: 7 giorni
- Header: Authorization: Bearer <token>
- Middleware async per verifica token

### **Avatar Handling**
- Backend (source of truth): Salva URL assoluto nel controller
- Usa getBaseUrl(req) per protocolo/host
- Normalizza risposta in /auth/me, /auth/profile, PUT /auth/profile
- Client (fallback): Normalizza URL relativo -> assoluto se serve
- Avatar storato in DB come binary + MIME type
- Servito via GET /api/users/:id/avatar

### **CORS**
- Abilitato per localhost:5173
- Configurabile in server/index.ts

### **Middleware di Autenticazione**
- Verifica JWT su route protette (async)
- Ritorna 401 se token mancante/invalido
- Estrae userId dal token
- Typed AuthenticatedRequest per type-safety

---

## 🔌 API Endpoints

### **Auth Routes**

| Metodo | Endpoint | Auth | Descrizione |
|--------|----------|------|-------------|
| POST | /api/auth/signup | ❌ | Registra nuovo utente, ritorna token |
| POST | /api/auth/signin | ❌ | Login, ritorna token |
| POST | /api/auth/verify-username | ❌ | Verifica username disponibile |
| POST | /api/auth/verify-email | ❌ | Verifica email disponibile |
| GET | /api/auth/me | ✅ | Dati utente + profilo + ruolo |
| GET | /api/auth/profile | ✅ | Profilo utente (avatarUrl assoluto) |
| PUT | /api/auth/profile | ✅ | Aggiorna profilo (avatarUrl assoluto) |
| POST | /api/auth/avatar | ✅ | Upload avatar (multipart/form-data) |

### **Itinerary Routes**

| Metodo | Endpoint | Auth | Descrizione |
|--------|----------|------|-------------|
| GET | /api/itineraries | ❌ | Lista tutti itinerari |
| GET | /api/itineraries/:id | ❌ | Singolo itinerario |
| GET | /api/itineraries/:id/with-pois | ❌ | Itinerario + points of interest |
| GET | /api/itineraries/:id/pois | ❌ | Solo points of interest |

### **User/Avatar Routes**

| Metodo | Endpoint | Auth | Descrizione |
|--------|----------|------|-------------|
| GET | /api/users/:id/avatar | ❌ | Scarica avatar come immagine |

### **Contact Routes**

| Metodo | Endpoint | Auth | Descrizione |
|--------|----------|------|-------------|
| POST | /api/contact | ❌ | Invia messaggio (email via Resend) |

---

## Build & Compile

### Scripts Disponibili

- Frontend: npm run dev, npm run build, npm run preview
- Backend: npm run server, npm run build:server, npm run start:server
- Database: npm run db:migrate, npm run db:seed, npm run db:studio
- Lint: npm run lint

### TypeScript Configuration

- Frontend (tsconfig.json): Module esnext, bundler resolution
- Backend (tsconfig.server.json): Module NodeNext, NodeNext resolution, outDir dist
- Both: Strict mode enabled

### Module System (ESM Everywhere)

- package.json: "type": "module"
- All imports use .js extensions (backend + src barrels)
- No CommonJS mix
- Async/await everywhere

---

## Roadmap Opzionale

1. **Email verification** post-signup
2. **Password reset** con email token
3. **Refresh tokens** per session lunga
4. **Rate limiting** su API endpoints
5. **Logging** (Winston, structured)
6. **E2E Testing** (Playwright, Cypress)
7. **API Documentation** (Swagger/OpenAPI)
8. **Deploy pipeline** (CI/CD)
9. **Observability** (Sentry, error tracking)
10. **Print orders fulfillment** (inventory)

---

## Highlights dell'Architettura

- Type Safety: TypeScript + Prisma + strict configs
- Authentication: JWT (jose) + bcrypt async
- Module System: ESM native (NodeNext backend)
- API Contract: REST + type-safe responses
- Avatar: Backend-first hardening + client fallback
- Database: Prisma ORM (type-safe queries)
- State: React Context API
- Build: Vite (frontend) + tsc (backend)
- Development: tsx watch (backend), hot reload (frontend)

---

**Status:** Production-ready with scaling options
**Tech Stack:** Node.js + Express + Prisma + PostgreSQL + React + Vite + TypeScript (ESM)
