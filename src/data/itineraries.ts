  
  import { Itinerary } from '../types/index';
    
  const itineraries: Itinerary[] = [
    {
      id: 'centro-storico',
      title: 'Centro Storico di Napoli',
      short_description: 'Un percorso attraverso il cuore pulsante di Napoli, tra vicoli, chiese e monumenti storici.',
      cover_image: 'https://images.pexels.com/photos/2147490/pexels-photo-2147490.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      full_description: 'Il Centro Storico di Napoli, dichiarato Patrimonio dell\'Umanità dall\'UNESCO, racchiude oltre 2500 anni di storia. Questo itinerario vi porterà alla scoperta dei luoghi più iconici del centro, dove ogni pietra racconta una storia e ogni angolo rivela un tesoro nascosto. Passeggiando per le vie di Spaccanapoli, l\'antico decumano che taglia in due il centro storico, vi immergerete nella vita quotidiana napoletana, tra botteghe artigiane, chiese monumentali e piccoli caffè storici.',
      distance: 3.5,
      estimated_time: '3-4 ore',
      difficulty: 'facile'
    },
    {
      id: 'lungomare-mergellina',
      title: 'Lungomare e Mergellina',
      short_description: 'Una passeggiata lungo il mare di Napoli, tra panorami mozzafiato e sapori autentici.',
      cover_image: 'https://images.pexels.com/photos/14679976/pexels-photo-14679976.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      full_description: 'Il Lungomare di Napoli, conosciuto anche come Via Caracciolo, è uno dei luoghi più suggestivi della città. Questo itinerario vi porterà alla scoperta di un tratto di costa che offre panorami indimenticabili sul Golfo di Napoli, con il Vesuvio sullo sfondo e l\'isola di Capri all\'orizzonte. Lungo il percorso incontrerete monumenti storici, locali alla moda e ristoranti dove assaporare le specialità della cucina napoletana a base di pesce.',
      distance: 4.2,
      estimated_time: '2-3 ore',
      difficulty: 'facile'
    },
    {
      id: 'napoli-sotterranea',
      title: 'Napoli Sotterranea',
      short_description: 'Un viaggio nel sottosuolo di Napoli, tra cisterne romane, gallerie e rifugi antiaerei.',
      cover_image: 'https://images.pexels.com/photos/10580223/pexels-photo-10580223.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      full_description: 'Napoli è una città che si sviluppa non solo in superficie, ma anche nel sottosuolo. Questo itinerario vi porterà alla scoperta di un mondo nascosto, fatto di cisterne greche e romane, gallerie, acquedotti e rifugi antiaerei. Un viaggio attraverso più di duemila anni di storia, che vi permetterà di conoscere un aspetto meno noto ma affascinante della città partenopea.',
      distance: 2.8,
      estimated_time: '4-5 ore',
      difficulty: 'media'
    },
    {
      id: 'special-napoli',
      title: 'Napoli Special',
      short_description: 'Un viaggio nel sottosuolo di Napoli, tra cisterne romane, gallerie e rifugi antiaerei.',
      cover_image: 'https://images.pexels.com/photos/10580223/pexels-photo-10580223.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      full_description: 'Napoli è una città che si sviluppa non solo in superficie, ma anche nel sottosuolo. Questo itinerario vi porterà alla scoperta di un mondo nascosto, fatto di cisterne greche e romane, gallerie, acquedotti e rifugi antiaerei. Un viaggio attraverso più di duemila anni di storia, che vi permetterà di conoscere un aspetto meno noto ma affascinante della città partenopea.',
      distance: 2.8,
      estimated_time: '4-5 ore',
      difficulty: 'media'
    }
  ];
  
  export default itineraries;