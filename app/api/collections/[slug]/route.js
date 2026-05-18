import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Collection from '../../../../models/Collection';
import Product from '../../../../models/Product';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const collection = await Collection.findOne({ slug: params.slug });
    if (!collection) return NextResponse.json({ error: 'Collection not found' }, { status: 404 });

    const products = await Product.find({ collection: collection._id, isActive: true }).sort('-createdAt');
    return NextResponse.json({ collection, products });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch collection' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const data = await request.json();
    const collection = await Collection.findOneAndUpdate({ slug: params.slug }, data, { new: true });
    if (!collection) return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    return NextResponse.json({ collection });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update collection' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    await Collection.findOneAndDelete({ slug: params.slug });
    return NextResponse.json({ message: 'Collection deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete collection' }, { status: 500 });
  }
}
