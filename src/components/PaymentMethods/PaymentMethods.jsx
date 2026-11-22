import { METHODS } from '@/lib/constants';
import { gel } from '@/lib/format';
import './PaymentMethods.css';

const KEYS = ['card', 'split', 'later'];

// share of each payment method + seats of the busiest tour
export default function PaymentMethods({ methods, occupancy }) {
  const total = KEYS.reduce((s, k) => s + methods[k].sum, 0) || 1;
  return (
    <div className="pm">
      <div className="pm__bar" role="img" aria-label="მეთოდების წილი">
        {KEYS.map((k) => (
          <span key={k} style={{ width: `${(methods[k].sum / total) * 100}%`, background: METHODS[k].color }} />
        ))}
      </div>
      <ul className="pm__legend">
        {KEYS.map((k) => (
          <li key={k}>
            <i style={{ background: METHODS[k].color }} />
            {METHODS[k].label}
            <span className="pm__v">
              <b>{gel(methods[k].sum)}</b>
              <small>
                {Math.round((methods[k].sum / total) * 100)}% · {methods[k].count} შეკვეთა
              </small>
            </span>
          </li>
        ))}
      </ul>

      {occupancy && (
        <div className="pm__occ">
          <h3 className="mt">შევსებულობა · {occupancy.title}</h3>
          <div className="occ-row">
            <div>
              <span>გაყიდული ადგილები</span>
              <span>
                {occupancy.sold} / {occupancy.seats}
              </span>
            </div>
            <div className="occ-bar">
              <i style={{ width: `${Math.min(100, (occupancy.sold / (occupancy.seats || 1)) * 100)}%` }} />
            </div>
          </div>
          <div className="occ-row">
            <div>
              <span>დაჯავშნილი, გადაუხდელი</span>
              <span>{occupancy.held}</span>
            </div>
            <div className="occ-bar">
              <i style={{ width: `${Math.min(100, (occupancy.held / (occupancy.seats || 1)) * 100)}%`, background: 'var(--warn)' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
