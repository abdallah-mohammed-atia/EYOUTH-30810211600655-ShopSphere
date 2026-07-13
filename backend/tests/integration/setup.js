const { closeMongo } = require('../../src/lib/mongo');
const prisma = require('../../src/lib/prisma');

beforeAll(async () => {
  await prisma.$connect();
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "CartItem", "OrderItem", "Order", "Product", "Category", "User" RESTART IDENTITY CASCADE');
});

afterEach(async () => {
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "CartItem", "OrderItem", "Order", "Product", "Category", "User" RESTART IDENTITY CASCADE');
});

afterAll(async () => {
  await prisma.$disconnect();
  await closeMongo();
});
