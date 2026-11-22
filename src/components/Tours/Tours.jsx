'use client';

import { useEffect, useState } from 'react';
import { gel } from '@/lib/format';
import './Tours.css';

export default function Tours() {
  const [tours, setTours] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/tours', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setTours(d.tours))
      .catch(() => setError('ტურები ვერ ჩაიტვირთა'));
  }, []);

  return (
    <section className="tours">
      <div className="ph">
        <div>
          <small className="mt">გაყიდვები ტურების მიხედვით</small>
          <h1 className="mt">ტურები</h1>
        </div>
      </div>

      {error && <p className="empty">{error}</p>}
      {!tours && !error && <p className="loading">იტვირთება…</p>}
      {tours && !tours.length && <p className="empty">ტურები ჯერ არ არის</p>}

      {tours && tours.length > 0 && (
        <div className="tours__grid">
          {tours.map((t) => (
            <div key={t.id} className="tcard">
              <small>{t.place}</small>
              <h3>{t.title}</h3>
              <div className="occ-row">
                <div>
                  <span>ადგილები</span>
                  <span className="num">
                    {t.sold} / {t.seats}
                  </span>
                </div>
                <div className="occ-bar">
                  <i style={{ width: `${Math.min(100, (t.sold / (t.seats || 1)) * 100)}%` }} />
                </div>
              </div>
              <div className="tcard__row">
                <span>შემოსავალი</span>
                <b>{gel(t.revenue)}</b>
              </div>
              <div className="tcard__row">
                <span>შეკვეთები</span>
                <b>{t.orders}</b>
              </div>
              <div className="tcard__row">
                <span>ფასი / ადამიანი</span>
                <b>{gel(t.price)}</b>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
