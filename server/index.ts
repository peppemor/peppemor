import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import authRoutes from './routes/auth.js';
import itineraryRoutes from './routes/itineraries.js';
import contactRoutes from './routes/contact.js';
import usersRoutes from './routes/users.js';
import prisma from '../src/lib/prisma.js';

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

// Middleware
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map(o => o.trim());
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());


// Welcome page con elenco API
app.get('/', (req, res) => {
  res.type('html').send(`
    <h1>Benvenuto nell'API Server Peppemor</h1>
    <p>Server attivo su <b>http://localhost:${PORT}</b></p>
    <h2>API disponibili:</h2>
    <ul>
      <li><b>GET</b> /api/itineraries</li>
      <li><b>GET</b> /api/itineraries/:id</li>
      <li><b>GET</b> /api/itineraries/:id/with-pois</li>
      <li><b>GET</b> /api/itineraries/:id/pois</li>
      <li><b>POST</b> /api/itineraries <i>(admin)</i></li>
      <li><b>PUT</b> /api/itineraries/:id <i>(admin)</i></li>
      <li><b>DELETE</b> /api/itineraries/:id <i>(admin)</i></li>
      <li><b>POST</b> /api/auth/login</li>
      <li><b>POST</b> /api/auth/signup</li>
      <li><b>POST</b> /api/auth/logout</li>
      <li><b>GET</b> /api/auth/me</li>
      <li><b>POST</b> /api/contact</li>
      <li><b>GET</b> /api/users <i>(admin)</i></li>
      <li><b>GET</b> /health</li>
    </ul>
    <p>Per accedere alle API protette occorre autenticarsi come admin.</p>
  `);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', usersRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}/api`);
});
