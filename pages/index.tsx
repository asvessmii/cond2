import React, { useState, useEffect } from 'react';
import Catalog from '../components/Catalog';
import Cart from '../components/Cart';
import FeedbackForm from '../components/FeedbackForm';
import AboutUs from '../components/AboutUs';
import productsData, { Product } from '../data/products';

export type CartItem = Product & { qty: number };

enum Tab {
  Catalog = 'catalog',
  Feedback = 'feedback',
  About = 'about',
  Cart = 'cart',
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Catalog);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.expand();
    }
  }, []);

  const addToCart = (prod: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === prod.id);
      if (existing) {
        return prev.map((item) =>
          item.id === prod.id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        return [...prev, { ...prod, qty: 1 }];
      }
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-white">
      <nav className="flex bg-telegram text-white">
        <button
          onClick={() => setActiveTab(Tab.Catalog)}
          className={`flex-1 py-3 text-center ${
            activeTab === Tab.Catalog ? 'bg-opacity-90' : 'bg-opacity-70'
          }`}
        >
          Каталог
        </button>
        <button
          onClick={() => setActiveTab(Tab.Feedback)}
          className={`flex-1 py-3 text-center ${
            activeTab === Tab.Feedback ? 'bg-opacity-90' : 'bg-opacity-70'
          }`}
        >
          Обратная связь
        </button>
        <button
          onClick={() => setActiveTab(Tab.About)}
          className={`flex-1 py-3 text-center ${
            activeTab === Tab.About ? 'bg-opacity-90' : 'bg-opacity-70'
          }`}
        >
          О нас
        </button>
        <button
          onClick={() => setActiveTab(Tab.Cart)}
          className={`flex-1 py-3 text-center ${
            activeTab === Tab.Cart ? 'bg-opacity-90' : 'bg-opacity-70'
          }`}
        >
          Корзина ({cartItems.reduce((sum, it) => sum + it.qty, 0)})
        </button>
      </nav>
      <main className="flex-1 overflow-auto">
        {activeTab === Tab.Catalog && <Catalog onAddToCart={addToCart} />}
        {activeTab === Tab.Feedback && <FeedbackForm />}
        {activeTab === Tab.About && <AboutUs />}
        {activeTab === Tab.Cart && <Cart cartItems={cartItems} onClearCart={clearCart} />}
      </main>
    </div>
  );
}
