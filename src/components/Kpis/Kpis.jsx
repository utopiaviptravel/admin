import { gel } from '@/lib/format';
import './Kpis.css';

// four number tiles on top of the overview
export default function Kpis({ data }) {
  const delta = data.delta;
  return (
    <div className="kpis">
      <div className="kpi kpi--hero">
        <small className="mt">შემოსავალი · 14 დღე</small>
        <b>{gel(data.revenue)}</b>
        {delta !== null && (
          <span className={`kpi__delta${delta < 0 ? ' kpi__delta--warn' : ''}`}>
            {delta >= 0 ? '▲' : '▼'} {Math.abs(delta)}% წინა პერიოდთან
          </span>
        )}
      </div>
      <div className="kpi">
        <small className="mt">შეკვეთები</small>
        <b>{data.orders}</b>
        <span className="kpi__delta">{data.paid} გადახდილი</span>
      </div>
      <div className="kpi">
        <small className="mt">მოგზაურები</small>
        <b>{data.travellers}</b>
        <span className="kpi__delta">გადახდილ ჯავშნებში</span>
      </div>
      <div className="kpi">
        <small className="mt">ყურადღება სჭირდება</small>
        <b>{data.pending}</b>
        <span className="kpi__delta kpi__delta--warn">მოლოდინში · დაკავშირება</span>
      </div>
    </div>
  );
}
