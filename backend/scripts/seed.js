/**
 * Seeds the database with a test admin account, a test customer account,
 * and a handful of sample products. Run with: npm run seed
 *
 * Safe to re-run: it skips creation of any record that already exists.
 */
require('dotenv').config();
const { sequelize, User, Product } = require('../src/models');

const ADMIN = { name: 'Admin User', email: 'admin@example.com', password: 'Admin123!', role: 'admin' };
const CUSTOMER = { name: 'Test Customer', email: 'customer@example.com', password: 'Customer123!', role: 'customer' };

const SAMPLE_PRODUCTS = [
  { name: 'Running Shoes', description: 'Lightweight everyday trainers.', price: 59.99, category: 'shoes', stock: 25, imageUrl: '/uploads/running-shoes.svg' },
  { name: 'Hiking Boots', description: 'Waterproof boots for rough terrain.', price: 129.99, category: 'shoes', stock: 15, imageUrl: '/uploads/hiking-boots.svg' },
  { name: 'Cotton T-Shirt', description: 'Soft, breathable everyday tee.', price: 19.99, category: 'apparel', stock: 100, imageUrl: '/uploads/cotton-tshirt.svg' },
  { name: 'Denim Jacket', description: 'Classic fit denim jacket.', price: 79.99, category: 'apparel', stock: 30, imageUrl: '/uploads/denim-jacket.svg' },
  { name: 'Wireless Headphones', description: 'Over-ear headphones with noise cancellation.', price: 149.99, category: 'electronics', stock: 20, imageUrl: '/uploads/wireless-headphones.svg' },
  { name: 'Ceramic Mug', description: '350ml ceramic coffee mug.', price: 12.5, category: 'home', stock: 60, imageUrl: '/uploads/ceramic-mug.svg' },
];

async function seed() {
  await sequelize.sync();

  for (const account of [ADMIN, CUSTOMER]) {
    const [user, created] = await User.findOrCreate({
      where: { email: account.email },
      defaults: account,
    });
    console.log(created ? `Created ${account.role}: ${user.email}` : `${account.role} already exists: ${user.email}`);
  }

  // Only seed sample products when SEED_PRODUCTS=true
  if (process.env.SEED_PRODUCTS === 'true') {
    for (const product of SAMPLE_PRODUCTS) {
    const [item, created] = await Product.findOrCreate({
      where: { name: product.name },
      defaults: product,
    });

    if (!created) {
      const needsUpdate =
        item.imageUrl !== product.imageUrl ||
        item.description !== product.description ||
        parseFloat(item.price) !== parseFloat(product.price) ||
        item.category !== product.category ||
        item.stock !== product.stock;

      if (needsUpdate) {
        await item.update(product);
        console.log(`Updated product: ${item.name}`);
        continue;
      }
    }

    console.log(created ? `Created product: ${item.name}` : `Product already exists: ${item.name}`);
    }
  } else {
    console.log('Skipping product seeding (set SEED_PRODUCTS=true to enable).');
  }

  await sequelize.close();
  console.log('Seeding complete.');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
