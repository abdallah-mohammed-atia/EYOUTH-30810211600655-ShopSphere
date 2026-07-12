const prisma = require('../lib/prisma');

async function listCategories(req, res, next) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true },
    });

    return res.status(200).json({ items: categories });
  } catch (err) {
    next(err);
  }
}

module.exports = { listCategories };
