/**
 * =====================================================================
 * APP-TYPES.TS - Tipi TypeScript specifici dell'applicazione
 * =====================================================================
 * 
 * Questo file contiene le definizioni dei tipi TypeScript utilizzati
 * nell'applicazione, organizzati per funzionalità.
 * 
 * I tipi qui definiti:
 * - Estendono i tipi generati da Prisma
 * - Definiscono interfacce per componenti React e Context
 * - Modellano le entità di business dell'app
 * 
 * MIGRAZIONE DA SUPABASE A PRISMA:
 * I tipi sono stati aggiornati per usare Prisma invece di Supabase
 */

// =====================================================================
// 🖼️ PRINTS - Tipi per il sistema di stampe/poster
// =====================================================================

/**
 * Dimensioni disponibili per una stampa con relativo prezzo
 */
export interface PrintSize {
  size: string;        // es. "20x30cm", "30x45cm"
  price: number;       // Prezzo (es. 49.99)
}

/**
 * Tipologia di carta disponibile per le stampe
 */
export interface PaperType {
  id: string;              // es. "matte", "glossy"
  name: string;            // es. "Matte Photo Paper"
  description: string;     // Descrizione dettagliata
  priceMultiplier: number; // Moltiplicatore del prezzo (es. 1.5 = +50%)
}

/**
 * Rappresenta una stampa/poster disponibile nel catalogo
 */
export interface Print {
  id: string;              // Identificatore unico
  title: string;           // Titolo della stampa
  description?: string;    // Descrizione dettagliata
  image: string;           // URL dell'immagine
  sizes: PrintSize[];      // Array delle dimensioni disponibili
}

// =====================================================================
// 🗺️ ITINERARIES - Tipi per itinerari turistici
// =====================================================================

/**
 * Itinerario turistico completo
 */
export interface Itinerary {
  id: string;
  title: string;
  shortDescription?: string;
  fullDescription?: string;
  coverImage?: string;
  distance?: number;
  estimatedTime?: string;
  difficulty?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Punto di interesse all'interno di un itinerario
 */
export interface PointOfInterest {
  id: string;
  itineraryId: string;
  name: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  visitDuration?: string;
  ticketPrice?: number;
  createdAt: Date;
  updatedAt: Date;
}

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
  size: string;      // Dimensione scelta (es. "20x30cm")
  paperType: string; // Tipo di carta scelto
  price: number;     // Prezzo finale calcolato
  image: string;     // URL dell'immagine del prodotto
}

// =====================================================================
// 👤 USER & AUTHENTICATION - Tipi per utenti e autenticazione
// =====================================================================

/**
 * Profilo utente completo da Prisma
 */
export interface Profile {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Ruoli utente nel sistema
 */
export interface UserRole {
  id: string;
  userId: string;
  role: string; // "admin", "user", etc.
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Utente dell'applicazione
 */
export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  // Non include password! È sensibile
}

// =====================================================================
// ⚛️ REACT CONTEXT - Tipi per Context API
// =====================================================================

/**
 * Context per la gestione del carrello della spesa
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
 */
export interface ModalProps {
  print: {
    id: string;
    title: string;
    description?: string;
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