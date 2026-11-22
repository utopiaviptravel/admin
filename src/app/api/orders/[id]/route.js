import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { toOrder } from '@/lib/serialize';
import Order from '@/models/Order';
import '@/models/Tour';

export const dynamic = 'force-dynamic';

async function find(id) {
  if (!mongoose.isValidObjectId(id)) return null;
  await connectDB();
  return Order.findById(id).populate('tour');
}

// GET /api/orders/:id
export async function GET(_req, { params }) {
  const { id } = await params;
  const order = await find(id);
  if (!order) return NextResponse.json({ error: 'შეკვეთა ვერ მოიძებნა' }, { status: 404 });
  return NextResponse.json({ order: toOrder(order) });
}

// PATCH /api/orders/:id   body: { action: 'confirm' | 'refund' }
export async function PATCH(req, { params }) {
  const { id } = await params;
  const { action } = await req.json().catch(() => ({}));
  const order = await find(id);
  if (!order) return NextResponse.json({ error: 'შეკვეთა ვერ მოიძებნა' }, { status: 404 });

  const close = () => order.history.forEach((h) => { if (h.state === 'now') h.state = 'done'; });

  if (action === 'confirm') {
    if (order.status !== 'pending') return NextResponse.json({ error: 'მხოლოდ მოლოდინში მყოფი შეკვეთა' }, { status: 400 });
    close();
    order.status = 'paid';
    order.history.push({ label: 'გადახდა დადასტურდა', note: 'ადმინმა მონიშნა', state: 'done', at: new Date() });
  } else if (action === 'refund') {
    if (order.status !== 'paid') return NextResponse.json({ error: 'მხოლოდ გადახდილი შეკვეთა' }, { status: 400 });
    order.status = 'refunded';
    order.history.push({ label: 'თანხა დაბრუნდა', note: 'ადმინმა დააბრუნა', state: 'done', at: new Date() });
  } else {
    return NextResponse.json({ error: 'უცნობი მოქმედება' }, { status: 400 });
  }

  await order.save();
  return NextResponse.json({ order: toOrder(order) });
}
