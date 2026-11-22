import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { toOrder } from '@/lib/serialize';
import Order from '@/models/Order';
import '@/models/Tour';

export const dynamic = 'force-dynamic';

// GET /api/orders — all orders, newest first
export async function GET() {
  await connectDB();
  const orders = await Order.find().sort({ createdAt: -1 }).populate('tour').lean();
  return NextResponse.json({ orders: orders.map(toOrder) });
}
