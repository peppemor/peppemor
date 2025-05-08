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


//ITINERARIES


export interface PointOfInterest {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number]; // [latitude, longitude]
  image?: string;
  type: 'cultural' | 'food';
}

export interface Itinerary {
  id: string;
  title: string;
  shortDescription: string;
  coverImage: string;
  fullDescription: string;
  distance: number; // in kilometers
  estimatedTime: string;
  difficulty: 'facile' | 'media' | 'difficile';
  pointsOfInterest: PointOfInterest[];
}


// CART

export interface CartItem {
  id: string;
  title: string;
  size: string;
  paperType: string;
  price: number;
  image: string;
}


//USER

export interface User {
  id: string;
  email: string;
  password: string;
  is_admin: boolean;
}

export interface Profile {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
}

//CONTEXT

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