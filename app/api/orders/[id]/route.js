import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Order from '../../../../models/Order';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const order = await Order.findById(params.id);
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const data = await request.json();
    const order = await Order.findById(params.id);
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    if (data.status && data.status !== order.status) {
      order.trackingHistory.push({
        status: data.status,
        message: data.trackingMessage || `Order ${data.status}`,
        timestamp: new Date(),
      });
      order.status = data.status;
    }
    if (data.trackingId) order.trackingId = data.trackingId;
    if (data.notes) order.notes = data.notes;

    await order.save();
    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
