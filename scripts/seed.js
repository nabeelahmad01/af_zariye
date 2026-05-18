import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load env
const envFiles = ['.env.local', '.env'];
for (const f of envFiles) {
  try {
    const content = readFileSync(resolve(__dirname, '..', f), 'utf-8');
    content.split('\n').forEach(line => {
      const [key, ...vals] = line.split('=');
      if (key && vals.length && !process.env[key.trim()]) process.env[key.trim()] = vals.join('=').trim();
    });
  } catch {}
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI || MONGODB_URI.includes('username:password')) {
  console.error('❌ Please update MONGODB_URI in .env.local');
  process.exit(1);
}

// Schemas
const userSchema = new mongoose.Schema({
  name: String, email: String, password: String, phone: String, role: String,
  address: { street: String, city: String, state: String, zip: String, country: String },
  createdAt: { type: Date, default: Date.now },
});

const collectionSchema = new mongoose.Schema({
  name: String, slug: String, description: String,
  banner: { url: String, publicId: String },
  thumbnail: { url: String, publicId: String },
  isActive: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
  name: String, slug: String, description: String,
  price: Number, comparePrice: Number,
  images: [{ url: String, publicId: String }],
  category: String,
  collection: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
  sizes: [String], colors: [{ name: String, hex: String }],
  stock: Number, featured: Boolean, isActive: Boolean,
  tags: [String], sku: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  const User = mongoose.models.User || mongoose.model('User', userSchema);
  const Collection = mongoose.models.Collection || mongoose.model('Collection', collectionSchema);
  const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

  // Clear old data
  await Product.deleteMany({});
  await Collection.deleteMany({});
  console.log('🗑️ Cleared old products and collections');

  // Create admin
  const existingAdmin = await User.findOne({ email: 'admin@afzariye.com' });
  if (!existingAdmin) {
    const hash = await bcrypt.hash('admin123', 12);
    await User.create({ name: 'Admin', email: 'admin@afzariye.com', password: hash, role: 'admin' });
    console.log('✅ Admin created: admin@afzariye.com / admin123');
  } else {
    console.log('ℹ️ Admin already exists');
  }

  // Placeholder images (using picsum for demo)
  const img = (id, w = 600, h = 800) => `https://picsum.photos/id/${id}/${w}/${h}`;

  // Create Collections
  const collectionsData = [
    {
      name: 'Summer Essentials',
      slug: 'summer-essentials',
      description: 'Light fabrics and breezy designs for the perfect summer wardrobe',
      banner: { url: img(1011, 1200, 500), publicId: '' },
      thumbnail: { url: img(1011, 600, 800), publicId: '' },
      featured: true, isActive: true, sortOrder: 1,
    },
    {
      name: 'Formal Collection',
      slug: 'formal-collection',
      description: 'Tailored elegance for the modern professional',
      banner: { url: img(1005, 1200, 500), publicId: '' },
      thumbnail: { url: img(1005, 600, 800), publicId: '' },
      featured: true, isActive: true, sortOrder: 2,
    },
    {
      name: 'Casual Streetwear',
      slug: 'casual-streetwear',
      description: 'Urban styles that keep you comfortable and trendy',
      banner: { url: img(1025, 1200, 500), publicId: '' },
      thumbnail: { url: img(1025, 600, 800), publicId: '' },
      featured: true, isActive: true, sortOrder: 3,
    },
    {
      name: 'Winter Luxe',
      slug: 'winter-luxe',
      description: 'Warm, cozy, and stylish pieces for the cold season',
      banner: { url: img(1036, 1200, 500), publicId: '' },
      thumbnail: { url: img(1036, 600, 800), publicId: '' },
      featured: false, isActive: true, sortOrder: 4,
    },
  ];

  const collections = await Collection.insertMany(collectionsData);
  console.log(`✅ Created ${collections.length} collections`);

  // Create Products
  const productsData = [
    // Summer Essentials
    { name: 'Linen Breeze Shirt', slug: 'linen-breeze-shirt', description: 'A luxuriously soft linen shirt perfect for summer days. Features a relaxed fit with mother-of-pearl buttons and a mandarin collar. Made from 100% premium Egyptian linen.', price: 3500, comparePrice: 4500, images: [{ url: img(473, 600, 800) }, { url: img(474, 600, 800) }], category: 'Men', collection: collections[0]._id, sizes: ['S', 'M', 'L', 'XL'], colors: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Sky Blue', hex: '#87CEEB' }, { name: 'Beige', hex: '#F5DEB3' }], stock: 25, featured: true, isActive: true, tags: ['summer', 'linen', 'bestseller'], sku: 'AFZ-LBS-001' },

    { name: 'Cotton Polo Classic', slug: 'cotton-polo-classic', description: 'A timeless polo shirt crafted from premium pique cotton. Features a ribbed collar and cuffs with a signature AF Zariye embroidered logo. Perfect for both casual and semi-formal occasions.', price: 2800, comparePrice: 3200, images: [{ url: img(476, 600, 800) }, { url: img(477, 600, 800) }], category: 'Men', collection: collections[0]._id, sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: [{ name: 'Navy', hex: '#1B2A4A' }, { name: 'Black', hex: '#1a1a1a' }, { name: 'Olive', hex: '#808000' }], stock: 40, featured: true, isActive: true, tags: ['summer', 'polo', 'classic'], sku: 'AFZ-CPC-002' },

    { name: 'Summer Chino Shorts', slug: 'summer-chino-shorts', description: 'Tailored chino shorts made from lightweight stretch cotton. Features a clean flat-front design with hidden pockets. The ideal pairing for summer outings.', price: 2200, comparePrice: 0, images: [{ url: img(478, 600, 800) }], category: 'Men', collection: collections[0]._id, sizes: ['S', 'M', 'L', 'XL'], colors: [{ name: 'Khaki', hex: '#C3B091' }, { name: 'Navy', hex: '#1B2A4A' }], stock: 30, featured: false, isActive: true, tags: ['summer', 'shorts'], sku: 'AFZ-SCS-003' },

    // Formal Collection
    { name: 'Premium Dress Shirt', slug: 'premium-dress-shirt', description: 'An impeccably tailored dress shirt made from fine Egyptian cotton with a subtle sheen. Features French cuffs and a spread collar. Wrinkle-resistant finish for all-day freshness.', price: 4200, comparePrice: 5500, images: [{ url: img(480, 600, 800) }, { url: img(481, 600, 800) }], category: 'Men', collection: collections[1]._id, sizes: ['S', 'M', 'L', 'XL'], colors: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Light Blue', hex: '#ADD8E6' }], stock: 20, featured: true, isActive: true, tags: ['formal', 'shirt', 'premium'], sku: 'AFZ-PDS-004' },

    { name: 'Tailored Slim Trousers', slug: 'tailored-slim-trousers', description: 'Expertly cut slim-fit trousers with a modern tapered leg. Made from a wool-blend fabric with just enough stretch for comfortable movement. Features a hidden hook closure and pressed crease.', price: 4800, comparePrice: 6000, images: [{ url: img(482, 600, 800) }], category: 'Men', collection: collections[1]._id, sizes: ['S', 'M', 'L', 'XL'], colors: [{ name: 'Charcoal', hex: '#36454F' }, { name: 'Navy', hex: '#1B2A4A' }, { name: 'Black', hex: '#1a1a1a' }], stock: 15, featured: true, isActive: true, tags: ['formal', 'trousers', 'tailored'], sku: 'AFZ-TST-005' },

    { name: 'Silk Blend Tie', slug: 'silk-blend-tie', description: 'A refined silk-blend tie with a subtle micro-pattern. Hand-finished with a self-loop keeper. The perfect finishing touch for any formal ensemble.', price: 1800, comparePrice: 2200, images: [{ url: img(484, 600, 800) }], category: 'Accessories', collection: collections[1]._id, sizes: ['Free Size'], colors: [{ name: 'Burgundy', hex: '#722F37' }, { name: 'Navy', hex: '#1B2A4A' }], stock: 50, featured: false, isActive: true, tags: ['formal', 'tie', 'accessory'], sku: 'AFZ-SBT-006' },

    // Casual Streetwear
    { name: 'Urban Oversized Hoodie', slug: 'urban-oversized-hoodie', description: 'A statement oversized hoodie crafted from heavyweight organic cotton fleece. Features a kangaroo pocket, ribbed cuffs and hem. Dropped shoulders for that relaxed streetwear silhouette.', price: 3800, comparePrice: 0, images: [{ url: img(485, 600, 800) }, { url: img(486, 600, 800) }], category: 'Unisex', collection: collections[2]._id, sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: [{ name: 'Black', hex: '#1a1a1a' }, { name: 'Grey', hex: '#808080' }, { name: 'Forest Green', hex: '#228B22' }], stock: 35, featured: true, isActive: true, tags: ['casual', 'hoodie', 'streetwear'], sku: 'AFZ-UOH-007' },

    { name: 'Relaxed Fit Joggers', slug: 'relaxed-fit-joggers', description: 'Premium joggers with a tapered leg and elastic waistband with drawcord. Made from a soft cotton-polyester blend with brushed inner. Side pockets and one back zip pocket.', price: 3200, comparePrice: 3800, images: [{ url: img(487, 600, 800) }], category: 'Unisex', collection: collections[2]._id, sizes: ['S', 'M', 'L', 'XL'], colors: [{ name: 'Black', hex: '#1a1a1a' }, { name: 'Charcoal', hex: '#36454F' }], stock: 28, featured: true, isActive: true, tags: ['casual', 'joggers', 'comfort'], sku: 'AFZ-RFJ-008' },

    { name: 'Graphic Print Tee', slug: 'graphic-print-tee', description: 'A bold graphic tee featuring exclusive AF Zariye artwork. Made from 100% combed cotton with a soft hand feel. Pre-shrunk for a consistent fit wash after wash.', price: 1800, comparePrice: 2200, images: [{ url: img(489, 600, 800) }, { url: img(490, 600, 800) }], category: 'Unisex', collection: collections[2]._id, sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Black', hex: '#1a1a1a' }], stock: 60, featured: false, isActive: true, tags: ['casual', 'tee', 'graphic'], sku: 'AFZ-GPT-009' },

    // Women's - No collection
    { name: 'Floral Wrap Dress', slug: 'floral-wrap-dress', description: 'An elegant wrap dress with a beautiful floral print. Made from flowing viscose fabric with a V-neckline and adjustable waist tie. Perfect for brunches and garden parties.', price: 4500, comparePrice: 5500, images: [{ url: img(491, 600, 800) }], category: 'Women', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: [{ name: 'Floral Blue', hex: '#6495ED' }, { name: 'Floral Pink', hex: '#FFB6C1' }], stock: 18, featured: true, isActive: true, tags: ['women', 'dress', 'floral'], sku: 'AFZ-FWD-010' },

    { name: 'Structured Blazer', slug: 'structured-blazer', description: 'A sharp structured blazer with peak lapels and a single-button closure. Crafted from a premium wool blend with a satin lining. Ideal for power dressing.', price: 7500, comparePrice: 9000, images: [{ url: img(493, 600, 800) }], category: 'Women', sizes: ['XS', 'S', 'M', 'L'], colors: [{ name: 'Black', hex: '#1a1a1a' }, { name: 'Camel', hex: '#C19A6B' }], stock: 12, featured: true, isActive: true, tags: ['women', 'blazer', 'formal'], sku: 'AFZ-SBZ-011' },

    { name: 'Leather Crossbody Bag', slug: 'leather-crossbody-bag', description: 'A compact crossbody bag made from genuine leather with gold-tone hardware. Features an adjustable strap, magnetic snap closure, and interior zip pocket. Fits essentials perfectly.', price: 5500, comparePrice: 0, images: [{ url: img(495, 600, 800) }], category: 'Accessories', sizes: ['Free Size'], colors: [{ name: 'Tan', hex: '#D2B48C' }, { name: 'Black', hex: '#1a1a1a' }], stock: 20, featured: false, isActive: true, tags: ['accessory', 'bag', 'leather'], sku: 'AFZ-LCB-012' },
  ];

  const products = await Product.insertMany(productsData);
  console.log(`✅ Created ${products.length} products`);

  await mongoose.disconnect();
  console.log('\n🎉 Seed complete! Your store is ready.');
  console.log('   - 4 Collections (3 featured)');
  console.log('   - 12 Products (8 featured)');
  console.log('   - Admin: admin@afzariye.com / admin123');
}

seed().catch(console.error);
