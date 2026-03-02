import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Crea utente admin
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@peppemor.it' },
    update: {},
    create: {
      email: 'admin@peppemor.it',
      username: 'admin',
      password: await bcrypt.hash('admin123', 10),
      profile: {
        create: {
          firstName: 'Admin',
          lastName: 'User',
          fullName: 'Admin User',
        },
      },
      userRole: {
        create: {
          role: 'admin',
        },
      },
    },
  });

  console.log('✅ Admin user created:', adminUser.email);

  // Crea utente demo
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@peppemor.it' },
    update: {},
    create: {
      email: 'demo@peppemor.it',
      username: 'demo',
      password: await bcrypt.hash('demo123', 10),
      profile: {
        create: {
          firstName: 'Demo',
          lastName: 'User',
          fullName: 'Demo User',
        },
      },
      userRole: {
        create: {
          role: 'user',
        },
      },
    },
  });

  console.log('✅ Demo user created:', demoUser.email);

  // Crea itinerari
  const itinerary1 = await prisma.itinerary.upsert({
    where: { id: 'centro-storico' },
    update: {},
    create: {
      id: 'centro-storico',
      title: 'Centro Storico di Napoli',
      shortDescription: 'Un percorso attraverso il cuore pulsante di Napoli, tra vicoli, chiese e monumenti storici.',
      fullDescription: 'Il Centro Storico di Napoli, dichiarato Patrimonio dell\'Umanità dall\'UNESCO, racchiude oltre 2500 anni di storia. Questo itinerario vi porterà alla scoperta dei luoghi più iconici del centro, dove ogni pietra racconta una storia e ogni angolo rivela un tesoro nascosto. Passeggiando per le vie di Spaccanapoli, l\'antico decumano che taglia in due il centro storico, vi immergerete nella vita quotidiana napoletana, tra botteghe artigiane, chiese monumentali e piccoli caffè storici.',
      coverImage: 'https://images.pexels.com/photos/2147490/pexels-photo-2147490.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      distance: 3.5,
      estimatedTime: '3-4 ore',
      difficulty: 'facile',
      pointsOfInterest: {
        create: [
          {
            name: 'Spaccanapoli',
            description: 'La via principale che taglia il centro storico',
            latitude: 40.8526,
            longitude: 14.2680,
          },
          {
            name: 'Duomo di San Gennaro',
            description: 'Cattedrale principale di Napoli',
            latitude: 40.8553,
            longitude: 14.2671,
          },
        ],
      },
    },
  });

  console.log('✅ Itinerary created:', itinerary1.title);

  const itinerary2 = await prisma.itinerary.upsert({
    where: { id: 'lungomare-mergellina' },
    update: {},
    create: {
      id: 'lungomare-mergellina',
      title: 'Lungomare e Mergellina',
      shortDescription: 'Una passeggiata lungo il mare di Napoli, tra panorami mozzafiato e sapori autentici.',
      fullDescription: 'Il Lungomare di Napoli, conosciuto anche come Via Caracciolo, è uno dei luoghi più suggestivi della città. Questo itinerario vi porterà alla scoperta di un tratto di costa che offre panorami indimenticabili sul Golfo di Napoli, con il Vesuvio sullo sfondo e l\'isola di Capri all\'orizzonte.',
      coverImage: 'https://images.pexels.com/photos/14679976/pexels-photo-14679976.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      distance: 4.2,
      estimatedTime: '2-3 ore',
      difficulty: 'facile',
      pointsOfInterest: {
        create: [
          {
            name: 'Via Caracciolo',
            description: 'Il lungomare principale di Napoli',
            latitude: 40.8268,
            longitude: 14.2447,
          },
        ],
      },
    },
  });

  console.log('✅ Itinerary created:', itinerary2.title);

  // Crea stampe
  const print1 = await prisma.print.upsert({
    where: { id: 'spaccanapoli-view' },
    update: {},
    create: {
      id: 'spaccanapoli-view',
      title: 'Spaccanapoli View',
      description: 'The historic center of Naples',
      image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
  });

  console.log('✅ Print created:', print1.title);

  const print2 = await prisma.print.upsert({
    where: { id: 'vesuvius-dawn' },
    update: {},
    create: {
      id: 'vesuvius-dawn',
      title: 'Vesuvius at Dawn',
      description: 'Mount Vesuvius overlooking the bay',
      image: 'https://images.unsplash.com/photo-1534445967719-8ae7b972b1a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
  });

  console.log('✅ Print created:', print2.title);

  console.log('✨ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('🚨 Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
