const prisma = require('../lib/prisma');

async function getAdminStats(req, res, next) {
  try {
    const [userCount, productCount, categoryCount, orderCount] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count(),
    ]);

    return res.status(200).json({ users: userCount, products: productCount, categories: categoryCount, orders: orderCount });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAdminStats };
