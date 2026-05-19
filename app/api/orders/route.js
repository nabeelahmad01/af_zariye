import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Order from '../../../models/Order';
import Product from '../../../models/Product';

function generateOrderId() {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `AFZ-${year}-${rand}`;
}

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;

    const query = {};
    if (status) query.status = status;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query).sort('-createdAt').skip((page - 1) * limit).limit(limit);
    return NextResponse.json({ orders, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    data.orderId = generateOrderId();
    data.trackingHistory = [{ status: 'pending', message: 'Order placed successfully', timestamp: new Date() }];

    // Validate stock availability before creating order
    for (const item of data.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json({ error: `Product "${item.name}" not found` }, { status: 400 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `"${item.name}" has only ${product.stock} in stock` }, { status: 400 });
      }
    }

    // Deduct stock
    for (const item of data.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    const order = await Order.create(data);
    return NextResponse.json({ order, orderId: order.orderId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}
