import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Product from '../../../models/Product';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');
    const collection = searchParams.get('collection');
    const sort = searchParams.get('sort') || '-createdAt';
    const search = searchParams.get('search');

    const query = { isActive: true };
    if (featured === 'true') query.featured = true;
    if (category) query.category = category;
    if (collection) query.collection = collection;
    if (search) query.name = { $regex: search, $options: 'i' };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('collection', 'name slug')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({ products, total, pages: Math.ceil(total / limit), page });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    const product = await Product.create(data);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}
