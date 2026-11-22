import { Icon } from '@/components/Icons/Icons';
import { METHODS, STATUSES } from '@/lib/constants';
import { initials } from '@/lib/format';
import './StatusChip.css';

const STATUS_ICON = { paid: Icon.check, pending: Icon.clock, failed: Icon.x, refunded: Icon.back };

export function StatusChip({ status }) {
  const I = STATUS_ICON[status] || Icon.clock;
  return (
    <span className={`st st--${status}`}>
      <I />
      {STATUSES[status] || status}
    </span>
  );
}

export function MethodTag({ method }) {
  const m = METHODS[method] || { label: method, color: 'var(--muted)' };
  return (
    <span className="mth">
      <i style={{ background: m.color }} />
      {m.label}
    </span>
  );
}

export function Initials({ order }) {
  return <span className="ini">{initials(order)}</span>;
}
