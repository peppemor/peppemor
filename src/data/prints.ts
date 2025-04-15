import { Print, PaperType } from '../types';

export const prints: Print[] = [
  {
    id: "1",
    title: "Spaccanapoli View",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "The historic center of Naples",
    sizes: [
      { size: "20x30cm", price: 49.99 },
      { size: "30x45cm", price: 79.99 },
      { size: "50x75cm", price: 129.99 },
      { size: "60x90cm", price: 179.99 },
    ]
  },
  {
    id: "2",
    title: "Vesuvius at Dawn",
    image: "https://images.unsplash.com/photo-1534445967719-8ae7b972b1a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Mount Vesuvius overlooking the bay",
    sizes: [
      { size: "20x30cm", price: 49.99 },
      { size: "30x45cm", price: 79.99 },
      { size: "50x75cm", price: 129.99 },
      { size: "60x90cm", price: 179.99 },
    ]
  },
  {
    id: "3",
    title: "Napoli Street Life",
    image: "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Daily life in the Spanish Quarter",
    sizes: [
      { size: "20x30cm", price: 49.99 },
      { size: "30x45cm", price: 79.99 },
      { size: "50x75cm", price: 129.99 },
      { size: "60x90cm", price: 179.99 },
    ]
  }
];

export const paperTypes: PaperType[] = [
  {
    id: "matte",
    name: "Matte Photo Paper",
    description: "Premium matte finish with minimal glare, perfect for art prints",
    priceMultiplier: 1.0
  },
  {
    id: "glossy",
    name: "High Gloss Photo Paper",
    description: "Vibrant colors with a brilliant shine",
    priceMultiplier: 1.1
  },
  {
    id: "metallic",
    name: "Metallic Photo Paper",
    description: "Pearl-metallic surface for stunning depth and vibrancy",
    priceMultiplier: 1.3
  },
  {
    id: "canvas",
    name: "Fine Art Canvas",
    description: "Gallery-quality canvas with a textured surface",
    priceMultiplier: 1.5
  }
];