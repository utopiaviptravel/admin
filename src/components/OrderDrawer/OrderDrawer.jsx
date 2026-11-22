'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/Icons/Icons';
import { MethodTag, StatusChip } from '@/components/StatusChip/StatusChip';
import { useToast } from '@/components/Toast/Toast';
import { fdate, gel } from '@/lib/format';
import './OrderDrawer.css';

// slide-in panel with one order's details and actions
export default function OrderDrawer({ order, onClose, onChanged }) {
  const toast = useToast();
  const [shown, setShown] = useState(order); // keeps content while closing
  const [reveal, setReveal] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (order) setShown(order);
    if (order?.id !== shown?.id) setReveal(false);
  }, [order]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function act(action) {
    if (action === 'refund' && !window.confirm('ნამდვილად გინდა თანხის დაბრუნება?')) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/orders/${shown.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'ვერ შეინახა');
      toast(action === 'confirm' ? 'შეკვეთა მოინიშნა გადახდილად' : 'თანხის დაბრუნება დაიწყო');
      setShown(data.order);
      onChanged?.(data.order);
    } catch (err) {
      toast(err.message);
    } finally {
      setBusy(false);
    }
  }

  const o = shown;
  const isOpen = Boolean(order);
  const tel = o ? o.phone.replace(/\D/g, '') : '';
  const pid = o?.personalId || '';
  const pidMasked = pid ? pid.slice(0, 3) + '•••••' + pid.slice(-3) : '—';

  return (
    <>
      <div className={`scrim${isOpen ? ' scrim--on' : ''}`} onClick={onClose} />
      <aside className={`drawer${isOpen ? ' drawer--on' : ''}`} role="dialog" aria-modal="true" aria-label="შეკვეთის დეტალები">
        {o && (
          <>
            <div className="drawer__head">
              <div>
                <small>{o.ref}</small>
                <h2>
                  {o.firstName} {o.lastName}
                </h2>
                <div className="drawer__status">
                  <StatusChip status={o.status} />
                </div>
              </div>
              <button className="drawer__x" onClick={onClose} aria-label="დახურვა">
                <Icon.x />
              </button>
            </div>

            <div className="drawer__body">
              <div className="sec">
                <h3 className="mt">კლიენტი</h3>
                <div className="kv">
                  <span>ტელეფონი</span>
                  <b className="num">{o.phone}</b>
                </div>
                <div className="kv">
                  <span>პირადი ნომერი</span>
                  <b className="num">
                    {reveal ? pid : pidMasked}
                    {!reveal && pid && (
                      <button className="kv__reveal" onClick={() => setReveal(true)}>
                        ჩვენება
                      </button>
                    )}
                  </b>
                </div>
                <div className="sec__btns">
                  <a className="btn sm" href={`tel:+${tel}`}>
                    <Icon.phone />
                    დარეკვა
                  </a>
                  <a className="btn sm" href={`https://wa.me/${tel}`} target="_blank" rel="noopener noreferrer">
                    <Icon.wa />
                    WhatsApp
                  </a>
                </div>
              </div>

              <div className="sec">
                <h3 className="mt">მოგზაურობა</h3>
                <div className="kv">
                  <span>ტური</span>
                  <b>{o.tour?.title}</b>
                </div>
                <div className="kv">
                  <span>თარიღი</span>
                  <b>{o.tour?.date}</b>
                </div>
                <div className="kv">
                  <span>მოგზაურები</span>
                  <b className="num">{o.people}</b>
                </div>
                <div className="kv">
                  <span>ფასი / ადამიანი</span>
                  <b className="num">{gel(o.tour?.price)}</b>
                </div>
                <div className="sec__total">
                  <span>სულ</span>
                  <b>{gel(o.total)}</b>
                </div>
              </div>

              <div className="sec">
                <h3 className="mt">გადახდა</h3>
                <div className="kv">
                  <span>მეთოდი</span>
                  <b>
                    <MethodTag method={o.method} />
                  </b>
                </div>
                {o.method === 'split' && (
                  <>
                    <div className="kv">
                      <span>ბანკი</span>
                      <b>{o.bank}</b>
                    </div>
                    <div className="sec__inst">
                      <div>
                        <small>ვადა</small>
                        <b>{o.months} თვე</b>
                      </div>
                      <div>
                        <small>ყოველთვიური</small>
                        <b>{gel(o.total / (o.months || 1))}</b>
                      </div>
                      <div>
                        <small>სტატუსი</small>
                        <b className={o.status === 'paid' ? 'is-good' : 'is-warn'}>{o.status === 'paid' ? 'დამტკიცდა' : 'განხილვაში'}</b>
                      </div>
                    </div>
                  </>
                )}
                <div className="kv">
                  <span>შეკვეთის დრო</span>
                  <b>{fdate(o.createdAt)}</b>
                </div>
              </div>

              {o.history.length > 0 && (
                <div className="sec">
                  <h3 className="mt">ისტორია</h3>
                  <ul className="tl">
                    {o.history.map((h, i) => (
                      <li key={i} className={`tl--${h.state}`}>
                        {h.label}
                        <small>{h.note || fdate(h.at)}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="drawer__foot">
              {o.status === 'pending' ? (
                <button className="btn gold" disabled={busy} onClick={() => act('confirm')}>
                  <Icon.check />
                  <span className="mt">გადახდილად მონიშვნა</span>
                </button>
              ) : (
                <button className="btn" onClick={() => toast('ქვითარი მზადდება…')}>
                  <Icon.doc />
                  <span className="mt">ქვითარი</span>
                </button>
              )}
              {o.status === 'paid' && (
                <button className="btn" disabled={busy} onClick={() => act('refund')}>
                  <Icon.back />
                  <span className="mt">დაბრუნება</span>
                </button>
              )}
            </div>
          </>
        )}
      </aside>
    </>
  );
}
