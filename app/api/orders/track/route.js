import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Order from '../../../../models/Order';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });

    const order = await Order.findOne({ orderId: orderId.toUpperCase() });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    return NextResponse.json({
      orderId: order.orderId,
      status: order.status,
      trackingId: order.trackingId,
      trackingHistory: order.trackingHistory,
      items: order.items,
      total: order.total,
      createdAt: order.createdAt,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to track order' }, { status: 500 });
  }
}
