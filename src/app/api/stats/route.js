import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { toOrder } from '@/lib/serialize';
import Order from '@/models/Order';
import '@/models/Tour';

export const dynamic = 'force-dynamic';

const DAY = 864e5;

// GET /api/stats — everything the overview page needs
export async function GET() {
  await connectDB();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const from = new Date(+today - 13 * DAY); // last 14 days
  const prevFrom = new Date(+from - 14 * DAY); // the 14 days before that

  const [recent14, prev14, pendingCount, allOpen, latest] = await Promise.all([
    Order.find({ createdAt: { $gte: from } }).populate('tour').lean(),
    Order.find({ createdAt: { $gte: prevFrom, $lt: from }, status: 'paid' }).lean(),
    Order.countDocuments({ status: 'pending' }),
    Order.find({ status: { $in: ['paid', 'pending'] } }).populate('tour').lean(),
    Order.find().sort({ createdAt: -1 }).limit(6).populate('tour').lean(),
  ]);

  const paid = recent14.filter((o) => o.status === 'paid');
  const revenue = paid.reduce((s, o) => s + o.total, 0);
  const prevRevenue = prev14.reduce((s, o) => s + o.total, 0);
  const delta = prevRevenue ? Math.round(((revenue - prevRevenue) / prevRevenue) * 100) : null;

  // revenue per day
  const days = Array.from({ length: 14 }, (_, i) => ({ date: new Date(+from + i * DAY), value: 0 }));
  paid.forEach((o) => {
    const i = Math.floor((new Date(o.createdAt) - from) / DAY);
    if (days[i]) days[i].value += o.total;
  });

  // payment methods (paid + pending)
  const methods = { card: { sum: 0, count: 0 }, split: { sum: 0, count: 0 }, later: { sum: 0, count: 0 } };
  allOpen.forEach((o) => {
    if (!methods[o.method]) return;
    methods[o.method].sum += o.total;
    methods[o.method].count += 1;
  });

  // seats of the most-booked tour
  const per = {};
  allOpen.forEach((o) => {
    if (!o.tour) return;
    const k = String(o.tour._id);
    per[k] = per[k] || { title: o.tour.title, seats: o.tour.seats, sold: 0, held: 0, n: 0 };
    per[k].n += 1;
    if (o.status === 'paid') per[k].sold += o.people;
    else per[k].held += o.people;
  });
  const occupancy = Object.values(per).sort((a, b) => b.n - a.n)[0] || null;

  return NextResponse.json({
    revenue,
    delta,
    orders: recent14.length,
    paid: paid.length,
    travellers: paid.reduce((s, o) => s + o.people, 0),
    pending: pendingCount,
    days,
    methods,
    occupancy,
    recent: latest.map(toOrder),
  });
}
