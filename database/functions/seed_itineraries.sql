-- ============================================================
-- Script SQL per popolare la tabella itineraries
-- Esegui questo script nel Supabase SQL Editor
-- ============================================================

-- Disabilita temporaneamente RLS per l'insert
ALTER TABLE itineraries DISABLE ROW LEVEL SECURITY;

-- Insert dei dati
INSERT INTO itineraries (id, title, short_description, cover_image, full_description, distance, estimated_time, difficulty)
VALUES
  ('centro-storico', 
   'Centro Storico di Napoli', 
   'Un percorso attraverso il cuore pulsante di Napoli, tra vicoli, chiese e monumenti storici.',
   'https://images.pexels.com/photos/2147490/pexels-photo-2147490.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
   'Il Centro Storico di Napoli, dichiarato Patrimonio dell''Umanità dall''UNESCO, racchiude oltre 2500 anni di storia. Questo itinerario vi porterà alla scoperta dei luoghi più iconici del centro, dove ogni pietra racconta una storia e ogni angolo rivela un tesoro nascosto. Passeggiando per le vie di Spaccanapoli, l''antico decumano che taglia in due il centro storico, vi immergerete nella vita quotidiana napoletana, tra botteghe artigiane, chiese monumentali e piccoli caffè storici.',
   3.5,
   '3-4 ore',
   'facile'
  ),
  ('lungomare-mergellina',
   'Lungomare e Mergellina',
   'Una passeggiata lungo il mare di Napoli, tra panorami mozzafiato e sapori autentici.',
   'https://images.pexels.com/photos/14679976/pexels-photo-14679976.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
   'Il Lungomare di Napoli, conosciuto anche come Via Caracciolo, è uno dei luoghi più suggestivi della città. Questo itinerario vi porterà alla scoperta di un tratto di costa che offre panorami indimenticabili sul Golfo di Napoli, con il Vesuvio sullo sfondo e l''isola di Capri all''orizzonte. Lungo il percorso incontrerete monumenti storici, locali alla moda e ristoranti dove assaporare le specialità della cucina napoletana a base di pesce.',
   4.2,
   '2-3 ore',
   'facile'
  ),
  ('napoli-sotterranea',
   'Napoli Sotterranea',
   'Un viaggio nel sottosuolo di Napoli, tra cisterne romane, gallerie e rifugi antiaerei.',
   'https://images.pexels.com/photos/10580223/pexels-photo-10580223.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
   'Napoli è una città che si sviluppa non solo in superficie, ma anche nel sottosuolo. Questo itinerario vi porterà alla scoperta di un mondo nascosto, fatto di cisterne greche e romane, gallerie, acquedotti e rifugi antiaerei. Un viaggio attraverso più di duemila anni di storia, che vi permetterà di conoscere un aspetto meno noto ma affascinante della città partenopea.',
   2.8,
   '4-5 ore',
   'media'
  ),
  ('special-napoli',
   'Napoli Special',
   'Un viaggio nel sottosuolo di Napoli, tra cisterne romane, gallerie e rifugi antiaerei.',
   'https://images.pexels.com/photos/10580223/pexels-photo-10580223.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
   'Napoli è una città che si sviluppa non solo in superficie, ma anche nel sottosuolo. Questo itinerario vi porterà alla scoperta di un mondo nascosto, fatto di cisterne greche e romane, gallerie, acquedotti e rifugi antiaerei. Un viaggio attraverso più di duemila anni di storia, che vi permetterà di conoscere un aspetto meno noto ma affascinante della città partenopea.',
   2.8,
   '4-5 ore',
   'media'
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  cover_image = EXCLUDED.cover_image,
  full_description = EXCLUDED.full_description,
  distance = EXCLUDED.distance,
  estimated_time = EXCLUDED.estimated_time,
  difficulty = EXCLUDED.difficulty;

-- Ricalcola le statistiche della tabella
ANALYZE itineraries;

-- Rabilita RLS per la sicurezza
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;

-- Verifica l'inserimento
SELECT id, title, difficulty FROM itineraries WHERE id IN ('centro-storico', 'lungomare-mergellina', 'napoli-sotterranea', 'special-napoli');
