import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Coupon from '../../../models/Coupon';

export async function GET() {
  try {
    await dbConnect();
    const coupons = await Coupon.find().sort('-createdAt');
    return NextResponse.json({ coupons });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();

    // Validate coupon (for checkout apply)
    if (data.action === 'validate') {
      const coupon = await Coupon.findOne({ code: data.code.toUpperCase(), isActive: true });
      if (!coupon) return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 });
      if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 });
      if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 });
      if (data.orderTotal < coupon.minOrderAmount) return NextResponse.json({ error: `Minimum order PKR ${coupon.minOrderAmount} required` }, { status: 400 });

      let discount = 0;
      if (coupon.discountType === 'percentage') {
        discount = Math.round((data.orderTotal * coupon.discountValue) / 100);
      } else {
        discount = coupon.discountValue;
      }
      discount = Math.min(discount, data.orderTotal);

      return NextResponse.json({ coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue, discount } });
    }

    // Create coupon (admin)
    const coupon = await Coupon.create(data);
    return NextResponse.json({ coupon }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed' }, { status: 500 });
  }
}
