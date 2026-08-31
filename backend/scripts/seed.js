/**
 * Seeds the database with a test admin account, a test customer account,
 * and sample products.
 *
 * Run with:
 * npm run seed
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('../src/lib/prisma');

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
  { name: 'running shoes', description: 'Lightweight everyday trainers', price: 39.99, category: 'feetwear', stock: 35, imageUrl: '/seed-images/running-shoes.png' },
  { name: 'boots', description: 'strong boots for hiking and heavy rain', price: 29.99, category: 'feetwear', stock: 30, imageUrl: '/seed-images/boots.png' },
  { name: 'smart watch', description: 'xioami black smart watch', price: 49.99, category: 'electronics', stock: 50, imageUrl: '/seed-images/smart-watch.png' },
  { name: 'Smart TV', description: 'LG smart tv high quality', price: 149.99, category: 'electronics', stock: 20, imageUrl: '/seed-images/smart-tv.png' },
  { name: 'ps5 controller', description: 'playstation 5 white controller', price: 79.99, category: 'gaming', stock: 50, imageUrl: '/seed-images/ps5-controller.png' },
  { name: 'headset', description: 'black gaming headset', price: 24.99, category: 'gaming', stock: 28, imageUrl: '/seed-images/headset.png' },
  { name: 'blue hoodie', description: 'blue winter hoodie', price: 14.99, category: 'clothes', stock: 90, imageUrl: '/seed-images/blue-hoodie.png' },
  { name: 'microwave', description: 'Toshiba microwave', price: 89.99, category: 'electronics', stock: 15, imageUrl: '/seed-images/microwave.png' },
  { name: 'KETTLE', description: 'Electric modern kettle', price: 64.99, category: 'electronics', stock: 34, imageUrl: '/seed-images/kettle.png' },
  { name: 'hat', description: 'blue stylish hat', price: 7.99, category: 'clothes', stock: 150, imageUrl: '/seed-images/hat.png' },
  { name: 'football', description: 'official 25/26 laliga ball', price: 44.99, category: 'sports', stock: 5, imageUrl: '/seed-images/football.png' },
];

async function seed() {
  await prisma.$connect();

  for (const account of [ADMIN, CUSTOMER]) {
    const existing = await prisma.user.findUnique({ where: { email: account.email } });
    if (!existing) {
      await prisma.user.create({ data: { ...account, password: await bcrypt.hash(account.password, 10) } });
      console.log(`Created ${account.role}: ${account.email}`);
    } else {
      console.log(`${account.role} already exists: ${account.email}`);
    }
  }

  for (const product of SAMPLE_PRODUCTS) {
    const slug = product.category.toLowerCase().replace(/\s+/g, '-');
    await prisma.category.upsert({
      where: { name: product.category },
      update: { slug },
      create: { name: product.category, slug },
    });

    const categoryRecord = await prisma.category.findUnique({ where: { name: product.category } });
    const existingProduct = await prisma.product.findFirst({ where: { name: product.name } });

    if (!existingProduct) {
      await prisma.product.create({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          categoryId: categoryRecord.id,
          stock: product.stock,
          imageUrl: product.imageUrl,
        },
      });
      console.log(`Created product: ${product.name}`);
    } else {
      console.log(`Product already exists: ${product.name}`);
    }
  }

  console.log('Seeding complete.');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});




