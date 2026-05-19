import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Review from '../../../models/Review';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const product = searchParams.get('product');
    const all = searchParams.get('all'); // admin

    const query = all === 'true' ? {} : { isApproved: true };
    if (product) query.product = product;

    const reviews = await Review.find(query).sort('-createdAt');
    const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;
    return NextResponse.json({ reviews, avgRating, total: reviews.length });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    const review = await Review.create(data);
    return NextResponse.json({ review, message: 'Review submitted! It will appear after approval.' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to submit review' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const data = await request.json();
    const review = await Review.findByIdAndUpdate(data.id, { isApproved: data.isApproved }, { new: true });
    return NextResponse.json({ review });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}
