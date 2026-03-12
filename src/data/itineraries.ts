  
  import { Itinerary } from '../types/index.js';
    
  const itineraries: Itinerary[] = [
    {
      id: 'centro-storico',
      title: 'Centro Storico di Napoli',
      shortDescription: 'Un percorso attraverso il cuore pulsante di Napoli, tra vicoli, chiese e monumenti storici.',
      coverImage: 'https://images.pexels.com/photos/2147490/pexels-photo-2147490.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      fullDescription: 'Il Centro Storico di Napoli, dichiarato Patrimonio dell\'Umanità dall\'UNESCO, racchiude oltre 2500 anni di storia. Questo itinerario vi porterà alla scoperta dei luoghi più iconici del centro, dove ogni pietra racconta una storia e ogni angolo rivela un tesoro nascosto. Passeggiando per le vie di Spaccanapoli, l\'antico decumano che taglia in due il centro storico, vi immergerete nella vita quotidiana napoletana, tra botteghe artigiane, chiese monumentali e piccoli caffè storici.',
      distance: 3.5,
      estimatedTime: '3-4 ore',
      difficulty: 'facile',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'lungomare-mergellina',
      title: 'Lungomare e Mergellina',
      shortDescription: 'Una passeggiata lungo il mare di Napoli, tra panorami mozzafiato e sapori autentici.',
      coverImage: 'https://images.pexels.com/photos/14679976/pexels-photo-14679976.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      fullDescription: 'Il Lungomare di Napoli, conosciuto anche come Via Caracciolo, è uno dei luoghi più suggestivi della città. Questo itinerario vi porterà alla scoperta di un tratto di costa che offre panorami indimenticabili sul Golfo di Napoli, con il Vesuvio sullo sfondo e l\'isola di Capri all\'orizzonte. Lungo il percorso incontrerete monumenti storici, locali alla moda e ristoranti dove assaporare le specialità della cucina napoletana a base di pesce.',
      distance: 4.2,
      estimatedTime: '2-3 ore',
      difficulty: 'facile',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'napoli-sotterranea',
      title: 'Napoli Sotterranea',
      shortDescription: 'Un viaggio nel sottosuolo di Napoli, tra cisterne romane, gallerie e rifugi antiaerei.',
      coverImage: 'https://images.pexels.com/photos/10580223/pexels-photo-10580223.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      fullDescription: 'Napoli è una città che si sviluppa non solo in superficie, ma anche nel sottosuolo. Questo itinerario vi porterà alla scoperta di un mondo nascosto, fatto di cisterne greche e romane, gallerie, acquedotti e rifugi antiaerei. Un viaggio attraverso più di duemila anni di storia, che vi permetterà di conoscere un aspetto meno noto ma affascinante della città partenopea.',
      distance: 2.8,
      estimatedTime: '4-5 ore',
      difficulty: 'media',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'special-napoli',
      title: 'Napoli Special',
      shortDescription: 'Un viaggio nel sottosuolo di Napoli, tra cisterne romane, gallerie e rifugi antiaerei.',
      coverImage: 'https://images.pexels.com/photos/10580223/pexels-photo-10580223.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      fullDescription: 'Napoli è una città che si sviluppa non solo in superficie, ma anche nel sottosuolo. Questo itinerario vi porterà alla scoperta di un mondo nascosto, fatto di cisterne greche e romane, gallerie, acquedotti e rifugi antiaerei. Un viaggio attraverso più di duemila anni di storia, che vi permetterà di conoscere un aspetto meno noto ma affascinante della città partenopea.',
      distance: 2.8,
      estimatedTime: '4-5 ore',
      difficulty: 'media',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  export default itineraries;