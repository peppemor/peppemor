import { PrismaClient } from '@prisma/client';

// Crea una singola istanza di PrismaClient per tutta l'app
// In produzione, è importante avere una sola istanza per evitare
// troppi pool di connessioni

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // In sviluppo, evita di creare nuove istanze se già esiste
  const globalForPrisma = global as unknown as { prisma: PrismaClient };
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: ['warn', 'error'],
    });
  }
  prisma = globalForPrisma.prisma;
}

export default prisma;
