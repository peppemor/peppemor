# 🚀 Migrazione da Supabase a Prisma + PostgreSQL

Questo documento descrive i passi per completare la migrazione del progetto da Supabase a Prisma con database PostgreSQL locale.

## ✅ Cosa è stato completato

- [x] Installazione di Prisma e dipendenze (bcrypt, jose)
- [x] Creazione dello schema Prisma con i modelli (User, Profile, UserRole, Itinerary, PointOfInterest, Print, Order, OrderItem)
- [x] Creazione del backend Express.js con routing API
- [x] Implementazione dell'autenticazione basata su JWT
- [x] Creazione dei controlli per Auth, Itinerari
- [x] Aggiornamento di AuthContext per usare API REST
- [x] Rimozione delle dipendenze Supabase dai servizi
- [x] Aggiornamento dei tipi TypeScript

## 📋 Passi di configurazione rimanenti

### 1. **Verificare/Configurare PostgreSQL locale**

Assicurati che PostgreSQL sia in esecuzione e che il database `peppemor` esista:

```bash
# Connetti a PostgreSQL
psql -U postgres

# Crea il database se non esiste
CREATE DATABASE peppemor;

# Esci
\q
```

**Aggiorna le credenziali nel `.env` se necessario:**
```env
DATABASE_URL="postgresql://postgres:TUA_PASSWORD@localhost:5432/peppemor"
```

### 2. **Eseguire le migrazioni Prisma**

```bash
# Crea e applica le migrazioni iniziali
npm run db:migrate

# Oppure, se preferisci solo applicare lo schema:
npx prisma migrate deploy
```

### 3. **Popolare il database con i dati seed**

```bash
npm run db:seed
```

Questo creerà:
- Un utente admin: `admin@peppemor.it` / `admin123`
- Un utente demo: `demo@peppemor.it` / `demo123`
- 2 itinerari di esempio
- 2 stampe di esempio

### 4. **Avviare il server backend**

In un terminale:
```bash
npm run server
```

Il server dovrebbe essere in esecuzione su `http://localhost:3001`

Verifica che funziona:
```bash
curl http://localhost:3001/health
# Dovresti ricevere: {"status":"ok","message":"Server is running"}
```

### 5. **Avviare il frontend (in un altro terminale)**

```bash
npm run dev
```

Il frontend sarà su `http://localhost:5173`

## 🔧 Script disponibili

```bash
# Frontend
npm run dev              # Avvia Vite in dev mode
npm run build           # Build produzione del frontend
npm run preview         # Preview della build

# Backend
npm run server          # Avvia il server in dev mode
npm run build:server    # Compila TypeScript

# Database
npm run db:migrate      # Esegui migrazioni Prisma
npm run db:seed         # Popola il database con dati seed
npm run db:studio       # Apri Prisma Studio (visualizzatore dati)

# Linting
npm run lint            # Esegui ESLint
```

## 📊 Struttura del progetto post-migrazione

```
project/
├── src/                          # Frontend React/Vite
│   ├── components/
│   ├── contexts/                 # AuthContext (senza Supabase)
│   ├── pages/
│   ├── services/                 # AuthService, ProfileService, ItineraryService (con Prisma)
│   ├── types/                    # Tipi aggiornati per Prisma
│   ├── App.tsx
│   └── main.tsx                  # Rimosso SessionContextProvider di Supabase
├── server/                       # Backend Express.js (NUOVO)
│   ├── controllers/              # authController, itineraryController
│   ├── middleware/               # authMiddleware (JWT)
│   ├── routes/                   # auth.ts, itineraries.ts
│   └── index.ts                  # Server principale
├── prisma/
│   ├── schema.prisma             # Schema del database
│   └── seed.ts                   # Seeding script
├── .env                          # Variabili d'ambiente
├── package.json                  # Script aggiornati
└── vite.config.ts                # Config Vite
```

## 🔑 Credenziali di test

Dopo aver eseguito `npm run db:seed`:

**Admin:**
- Email: `admin@peppemor.it`
- Username: `admin`
- Password: `admin123`

**Demo User:**
- Email: `demo@peppemor.it`
- Username: `demo`
- Password: `demo123`

## 🚨 Troubleshooting

### Errore di connessione PostgreSQL

```
Error: Prisma schema validation - (get-config wasm)
Error: Environment variable not found: DATABASE_URL
```

**Soluzione:** Assicurati che il file `.env` esista e contenga la variabile `DATABASE_URL` con credenziali valide.

### Errore 401 nel login dal frontend

**Possibili cause:**
1. Il server non è in esecuzione (`npm run server`)
2. Il token JWT non viene salvato correttamente nel localStorage
3. Il middleware di autenticazione rifiuta il token

**Debug:** Controlla la console del browser e le log del server per i dettagli.

### File Supabase da rimuovere

I seguenti file/cartelle sono ora deprecati e possono essere rimossi quando sei sicuro:

```
src/supabase/                      # DEPRECATED
src/types/supabase.ts              # DEPRECATED (importava Database)
database/functions/                # DEPRECATED (funzioni SQL di Supabase)
home/                              # DEPRECATED (se non utilisato)
```

Per ora sono commentati nel `.env` ma possono essere eliminati durante la pulizia.

## 📝 Prossimi passi opzionali

1. **Upload di file (Avatar):** Implementare un sistema de file upload (es. con Multer per Express)
2. **Email verification:** Aggiungere verifica email dopo il signup
3. **Password reset:** Implementare reset password
4. **File di seed avanzato:** Importare dati reali da Supabase usando l'API CLI di Supabase
5. **Testing:** Aggiungere test e2e e unit test
6. **Documentazione API:** Aggiungere Swagger/OpenAPI per la documentazione

## 📕 Riferimenti utili

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js](https://expressjs.com/)
- [JWT](https://jwt.io/)
- [PostgreSQL](https://www.postgresql.org/docs/)

---

**Stato della migrazione:** ✅ Completa (pronto per il testing)

Se incontri problemi, verifica:
1. PostgreSQL è in esecuzione?
2. Il database `peppemor` esiste?
3. Le credenziali nel `.env` sono corrette?
4. Il server Express è avviato?
5. Il frontend può raggiungere il server (controlla CORS)?
