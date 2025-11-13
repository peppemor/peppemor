
/**
 * =====================================================================
 * APP-TYPES.TS - Tipi TypeScript specifici dell'applicazione
 * =====================================================================
 * 
 * Questo file contiene le definizioni dei tipi TypeScript utilizzati
 * nell'applicazione, organizzati per funzionalità.
 * 
 * I tipi qui definiti:
 * - Estendono i tipi generati automaticamente da Supabase
 * - Definiscono interfacce per componenti React e Context
 * - Modellano le entità di business dell'app
 * 
 * IMPORTANTE: Non modificare manualmente i tipi in './supabase' 
 * perché sono auto-generati dal database.
 */

// Import dei tipi generati automaticamente da Supabase
import { Database } from './supabase';

// =====================================================================
// 🖼️ PRINTS - Tipi per il sistema di stampe/poster
// =====================================================================

/**
 * Dimensioni disponibili per una stampa con relativo prezzo
 */
export interface PrintSize {
  size: string;        // es. "A4", "A3", "50x70cm"
  price: number;       // Prezzo in centesimi (es. 2999 = €29.99)
}

/**
 * Tipologia di carta disponibile per le stampe
 */
export interface PaperType {
  id: string;              // Identificatore unico
  name: string;            // es. "Carta fotografica", "Carta fine art"
  description: string;     // Descrizione dettagliata
  priceMultiplier: number; // Moltiplicatore del prezzo (es. 1.5 = +50%)
}

/**
 * Rappresenta una stampa/poster disponibile nel catalogo
 */
export interface Print {
  id: string;              // Identificatore unico
  title: string;           // Titolo della stampa
  description: string;     // Descrizione dettagliata
  image: string;           // URL dell'immagine
  sizes: PrintSize[];      // Array delle dimensioni disponibili
}

// =====================================================================
// 🗺️ ITINERARIES - Tipi per itinerari turistici
// =====================================================================
// 
// NOTA: Questi tipi vengono direttamente dalle tabelle Supabase
// usando la notazione Database['public']['Tables']['nome_tabella']['Row']
// che ci garantisce type-safety con il database reale.

/**
 * Itinerario turistico completo
 * Tipo derivato dalla tabella 'itineraries' in Supabase
 */
export type Itinerary = Database['public']['Tables']['itineraries']['Row'];

/**
 * Punto di interesse all'interno di un itinerario
 * Tipo derivato dalla tabella 'points_of_interest' in Supabase
 */
export type PointOfInterest = Database['public']['Tables']['points_of_interest']['Row'];

// =====================================================================
// 🛒 CART - Tipi per il carrello della spesa
// =====================================================================

/**
 * Elemento nel carrello della spesa
 * Combina informazioni del prodotto con le scelte dell'utente
 */
export interface CartItem {
  id: string;        // ID del prodotto
  title: string;     // Nome del prodotto
  size: string;      // Dimensione scelta (es. "A4")
  paperType: string; // Tipo di carta scelto
  price: number;     // Prezzo finale calcolato
  image: string;     // URL dell'immagine del prodotto
}

// =====================================================================
// 👤 USER & AUTHENTICATION - Tipi per utenti e autenticazione
// =====================================================================

/**
 * Profilo utente completo
 * Tipo derivato dalla tabella 'profiles' in Supabase
 * Contiene: username, full_name, first_name, last_name, avatar_url, etc.
 */
export type Profile = Database['public']['Tables']['profiles']['Row'];

/**
 * Ruoli utente nel sistema
 * Tipo derivato dalla tabella 'user_roles' in Supabase
 * Gestisce i permessi (admin, user, etc.)
 */
export type UserRole = Database['public']['Tables']['user_roles']['Row'];

// =====================================================================
// ⚛️ REACT CONTEXT - Tipi per Context API
// =====================================================================

/**
 * Context per la gestione del carrello della spesa
 * 
 * Fornisce stato e operazioni per:
 * - Visualizzare items nel carrello
 * - Aggiungere/rimuovere prodotti
 * - Gestire lo stato del carrello nell'app
 */
export interface CartContextType {
  cartItems: CartItem[];                                              // Lista prodotti nel carrello
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;    // Setter React per aggiornare carrello
  addToCart: (item: CartItem) => void;                               // Funzione per aggiungere prodotto
  removeFromCart: (itemId: string) => void;                          // Funzione per rimuovere prodotto
}


// =====================================================================
// 🔧 UTILS & COMPONENTS - Tipi per componenti e utilità
// =====================================================================

/**
 * Props per il componente Modal di stampa
 * 
 * Utilizzato per mostrare i dettagli di una stampa con opzioni di personalizzazione
 * (dimensione, tipo carta) e possibilità di aggiungere al carrello
 */
export interface ModalProps {
  print: {
    id: string;
    title: string;
    description: string;
    image: string;
    sizes: PrintSize[];
  };
  isOpen: boolean;                    // Stato aperto/chiuso del modal
  onClose: () => void;                // Callback per chiudere il modal
  onAddToCart: (item: {              // Callback per aggiungere al carrello
    id: string;
    title: string;
    size: string;
    paperType: string;
    price: number;
    image: string;
  }) => void;
}