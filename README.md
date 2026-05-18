# AF Zariye - Premium Fashion E-Commerce

A full-stack e-commerce platform built with Next.js 14, MongoDB, and Cloudinary.

## 🚀 Features

- **Homepage** - Hero swiper, featured products, collections, newsletter
- **Shop** - Product listing with filters, sorting, pagination
- **Collections** - Collection pages with banner images
- **Product Detail** - Image gallery, size/color selector, related products
- **Cart System** - Slide-out cart drawer with quantity controls
- **Checkout** - Guest checkout with COD & bank transfer
- **Order Tracking** - Track orders with timeline visualization
- **Login/Signup** - User authentication with NextAuth.js
- **Newsletter** - Email subscription system
- **Contact & About** - Brand story and contact form
- **Admin Dashboard** - Full admin panel with:
  - Product CRUD with Cloudinary image upload
  - Collection management with banners
  - Order management with status & tracking updates
  - Newsletter subscriber management
- **Custom Toast** - Beautiful notification system
- **Responsive** - Works on all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Swiper
- **Backend**: Next.js API Routes
- **Database**: MongoDB + Mongoose
- **Auth**: NextAuth.js
- **Images**: Cloudinary
- **Styling**: Vanilla CSS (Premium design system)
- **Deployment**: Vercel

## 📦 Setup

1. **Copy images & install dependencies:**
   ```bash
   # Run the setup script (Windows)
   setup.bat
   
   # Or manually:
   npm install
   ```

2. **Configure environment variables:**
   Edit `.env.local` with your credentials:
   - `MONGODB_URI` - MongoDB connection string
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `NEXTAUTH_SECRET` - Random secret string
   - `NEXTAUTH_URL` - Your site URL

3. **Seed the admin user:**
   ```bash
   node scripts/seed.js
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Login to admin:**
   - Email: `admin@afzariye.com`
   - Password: `admin123`

## 🚀 Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy!

## 📁 Project Structure

```
AF_Zariye/
├── app/
│   ├── layout.js          # Root layout
│   ├── page.js            # Homepage
│   ├── globals.css        # Design system
│   ├── shop/              # Shop page
│   ├── product/[id]/      # Product detail
│   ├── collections/       # Collections
│   ├── cart/              # Cart
│   ├── checkout/          # Checkout
│   ├── login/             # Login
│   ├── signup/            # Signup
│   ├── contact/           # Contact
│   ├── about/             # About
│   ├── track-order/       # Order tracking
│   ├── admin/             # Admin panel
│   └── api/               # API routes
├── components/            # React components
├── context/               # Cart, Toast, Auth providers
├── lib/                   # Database, Cloudinary, Auth config
├── models/                # Mongoose models
├── public/                # Static assets
└── scripts/               # Seed scripts
```
