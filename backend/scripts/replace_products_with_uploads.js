require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { sequelize, Product, CartItem } = require('../src/models');

const UPLOADS_DIR = path.join(__dirname, '..', 'src', 'uploads');

function nameFromFilename(filename) {
  const base = path.parse(filename).name;
  // Make a readable name: replace non-alphanum with spaces and collapse
  return base.replace(/[^a-zA-Z0-9]+/g, ' ').trim() || base;
}

async function replaceProducts() {
  await sequelize.sync();

  const files = fs.readdirSync(UPLOADS_DIR).filter(f => f.toLowerCase().endsWith('.png'));

  if (!files.length) {
    console.log('No PNG files found in uploads. Aborting.');
    process.exit(0);
  }

  // Remove dependent cart items first (safe) then truncate products with CASCADE
  await CartItem.destroy({ where: {} });
  await sequelize.query('TRUNCATE "products" RESTART IDENTITY CASCADE');
  console.log('Existing cart items and products removed (cascade).');

  const created = [];
  for (const f of files) {
    const product = await Product.create({
      name: nameFromFilename(f),
      description: `Product image: ${f}`,
      price: 9.99,
      category: 'custom',
      stock: 10,
      imageUrl: `/uploads/${f}`,
    });
    created.push(product.name);
    console.log('Created product for', f);
  }

  console.log('Replacement complete. Created products:', created);
  await sequelize.close();
}

replaceProducts().catch(err => {
  console.error('Failed to replace products:', err);
  process.exit(1);
});
