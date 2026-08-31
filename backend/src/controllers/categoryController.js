const prisma = require('../lib/prisma');

async function listCategories(req, res, next) {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    return res.status(200).json({ items: categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug })) });
  } catch (err) {
    next(err);
  }
}

async function createCategory(req, res, next) {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required.' });

    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const category = await prisma.category.upsert({
      where: { name },
      update: { slug },
      create: { name, slug },
    });

    return res.status(201).json({ category });
  } catch (err) {
    next(err);
  }
}

module.exports = { listCategories, createCategory };
