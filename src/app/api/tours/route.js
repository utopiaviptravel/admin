import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { toTour } from '@/lib/serialize';
import Tour from '@/models/Tour';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

// GET /api/tours — tours with sales numbers
export async function GET() {
  await connectDB();
  const [tours, stats] = await Promise.all([
    Tour.find().sort({ order: 1, createdAt: 1 }).lean(),
    Order.aggregate([
      {
        $group: {
          _id: '$tour',
          orders: { $sum: 1 },
          seats: { $sum: { $cond: [{ $eq: ['$status', 'paid'] }, '$people', 0] } },
          revenue: { $sum: { $cond: [{ $eq: ['$status', 'paid'] }, '$total', 0] } },
        },
      },
    ]),
  ]);
  const by = Object.fromEntries(stats.map((s) => [String(s._id), s]));
  return NextResponse.json({
    tours: tours.map((t) => {
      const s = by[String(t._id)] || {};
      return { ...toTour(t), orders: s.orders || 0, sold: s.seats || 0, revenue: s.revenue || 0 };
    }),
  });
}
