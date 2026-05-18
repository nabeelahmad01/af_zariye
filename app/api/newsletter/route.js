import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Newsletter from '../../../models/Newsletter';

export async function GET() {
  try {
    await dbConnect();
    const subscribers = await Newsletter.find().sort('-subscribedAt');
    return NextResponse.json({ subscribers, total: subscribers.length });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

    const existing = await Newsletter.findOne({ email });
    if (existing) return NextResponse.json({ error: 'Already subscribed!' }, { status: 400 });

    await Newsletter.create({ email });
    return NextResponse.json({ message: 'Subscribed successfully!' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
