import React from 'react';
import products, { Product } from '../data/products';

interface CatalogProps {
  onAddToCart: (product: Product) => void;
}

export default function Catalog({ onAddToCart }: CatalogProps) {
  return (
    <div className="p-4 space-y-6">
      {products.map((prod) => (
        <div
          key={prod.id}
          className="border border-gray-200 rounded-xl overflow-hidden flex flex-col md:flex-row"
        >
          <div className="w-full md:w-1/3 bg-gray-100">
            <img
              src={prod.image}
              alt={prod.name}
              className="w-full h-48 object-cover"
            />
          </div>
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold">{prod.name}</h3>
              <p className="text-gray-600">{prod.description}</p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg font-bold">{prod.price} ₽</span>
              <button
                onClick={() => onAddToCart(prod)}
                className="bg-telegram text-white px-4 py-2 rounded-xl hover:bg-opacity-90"
              >
                В корзину
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
