import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Collection from '../../../models/Collection';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const query = { isActive: true };
    if (featured === 'true') query.featured = true;

    const collections = await Collection.find(query).sort('sortOrder');
    return NextResponse.json({ collections });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    const collection = await Collection.create(data);
    return NextResponse.json({ collection }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to create collection' }, { status: 500 });
  }
}
