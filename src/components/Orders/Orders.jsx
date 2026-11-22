'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Icon } from '@/components/Icons/Icons';
import { Initials, MethodTag, StatusChip } from '@/components/StatusChip/StatusChip';
import OrderDrawer from '@/components/OrderDrawer/OrderDrawer';
import { METHODS } from '@/lib/constants';
import { ago, gel } from '@/lib/format';
import './Orders.css';

const STATUS_CHIPS = [['all', 'ყველა'], ['paid', 'გადახდილი'], ['pending', 'მოლოდინში'], ['failed', 'წარუმატებელი'], ['refunded', 'დაბრუნებული']];
const METHOD_CHIPS = [['all', 'ყველა'], ['card', 'ბარათით'], ['split', 'განვადება'], ['later', 'მოგვიანებით']];

export default function Orders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('all');
  const [method, setMethod] = useState('all');
  const [q, setQ] = useState('');
  const [openId, setOpenId] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' });
      if (!res.ok) throw new Error();
      setOrders((await res.json()).orders);
    } catch {
      setError('შეკვეთები ვერ ჩაიტვირთა');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const list = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return (orders || []).filter(
      (o) =>
        (status === 'all' || o.status === status) &&
        (method === 'all' || o.method === method) &&
        (!qq || `${o.firstName} ${o.lastName} ${o.phone} ${o.ref} ${o.tour?.title}`.toLowerCase().includes(qq))
    );
  }, [orders, status, method, q]);

  const count = (key) => (orders || []).filter((o) => key === 'all' || o.status === key).length;
  const open = (orders || []).find((o) => o.id === openId) || null;

  function onChanged(updated) {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  }

  return (
    <section className="orders">
      <div className="ph">
        <div>
          <small className="mt">შეკვეთები და გადახდები</small>
          <h1 className="mt">შეკვეთები{orders ? ` · ${list.length}` : ''}</h1>
        </div>
      </div>

      <div className="orders__tools">
        <label className="orders__search">
          <Icon.search />
          <input className="inp" value={q} onChange={(e) => setQ(e.target.value)} placeholder="სახელი, ტელეფონი ან ჯავშნის ნომერი" aria-label="ძებნა" />
        </label>
        <div className="chips" role="group" aria-label="სტატუსი">
          {STATUS_CHIPS.map(([k, label]) => (
            <button key={k} className={`chip${status === k ? ' chip--on' : ''}`} aria-pressed={status === k} onClick={() => setStatus(k)}>
              {label} <span className="chip__n">{count(k)}</span>
            </button>
          ))}
        </div>
        <div className="chips" role="group" aria-label="გადახდის მეთოდი">
          <span className="chips__label">გადახდა:</span>
          {METHOD_CHIPS.map(([k, label]) => (
            <button key={k} className={`chip${method === k ? ' chip--on' : ''}`} aria-pressed={method === k} onClick={() => setMethod(k)}>
              {k !== 'all' && <i className="chip__dot" style={{ background: METHODS[k].color }} />}
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="empty">{error}</p>}
      {!orders && !error && <p className="loading">იტვირთება…</p>}

      {orders && (
        <>
          {/* desktop: table */}
          <div className="orders__table">
            <table>
              <thead>
                <tr>
                  <th className="mt">კლიენტი</th>
                  <th className="mt">ტური</th>
                  <th className="mt">მოგზ.</th>
                  <th className="mt">გადახდა</th>
                  <th className="mt">სტატუსი</th>
                  <th className="r mt">თანხა</th>
                  <th className="mt">ჯავშანი</th>
                </tr>
              </thead>
              <tbody>
                {list.length ? (
                  list.map((o) => (
                    <tr key={o.id} tabIndex={0} onClick={() => setOpenId(o.id)} onKeyDown={(e) => e.key === 'Enter' && setOpenId(o.id)}>
                      <td>
                        <div className="orders__who">
                          <Initials order={o} />
                          <div>
                            <b>
                              {o.firstName} {o.lastName}
                            </b>
                            <small className="num">{o.phone}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="orders__tour">
                          <b>{o.tour?.title}</b>
                          <small>{o.tour?.date}</small>
                        </div>
                      </td>
                      <td className="num">{o.people}</td>
                      <td>
                        <MethodTag method={o.method} />
                      </td>
                      <td>
                        <StatusChip status={o.status} />
                      </td>
                      <td className="r num">{gel(o.total)}</td>
                      <td>
                        <span className="orders__ref">{o.ref}</span>
                        <div className="orders__time">{ago(o.createdAt)}</div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="empty">
                      შეკვეთა ვერ მოიძებნა
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* phone: cards */}
          <div className="orders__cards">
            {list.length ? (
              list.map((o) => (
                <div key={o.id} className="oc" tabIndex={0} onClick={() => setOpenId(o.id)} onKeyDown={(e) => e.key === 'Enter' && setOpenId(o.id)}>
                  <Initials order={o} />
                  <div className="oc__who">
                    <b>
                      {o.firstName} {o.lastName}
                    </b>
                    <small>
                      {o.tour?.title} · {o.people} მოგზ.
                    </small>
                  </div>
                  <div className="oc__amt">
                    <b>{gel(o.total)}</b>
                  </div>
                  <div className="oc__meta">
                    <StatusChip status={o.status} />
                    <MethodTag method={o.method} />
                    <span className="oc__time">{ago(o.createdAt)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty">შეკვეთა ვერ მოიძებნა</div>
            )}
          </div>
        </>
      )}

      <OrderDrawer order={open} onClose={() => setOpenId(null)} onChanged={onChanged} />
    </section>
  );
}
