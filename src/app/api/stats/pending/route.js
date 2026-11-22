import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

// GET /api/stats/pending — number for the menu badge
export async function GET() {
  await connectDB();
  const pending = await Order.countDocuments({ status: 'pending' });
  return NextResponse.json({ pending });
}
