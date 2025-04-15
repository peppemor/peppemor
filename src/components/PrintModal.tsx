import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ModalProps, PrintSize, PaperType } from '../types';
import { paperTypes } from '../data/prints';

const PrintModal: React.FC<ModalProps> = ({ print, isOpen, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState<PrintSize | null>(null);
  const [selectedPaper, setSelectedPaper] = useState<PaperType | null>(null);

  if (!isOpen || !print) return null;

  const calculatePrice = (): number => {
    if (!selectedSize || !selectedPaper) return 0;
    return selectedSize.price * selectedPaper.priceMultiplier;
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedPaper) return;

    onAddToCart({
      id: `${print.id}-${selectedSize.size}-${selectedPaper.id}`,
      title: print.title,
      size: selectedSize.size,
      paperType: selectedPaper.name,
      price: calculatePrice(),
      image: print.image
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{print.title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img 
                src={print.image} 
                alt={print.title}
                className="w-full rounded-lg shadow-lg"
              />
              <p className="mt-4 text-gray-600">{print.description}</p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Select Size</h3>
                <div className="grid grid-cols-2 gap-2">
                  {print.sizes.map((size) => (
                    <button
                      key={size.size}
                      onClick={() => setSelectedSize(size)}
                      className={`p-3 border rounded-lg text-sm ${
                        selectedSize?.size === size.size
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">{size.size}</div>
                      <div className="text-gray-600">€{size.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Select Paper Type</h3>
                <div className="space-y-2">
                  {paperTypes.map((paper) => (
                    <button
                      key={paper.id}
                      onClick={() => setSelectedPaper(paper)}
                      className={`w-full p-3 border rounded-lg text-left ${
                        selectedPaper?.id === paper.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">{paper.name}</div>
                      <div className="text-sm text-gray-600">{paper.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold">
                    €{calculatePrice().toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize || !selectedPaper}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintModal;