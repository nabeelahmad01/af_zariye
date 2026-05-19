import dbConnect from '../../lib/mongodb';
import Product from '../../models/Product';
import Collection from '../../models/Collection';

const BASE_URL = process.env.NEXTAUTH_URL || 'https://af-zariye.vercel.app';

export async function GET() {
  await dbConnect();

  const products = await Product.find({ isActive: true }, 'slug updatedAt').lean();
  const collections = await Collection.find({ isActive: true }, 'slug updatedAt').lean();

  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/shop', priority: '0.9', changefreq: 'daily' },
    { url: '/collections', priority: '0.8', changefreq: 'weekly' },
    { url: '/about', priority: '0.5', changefreq: 'monthly' },
    { url: '/contact', priority: '0.5', changefreq: 'monthly' },
    { url: '/login', priority: '0.3', changefreq: 'monthly' },
    { url: '/signup', priority: '0.3', changefreq: 'monthly' },
    { url: '/track-order', priority: '0.4', changefreq: 'monthly' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(p => `  <url>
    <loc>${BASE_URL}${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
${products.map(p => `  <url>
    <loc>${BASE_URL}/product/${p._id}</loc>
    <lastmod>${new Date(p.updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
${collections.map(c => `  <url>
    <loc>${BASE_URL}/collections/${c.slug}</loc>
    <lastmod>${new Date(c.updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
