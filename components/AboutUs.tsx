import React from 'react';

export default function AboutUs() {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-semibold">О нас</h2>
      <p className="text-gray-700">
        Мы — компания «SPB Conditioner», занимаемся продажей и обслуживанием кондиционеров в Санкт-Петербурге.
        Наши специалисты помогут подобрать оптимальную модель, установить и обслуживать её.
      </p>
      <p className="text-gray-700">
        Адрес офиса: Санкт-Петербург, Невский проспект, д. 10.
        Телефон: +7 (812) 123-45-67.
      </p>
    </div>
  );
}
