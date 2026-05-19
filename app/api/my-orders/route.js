import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '../../../lib/mongodb';
import Order from '../../../models/Order';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const orders = await Order.find({ 'customerInfo.email': email }).sort('-createdAt');
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
