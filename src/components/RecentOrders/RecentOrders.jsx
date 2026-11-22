import { Initials, StatusChip } from '@/components/StatusChip/StatusChip';
import { ago, gel } from '@/lib/format';
import './RecentOrders.css';

export default function RecentOrders({ orders, onOpen }) {
  if (!orders.length) return <p className="empty">შეკვეთები ჯერ არ არის</p>;
  return (
    <ul className="recent">
      {orders.map((o) => (
        <li key={o.id} onClick={() => onOpen(o.id)} onKeyDown={(e) => e.key === 'Enter' && onOpen(o.id)} tabIndex={0}>
          <Initials order={o} />
          <div className="recent__who">
            <b>
              {o.firstName} {o.lastName}
            </b>
            <small>
              {o.tour?.title} · {o.people} მოგზ. · {ago(o.createdAt)}
            </small>
          </div>
          <div className="recent__amt">
            <b>{gel(o.total)}</b>
            <StatusChip status={o.status} />
          </div>
        </li>
      ))}
    </ul>
  );
}
