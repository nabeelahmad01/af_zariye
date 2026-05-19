import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Order from '../../../../models/Order';
import Product from '../../../../models/Product';
import Coupon from '../../../../models/Coupon';

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
      // Restore stock if order is cancelled
      if (data.status === 'cancelled' && order.status !== 'cancelled') {
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
        }
      }

      // Increment coupon usage when order confirmed
      if (data.status === 'confirmed' && order.couponCode) {
        await Coupon.findOneAndUpdate({ code: order.couponCode }, { $inc: { usedCount: 1 } });
      }

      order.trackingHistory.push({
        status: data.status,
        message: data.trackingMessage || `Order ${data.status.replace('_', ' ')}`,
        timestamp: new Date(),
      });
      order.status = data.status;
    }
    if (data.trackingId) order.trackingId = data.trackingId;
    if (data.notes !== undefined) order.notes = data.notes;

    await order.save();
    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
