import React, { useState } from 'react';
import { Print } from '../types/index.js';
import { prints } from '../data/prints.js';
import PrintModal from '../components/PrintModal.js';
import { useCart } from '../contexts/CartContext.js';



const Gallery: React.FC = () => {
  const { addToCart } = useCart();
  const [selectedPrint, setSelectedPrint] = useState<Print | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = (print: Print) => {
    setSelectedPrint(print);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPrint(null);
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="mb-12 text-center">
      <h1 className="font-serif md:text-3xl font-bold text-gray-800 mb-4">
          Gallery
        </h1>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {prints.map((print) => (
          <div 
            key={print.id} 
            className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-[1.02]"
            onClick={() => openModal(print)}
          >
            <div className="relative pb-[66.666667%]">
              <img 
                src={print.image} 
                alt={print.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{print.title}</h3>
              <p className="text-gray-600">{print.description}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedPrint && (
        <PrintModal
          print={selectedPrint}
          isOpen={isModalOpen}
          onClose={closeModal}
          onAddToCart={addToCart}
        />
      )}
    </div>
  );
};

export default Gallery;