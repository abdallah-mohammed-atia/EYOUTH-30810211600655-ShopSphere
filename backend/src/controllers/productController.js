const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const { Product } = require('../models');
const { paginate, buildPaginationMeta } = require('../utils/pagination');

const SORTABLE_FIELDS = ['price', 'name', 'createdAt'];
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f3f3f3'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-family='Arial, sans-serif' font-size='16'%3ENo Image Available%3C/text%3E%3C/svg%3E";

function getFallbackProductImage() {
  return PLACEHOLDER_IMAGE;
}

function resolveImageUrl(req, imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return imageUrl;
  }

  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }

  const protocol = (req.get('x-forwarded-proto') || req.protocol).split(',')[0].trim();
  const host = req.get('host');
  if (!host) {
    return imageUrl;
  }

  return `${protocol}://${host}${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
}

function uploadImageExists(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return false;
  }

  if (!imageUrl.startsWith('/uploads/')) {
    return false;
  }

  const relativePath = imageUrl.replace('/uploads/', '');

  const filePath = path.join(
    __dirname,
    '..',
    'uploads',
    relativePath
  );

  return fs.existsSync(filePath);
}

function withFallbackImage(product, req) {
  const json = product.toJSON ? product.toJSON() : { ...product };
  let imageUrl = json.imageUrl;

  if (imageUrl && imageUrl.startsWith('/uploads/') && !uploadImageExists(imageUrl)) {
    imageUrl = null;
  }

  if (!imageUrl) {
    imageUrl = getFallbackProductImage(json.name);
  }

  json.imageUrl = resolveImageUrl(req, imageUrl);
  return json;
}

async function listProducts(req, res, next) {
  try {
    const { search, category, sortBy, order, minPrice, maxPrice } = req.query;
    const { page, limit, offset } = paginate(req.query);

    const where = {};

    if (search) {
      const ilikeOp = Product.sequelize.getDialect() === 'postgres' ? Op.iLike : Op.like;
      where[Op.or] = [
        { name: { [ilikeOp]: `%${search}%` } },
        { category: { [ilikeOp]: `%${search}%` } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    const sortField = SORTABLE_FIELDS.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order && order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const { rows, count } = await Product.findAndCountAll({
      where,
      order: [[sortField, sortOrder]],
      limit,
      offset,
    });

    const items = rows.map((product) => withFallbackImage(product, req));

    return res.status(200).json({
      items,
      pagination: buildPaginationMeta({ page, limit, total: count }),
    });
  } catch (err) {
    next(err);
  }
}

async function getProduct(req, res, next) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    return res.status(200).json({ product: withFallbackImage(product, req) });
  } catch (err) {
    next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!name || price === undefined || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required.' });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock: stock || 0,
      imageUrl,
    });

    return res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const { name, description, price, category, stock } = req.body;
    const updates = { name, description, price, category, stock };

    if (req.file) {
      updates.imageUrl = `/uploads/${req.file.filename}`;
    }

    Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key]);

    await product.update(updates);
    return res.status(200).json({ product });
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    await product.destroy();
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
