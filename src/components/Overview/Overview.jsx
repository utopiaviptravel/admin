'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Kpis from '@/components/Kpis/Kpis';
import RevenueChart from '@/components/RevenueChart/RevenueChart';
import PaymentMethods from '@/components/PaymentMethods/PaymentMethods';
import RecentOrders from '@/components/RecentOrders/RecentOrders';
import OrderDrawer from '@/components/OrderDrawer/OrderDrawer';
import { Icon } from '@/components/Icons/Icons';
import { longDate } from '@/lib/format';
import './Overview.css';

export default function Overview() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [openId, setOpenId] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/stats', { cache: 'no-store' });
      if (!res.ok) throw new Error();
      setData(await res.json());
      setError('');
    } catch {
      setError('მონაცემები ვერ ჩაიტვირთა');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const open = data?.recent.find((o) => o.id === openId) || null;

  return (
    <section className="overview">
      <div className="ph">
        <div>
          <small className="mt">{longDate()}</small>
          <h1 className="mt">გამარჯობა, ადმინ</h1>
        </div>
        <Link href="/orders" className="btn sm">
          <span className="mt">ყველა შეკვეთა</span>
          <Icon.arrow />
        </Link>
      </div>

      {error && <p className="empty">{error}</p>}
      {!data && !error && <p className="loading">იტვირთება…</p>}

      {data && (
        <>
          <Kpis data={data} />

          <div className="overview__grid">
            <div className="pn">
              <div className="pn-h">
                <h2 className="mt">შემოსავალი · ბოლო 14 დღე</h2>
              </div>
              <RevenueChart days={data.days} />
            </div>
            <div className="pn">
              <div className="pn-h">
                <h2 className="mt">გადახდის მეთოდები</h2>
              </div>
              <PaymentMethods methods={data.methods} occupancy={data.occupancy} />
            </div>
          </div>

          <div className="pn">
            <div className="pn-h">
              <h2 className="mt">ბოლო შეკვეთები</h2>
              <Link href="/orders" className="mt">ყველა</Link>
            </div>
            <RecentOrders orders={data.recent} onOpen={setOpenId} />
          </div>
        </>
      )}

      <OrderDrawer order={open} onClose={() => setOpenId(null)} onChanged={load} />
    </section>
  );
}
