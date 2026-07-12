/**
 * Seeds the database with a test admin account, a test customer account,
 * and sample products.
 *
 * Run with:
 * npm run seed
 *
 * Safe to re-run: existing records are updated if needed.
 */

require('dotenv').config();
const { sequelize, User, Product } = require('../src/models');

const ADMIN = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'Admin123!',
  role: 'admin',
};

const CUSTOMER = {
  name: 'Test Customer',
  email: 'customer@example.com',
  password: 'Customer123!',
  role: 'customer',
};

const SAMPLE_PRODUCTS = [
  { name: 'running shoes', description: 'Lightweight everyday trainers', price: 39.99, category: 'feetwear', stock: 35, imageUrl: '/uploads/seed-images/running-shoes.png' },
  { name: 'boots', description: 'strong boots for hiking and heavy rain', price: 29.99, category: 'feetwear', stock: 30, imageUrl: '/uploads/seed-images/boots.png' },
  { name: 'smart watch', description: 'xioami black smart watch', price: 49.99, category: 'electronics', stock: 50, imageUrl: '/uploads/seed-images/smart-watch.png' },
  { name: 'Smart TV', description: 'LG smart tv high quality', price: 149.99, category: 'electronics', stock: 20, imageUrl: '/uploads/seed-images/smart-tv.png' },
  { name: 'ps5 controller', description: 'playstation 5 white controller', price: 79.99, category: 'gaming', stock: 50, imageUrl: '/uploads/seed-images/ps5-controller.png' },
  { name: 'headset', description: 'black gaming headset', price: 24.99, category: 'gaming', stock: 28, imageUrl: '/uploads/seed-images/headset.png' },
  { name: 'blue hoodie', description: 'blue winter hoodie', price: 14.99, category: 'clothes', stock: 90, imageUrl: '/uploads/seed-images/blue-hoodie.png' },
  { name: 'microwave', description: 'Toshiba microwave', price: 89.99, category: 'electronics', stock: 15, imageUrl: '/uploads/seed-images/microwave.png' },
  { name: 'KETTLE', description: 'Electric modern kettle', price: 64.99, category: 'electronics', stock: 34, imageUrl: '/uploads/seed-images/kettle.png' },
  { name: 'hat', description: 'blue stylish hat', price: 7.99, category: 'clothes', stock: 150, imageUrl: '/uploads/seed-images/hat.png' },
  { name: 'football', description: 'official 25/26 laliga ball', price: 44.99, category: 'sports', stock: 5, imageUrl: '/uploads/seed-images/football.png' },
];


async function seed() {
  await sequelize.sync();

  // Create admin and customer accounts
  for (const account of [ADMIN, CUSTOMER]) {
    const [user, created] = await User.findOrCreate({
      where: { email: account.email },
      defaults: account,
    });

    console.log(
      created
        ? `Created ${account.role}: ${user.email}`
        : `${account.role} already exists: ${user.email}`
    );
  }

  // Create or update products
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
      } else {
        console.log(`Product already exists: ${item.name}`);
      }
    } else {
      console.log(`Created product: ${item.name}`);
    }
  }

  await sequelize.close();
  console.log('Seeding complete.');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});





