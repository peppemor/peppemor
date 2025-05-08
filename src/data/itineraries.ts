  
  import { Itinerary } from '../types/index';
    
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
      pointsOfInterest: [
        {
          id: 'duomo',
          name: 'Duomo di Napoli',
          description: 'La Cattedrale di Santa Maria Assunta, conosciuta semplicemente come Duomo di Napoli, è la chiesa cattedrale dell\'arcidiocesi di Napoli. Al suo interno si trova la Cappella del Tesoro di San Gennaro, dove sono conservate le ampolle con il sangue del santo patrono della città.',
          coordinates: [40.8531, 14.2612],
          image: 'https://images.pexels.com/photos/11658720/pexels-photo-11658720.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          type: 'cultural'
        },
        {
          id: 'san-gregorio-armeno',
          name: 'San Gregorio Armeno',
          description: 'La via dei presepi, famosa in tutto il mondo per le sue botteghe artigiane specializzate nella creazione di figure presepiali. Durante tutto l\'anno, ma soprattutto nel periodo natalizio, questa strada si anima di colori e di vita, offrendo uno spettacolo unico nel suo genere.',
          coordinates: [40.8513, 14.2586],
          image: 'https://images.pexels.com/photos/18011469/pexels-photo-18011469/free-photo-of-stradina-napoli.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          type: 'cultural'
        },
        {
          id: 'antica-pizzeria',
          name: 'Antica Pizzeria da Michele',
          description: 'Una delle più famose e antiche pizzerie di Napoli, dove assaporare la vera pizza napoletana preparata secondo la tradizione. Un\'esperienza culinaria imperdibile per chi visita la città.',
          coordinates: [40.8505, 14.2609],
          image: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          type: 'food'
        },
        {
          id: 'cappella-sansevero',
          name: 'Cappella Sansevero',
          description: 'Piccolo gioiello del patrimonio artistico napoletano, la Cappella Sansevero ospita il Cristo Velato, opera straordinaria di Giuseppe Sanmartino, oltre ad altre sculture di grande pregio. Il luogo è avvolto da un\'aura di mistero, legata alla figura del principe Raimondo di Sangro, scienziato ed esoterista.',
          coordinates: [40.8504, 14.2571],
          image: 'https://images.pexels.com/photos/12468864/pexels-photo-12468864.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          type: 'cultural'
        },
        {
          id: 'sfogliatella-mary',
          name: 'Sfogliatella Mary',
          description: 'Storica pasticceria napoletana, famosa per le sue sfogliatelle ricce e frolle. Un punto di riferimento per chi vuole gustare uno dei dolci simbolo della tradizione partenopea.',
          coordinates: [40.8385, 14.2487],
          image: 'https://images.pexels.com/photos/6542772/pexels-photo-6542772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          type: 'food'
        }
      ]
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
      pointsOfInterest: [
        {
          id: 'castel-dellovo',
          name: 'Castel dell\'Ovo',
          description: 'Il più antico castello di Napoli, situato sull\'isolotto di Megaride. Secondo la leggenda, il poeta Virgilio nascose nelle sue fondamenta un uovo magico che, finché resta intatto, proteggerà la città dalle catastrofi. Dalla terrazza del castello si gode di una vista spettacolare sul golfo.',
          coordinates: [40.8299, 14.2476],
          image: 'https://images.pexels.com/photos/14679976/pexels-photo-14679976.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          type: 'cultural'
        },
        {
          id: 'villa-comunale',
          name: 'Villa Comunale',
          description: 'Storico giardino pubblico di Napoli, realizzato alla fine del XVIII secolo su progetto di Carlo Vanvitelli. Al suo interno si trovano fontane, statue e il più antico acquario d\'Italia, la Stazione Zoologica Anton Dohrn.',
          coordinates: [40.8318, 14.2322],
          image: 'https://images.pexels.com/photos/13437186/pexels-photo-13437186.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          type: 'cultural'
        },
        {
          id: 'mergellina',
          name: 'Porto di Mergellina',
          description: 'Antico borgo di pescatori, oggi è un elegante quartiere residenziale e una popolare meta turistica. Il porticciolo è pieno di barche e yacht, e lungo la banchina si trovano numerosi ristoranti dove gustare piatti a base di pesce fresco.',
          coordinates: [40.8295, 14.2180],
          image: 'https://images.pexels.com/photos/2973312/pexels-photo-2973312.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          type: 'food'
        },
        {
          id: 'parco-virgiliano',
          name: 'Parco Virgiliano',
          description: 'Terrazza panoramica sulla collina di Posillipo, offre una vista spettacolare su tutto il Golfo di Napoli, le isole e il Vesuvio. Il parco è dedicato al poeta Virgilio, che secondo la tradizione sarebbe sepolto nelle vicinanze.',
          coordinates: [40.8017, 14.1870],
          image: 'https://images.pexels.com/photos/672916/pexels-photo-672916.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          type: 'cultural'
        }
      ]
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
      pointsOfInterest: [
        {
          id: 'napoli-sotterranea-tour',
          name: 'Napoli Sotterranea (Tour)',
          description: 'Il percorso più famoso per esplorare il sottosuolo di Napoli, con accesso da Piazza San Gaetano. Durante la visita si attraversano gli ambienti dell\'antico acquedotto greco-romano, utilizzati nei secoli come cisterne per l\'approvvigionamento idrico e come rifugi durante i bombardamenti della Seconda Guerra Mondiale.',
          coordinates: [40.8508, 14.2573],
          image: 'https://images.pexels.com/photos/11658672/pexels-photo-11658672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          type: 'cultural'
        },
        {
          id: 'catacomba-san-gennaro',
          name: 'Catacombe di San Gennaro',
          description: 'Le più importanti catacombe di Napoli, dove si trovano le spoglie di San Gennaro, patrono della città. Si tratta di un vasto complesso sotterraneo che testimonia la diffusione del cristianesimo a Napoli nei primi secoli dopo Cristo.',
          coordinates: [40.8631, 14.2428],
          image: 'https://images.pexels.com/photos/7977302/pexels-photo-7977302.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          type: 'cultural'
        },
        {
          id: 'teatro-romano',
          name: 'Teatro Romano',
          description: 'I resti dell\'antico teatro romano, inglobati nei palazzi del centro storico. Risalente al I secolo d.C., era in grado di ospitare fino a 5.000 spettatori. Oggi è possibile visitare i corridoi sotterranei e parte della cavea.',
          coordinates: [40.8498, 14.2555],
          image: 'https://images.pexels.com/photos/12472654/pexels-photo-12472654.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          type: 'cultural'
        },
        {
          id: 'galleria-borbonica',
          name: 'Galleria Borbonica',
          description: 'Commissionata da Ferdinando II di Borbone come via di fuga dal Palazzo Reale verso la caserma, la galleria è stata utilizzata come rifugio antiaereo durante la Seconda Guerra Mondiale e come deposito per veicoli sequestrati nei decenni successivi. Oggi offre diversi percorsi di visita che raccontano la storia della città.',
          coordinates: [40.8352, 14.2442],
          image: 'https://images.pexels.com/photos/10958833/pexels-photo-10958833.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          type: 'cultural'
        }
      ]
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
      pointsOfInterest: [
        {
          id: 'special-napoli-tour',
          name: 'Napoli Sotterranea (Tour)',
          description: 'Il percorso più famoso per esplorare il sottosuolo di Napoli, con accesso da Piazza San Gaetano. Durante la visita si attraversano gli ambienti dell\'antico acquedotto greco-romano, utilizzati nei secoli come cisterne per l\'approvvigionamento idrico e come rifugi durante i bombardamenti della Seconda Guerra Mondiale.',
          coordinates: [40.8508, 14.2573],
          image: 'https://images.pexels.com/photos/11658672/pexels-photo-11658672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          type: 'cultural'
        },
        {
          id: 'catacomba-san-gennaro',
          name: 'Catacombe di San Gennaro',
          description: 'Le più importanti catacombe di Napoli, dove si trovano le spoglie di San Gennaro, patrono della città. Si tratta di un vasto complesso sotterraneo che testimonia la diffusione del cristianesimo a Napoli nei primi secoli dopo Cristo.',
          coordinates: [40.8631, 14.2428],
          image: 'https://images.pexels.com/photos/7977302/pexels-photo-7977302.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          type: 'cultural'
        },
        {
          id: 'teatro-romano',
          name: 'Teatro Romano',
          description: 'I resti dell\'antico teatro romano, inglobati nei palazzi del centro storico. Risalente al I secolo d.C., era in grado di ospitare fino a 5.000 spettatori. Oggi è possibile visitare i corridoi sotterranei e parte della cavea.',
          coordinates: [40.8498, 14.2555],
          image: 'https://images.pexels.com/photos/12472654/pexels-photo-12472654.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          type: 'cultural'
        },
        {
          id: 'galleria-borbonica',
          name: 'Galleria Borbonica',
          description: 'Commissionata da Ferdinando II di Borbone come via di fuga dal Palazzo Reale verso la caserma, la galleria è stata utilizzata come rifugio antiaereo durante la Seconda Guerra Mondiale e come deposito per veicoli sequestrati nei decenni successivi. Oggi offre diversi percorsi di visita che raccontano la storia della città.',
          coordinates: [40.8352, 14.2442],
          image: 'https://images.pexels.com/photos/10958833/pexels-photo-10958833.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          type: 'cultural'
        }
      ]
    }
  ];
  
  export default itineraries;