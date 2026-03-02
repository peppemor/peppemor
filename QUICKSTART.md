# ⚡ QUICKSTART - Avvia il progetto in 5 minuti

## 📋 Prerequisiti

- PostgreSQL in esecuzione localmente
- Database `peppemor` creato
- Node.js 18+

## 🚀 Avvio rapido

### 1️⃣ Configura il database

```bash
# Connetti a PostgreSQL
psql -U postgres

# Crea il database
CREATE DATABASE peppemor;
\q
```

### 2️⃣ Configura le variabili d'ambiente

Modifica `.env` con le tue credenziali PostgreSQL:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/peppemor"
```

### 3️⃣ Configura il database Prisma

```bash
# Esegui migrazioni
npm run db:migrate

# Popola con dati di test
npm run db:seed
```

### 4️⃣ Avvia il backend

In un **nuovo terminale**:
```bash
npm run server
```

Aspetta: `🚀 Server is running on http://localhost:3001`

### 5️⃣ Avvia il frontend

In un **altro terminale**:
```bash
npm run dev
```

Sopra: `Local: http://localhost:5173/`

---

## ✅ Test Veloce

### Login nel browser
Va a http://localhost:5173/ e:
- Email/Username: `admin` (o `admin@peppemor.it`)
- Password: `admin123`

### Verifica API
```bash
curl http://localhost:3001/health
# Risposta: {"status":"ok","message":"Server is running"}
```

---

## 📊 Database Studio (opzionale)

Visualizza i dati del database:
```bash
npm run db:studio
```

Apre una GUI su http://localhost:5555

---

## 🎯 Comandi frecuenti

```bash
# Frontend
npm run dev              # Avvia dev server (Vite)
npm run build           # Build produzione

# Backend  
npm run server          # Avvia Express server

# Database
npm run db:migrate      # Nuovo comando di migrazione
npm run db:seed         # Ripopola dati di test
npm run db:studio       # GUI per visualizzare dati
```

---

## ⏱️ Timeline atteso

| Fase | Tempo |
|------|-------|
| Setup database | 1 min |
| Migrazioni Prisma | 30 sec |
| Seeding dati | 10 sec |
| Avvio server | 5 sec |
| Avvio frontend | 10 sec |
| **TOTALE** | **~2 min** |

---

## 🆘 Se qualcosa non funziona

1. **Errore PostgreSQL?**
   ```bash
   # Verifica che PostgreSQL sia in esecuzione
   pg_isready -h localhost -p 5432
   ```

2. **Porta già in uso?**
   ```bash
   # Cambia in .env
   SERVER_PORT=3002  # Invece di 3001
   ```

3. **Errore token JWT?**
   - Pulisci il localStorage nel browser
   - Cancella il token salvato

---

## 📝 Login Test Credentials

Dopo `npm run db:seed`:

**Admin:**
- Username: `admin`
- Email: `admin@peppemor.it`
- Password: `admin123`

**Demo User:**
- Username: `demo`
- Email: `demo@peppemor.it`
- Password: `demo123`

---

## 🎉 Success!

Se vedi:
- ✅ Server running on http://localhost:3001
- ✅ Vite server on http://localhost:5173
- ✅ Login funzionante

**Migrazione completa!** 🚀
