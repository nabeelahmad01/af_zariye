import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '..', 'public');
const imgDir = 'C:\\Users\\Nabil\\.gemini\\antigravity\\brain\\b1bf7547-add9-4fee-a63c-60c4a9c46a1e';

if (!existsSync(publicDir)) mkdirSync(publicDir, { recursive: true });

const files = [
  ['hero1_1779116588986.png', 'hero1.jpg'],
  ['hero2_1779120000852.png', 'hero2.jpg'],
  ['hero3_1779120018941.png', 'hero3.jpg'],
  ['col1_1779120035642.png', 'col1.jpg'],
  ['col2_1779120057203.png', 'col2.jpg'],
  ['col3_1779120074560.png', 'col3.jpg'],
  ['about1_1779120089044.png', 'about1.jpg'],
  ['about2_1779120110777.png', 'about2.jpg'],
  ['shop_banner_1779120124905.png', 'shop-banner.jpg'],
  ['af_zariye_logo_1779096390847.png', 'logo.png'],
];

let count = 0;
for (const [src, dest] of files) {
  const srcPath = resolve(imgDir, src);
  const destPath = resolve(publicDir, dest);
  try {
    if (existsSync(srcPath)) {
      copyFileSync(srcPath, destPath);
      console.log(`✅ Copied: ${dest}`);
      count++;
    } else {
      console.log(`⚠️ Not found: ${src}`);
    }
  } catch (e) {
    console.log(`❌ Error copying ${src}: ${e.message}`);
  }
}

console.log(`\n🎉 Done! ${count} images copied to public/`);
