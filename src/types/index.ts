
// Import dei tipi generati da Supabase
import { Database } from './supabase';

//PRINTS

export interface PrintSize {
  size: string;
  price: number;
}

export interface PaperType {
  id: string;
  name: string;
  description: string;
  priceMultiplier: number;
}

export interface Print {
  id: string;
  title: string;
  description: string;
  image: string;
  sizes: PrintSize[];
}

//ITINERARIES - Utilizzando i tipi generati da Supabase
export type Itinerary = Database['public']['Tables']['itineraries']['Row'];
export type PointOfInterest = Database['public']['Tables']['points_of_interest']['Row'];

// CART
export interface CartItem {
  id: string;
  title: string;
  size: string;
  paperType: string;
  price: number;
  image: string;
}

//USER - Utilizzando i tipi generati da Supabase
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type UserRole = Database['public']['Tables']['user_roles']['Row'];
export type SupabaseAuthUser = Database['auth']['Tables']['users']['Row'];

// Tipo User che estende il tipo di Supabase con campi aggiuntivi necessari
export interface User extends Pick<SupabaseAuthUser, 'id' | 'email'> {
  password: string; // Campo aggiuntivo per compatibilità frontend
  is_admin: boolean; // Campo derivato da user_roles
}

//CONTEXT

/**
 * Context type for authentication and user management functionality.
 * 
 * @interface AuthContextType
 * 
 * @property {User | null} user - The currently authenticated user object, or null if not authenticated
 * @property {Profile | null} profile - The user's profile information, or null if not available
 * @property {boolean} isLoading - Loading state indicator for authentication operations
 * @property {function} signIn - Authenticates a user with email and password credentials
 * @property {function} signUp - Registers a new user account with provided user and profile data
 * @property {function} signOut - Signs out the current user and clears authentication state
 * @property {function} getUserSession - Retrieves the current user session with access token
 * @property {function} isUsernameUnique - Checks if a username is available for registration
 * @property {function} isEmailUnique - Validates if an email address is not already in use
 * @property {function} updateProfile - Updates the current user's profile information
 */
export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (userData: Omit<User, 'id'> & Omit<Profile, 'id'>) => Promise<{ data: { user: User | null }; error: string | null }>;
  signOut: () => Promise<void>; 
  getUserSession: () => Promise<{ data: { session: { access_token: string } }; error: string | null }>;
  isUsernameUnique: (username: string) => Promise<{ data: boolean; error: string | null }>;
  isEmailUnique: (email: string) => Promise<boolean>;
  updateProfile: (profileData: Partial<Profile>) => Promise<void>;
}

/**
 * Context type for managing shopping cart state and operations.
 * 
 * @interface CartContextType
 * @property {CartItem[]} cartItems - Array of items currently in the shopping cart
 * @property {React.Dispatch<React.SetStateAction<CartItem[]>>} setCartItems - React state setter function for updating cart items
 * @property {(item: CartItem) => void} addToCart - Function to add an item to the cart
 * @property {(itemId: string) => void} removeFromCart - Function to remove an item from the cart by its ID
 */
export interface CartContextType {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
 }


//UTILS

// Add ModalProps definition and export
export interface ModalProps {
  print: {
    id: string;
    title: string;
    description: string;
    image: string;
    sizes: PrintSize[];
  };
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: {
    id: string;
    title: string;
    size: string;
    paperType: string;
    price: number;
    image: string;
  }) => void;
}