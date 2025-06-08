import React, { useEffect, useState } from 'react';

interface FeedbackData {
  type: 'feedback';
  name: string;
  phone: string;
  address: string;
  services: string[];
  comment: string;
}

export default function FeedbackForm() {
  const [tg, setTg] = useState<null | typeof window.Telegram.WebApp>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [services, setServices] = useState({
    installation: false,
    repair: false,
    maintenance: false,
  });
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.expand();
      setTg(window.Telegram.WebApp);
    }
  }, []);

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => setSubmitted(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setServices((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selected = [];
    if (services.installation) selected.push('Установка');
    if (services.repair) selected.push('Ремонт');
    if (services.maintenance) selected.push('Техобслуживание');

    const payload: FeedbackData = {
      type: 'feedback',
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      services: selected,
      comment: comment.trim(),
    };

    if (tg) {
      tg.sendData(JSON.stringify(payload));
    }

    setName('');
    setPhone('');
    setAddress('');
    setServices({ installation: false, repair: false, maintenance: false });
    setComment('');
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <h2 className="text-2xl font-semibold">Обратная связь</h2>

      <div className="flex flex-col">
        <label className="mb-1 font-medium">Имя</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ваше имя"
          required
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-telegram"
        />
      </div>
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Телефон</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+7 (___) ___-__-__"
          required
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-telegram"
        />
      </div>
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Адрес</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Ваш адрес"
          required
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-telegram"
        />
      </div>
      <div className="flex flex-col">
        <span className="mb-1 font-medium">Выберите услугу:</span>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="installation"
              checked={services.installation}
              onChange={handleServiceChange}
              className="form-checkbox h-5 w-5 text-telegram"
            />
            <span>Установка</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="repair"
              checked={services.repair}
              onChange={handleServiceChange}
              className="form-checkbox h-5 w-5 text-telegram"
            />
            <span>Ремонт</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="maintenance"
              checked={services.maintenance}
              onChange={handleServiceChange}
              className="form-checkbox h-5 w-5 text-telegram"
            />
            <span>Техобслуживание</span>
          </label>
        </div>
      </div>
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Комментарий</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Сообщение"
          rows={4}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-telegram"
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full bg-telegram text-white py-3 rounded-2xl text-lg hover:bg-opacity-90"
      >
        Отправить
      </button>
      {submitted && (
        <p className="text-center text-green-600">
          Ваша анкета отправлена, ожидайте обратной связи в ближайшее время.
        </p>
      )}
    </form>
  );
}
