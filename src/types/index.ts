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
  firstName: string;
  lastName: string;
  username: string;
  birthDate: string;
  address: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: Omit<User, 'id'>) => Promise<void>;
  signOut: () => void;
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