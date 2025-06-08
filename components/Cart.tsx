import React, { useEffect, useState } from 'react';
import { Product } from '../data/products';

interface CartItem extends Product {
  qty: number;
}

interface CartProps {
  cartItems: CartItem[];
  onClearCart: () => void;
}

export default function Cart({ cartItems, onClearCart }: CartProps) {
  const [tg, setTg] = useState<null | typeof window.Telegram.WebApp>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.expand();
      setTg(window.Telegram.WebApp);
    }
  }, []);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleSendOrder = () => {
    if (!tg) return;
    const payload = {
      type: 'order',
      cart: cartItems.map(({ id, name, price, qty }) => ({ id, name, price, qty })),
    };
    tg.sendData(JSON.stringify(payload));
    onClearCart();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Корзина</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-500">Корзина пуста</p>
      ) : (
        <>
          <ul className="space-y-2">
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>
                  {item.name} × {item.qty}
                </span>
                <span>{item.price * item.qty} ₽</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-xl font-bold">Итого: {total} ₽</span>
            <button
              onClick={handleSendOrder}
              className="bg-telegram text-white px-4 py-2 rounded-xl hover:bg-opacity-90"
            >
              Отправить заказ
            </button>
          </div>
        </>
      )}
    </div>
  );
}
