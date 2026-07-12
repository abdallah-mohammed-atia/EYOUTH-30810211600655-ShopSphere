const prisma = require('../lib/prisma');
const { User, Product } = require('../models');

async function getAdminStats(req, res, next) {
  try {
    const [userCount, productCount, categoryCount] = await Promise.all([
      User.count(),
      Product.count(),
      prisma.category.count(),
    ]);

    return res.status(200).json({
      users: userCount,
      products: productCount,
      categories: categoryCount,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAdminStats };
