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

export interface CartItem {
  id: string;
  title: string;
  size: string;
  paperType: string;
  price: number;
  image: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
}

export interface Profile {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (userData: Omit<User, 'id'> & Omit<Profile, 'id'>) => Promise<{ data: { user: User | null }; error: string | null }>;
  signOut: () => Promise<void>; 
  isUsernameUnique: (username: string) => Promise<{ data: boolean; error: string | null }>;
  isEmailUnique: (email: string) => Promise<boolean>;
  updateProfile: (profileData: Partial<Profile>) => Promise<void>;
  updateAvatar: (userId: string, avatarUrl: string) => Promise<boolean>;
}

export interface CartContextType {
 cartItems: CartItem[];
 setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
 addToCart: (item: CartItem) => void;
 removeFromCart: (itemId: string) => void;
}

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