const prisma = require('../lib/prisma');
const { User, Product, Order } = require('../models');

async function getAdminStats(req, res, next) {
  try {
    const [userCount, productCount, categoryCount, orderCount] = await Promise.all([
      User.count(),
      Product.count(),
      prisma.category.count(),
      Order.count(),
    ]);

    return res.status(200).json({
      users: userCount,
      products: productCount,
      categories: categoryCount,
      orders: orderCount,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAdminStats };
