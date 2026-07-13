const fs = require('fs');
const path = require('path');
const prisma = require('../lib/prisma');
const { getMongoDb } = require('../lib/mongo');
const { paginate, buildPaginationMeta } = require('../utils/pagination');

const SORTABLE_FIELDS = ['price', 'name', 'createdAt'];
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f3f3f3'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-family='Arial, sans-serif' font-size='16'%3ENo Image Available%3C/text%3E%3C/svg%3E";

function getFallbackProductImage() {
  return PLACEHOLDER_IMAGE;
}

function resolveImageUrl(req, imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') return imageUrl;
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  const protocol = (req.get('x-forwarded-proto') || req.protocol).split(',')[0].trim();
  const host = req.get('host');
  if (!host) return imageUrl;
  return `${protocol}://${host}${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
}

function uploadImageExists(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') return false;
  if (!imageUrl.startsWith('/uploads/')) return false;
  const relativePath = imageUrl.replace('/uploads/', '');
  const filePath = path.join(__dirname, '..', 'uploads', relativePath);
  return fs.existsSync(filePath);
}

function withFallbackImage(product, req) {
  const json = product && typeof product.toJSON === 'function' ? product.toJSON() : { ...product };
  let imageUrl = json.imageUrl || null;
  if (imageUrl && imageUrl.startsWith('/uploads/') && !uploadImageExists(imageUrl)) imageUrl = null;
  if (!imageUrl) imageUrl = getFallbackProductImage(json.name);
  json.imageUrl = resolveImageUrl(req, imageUrl);
  return json;
}

async function listProducts(req, res, next) {
  try {
    const { search, category, sortBy, order, minPrice, maxPrice } = req.query;
    const { page, limit, offset } = paginate(req.query);

    const prismaWhere = {};
    if (search) {
      prismaWhere.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (category) prismaWhere.category = category;
    if (minPrice || maxPrice) prismaWhere.price = {};
    if (minPrice) prismaWhere.price.gte = parseFloat(minPrice);
    if (maxPrice) prismaWhere.price.lte = parseFloat(maxPrice);

    const sortField = SORTABLE_FIELDS.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order && order.toUpperCase() === 'DESC' ? 'desc' : 'asc';

    const total = await prisma.product.count({ where: prismaWhere });
    const rows = await prisma.product.findMany({
      where: prismaWhere,
      orderBy: { [sortField]: sortOrder },
      take: limit,
      skip: offset,
    });

    const items = rows.map((product) => withFallbackImage(product, req));
    return res.status(200).json({ items, pagination: buildPaginationMeta({ page, limit, total }) });
  } catch (err) {
    next(err);
  }
}

async function getProduct(req, res, next) {
  try {
    const id = Number(req.params.id);
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ message: 'Product not found.' });
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
    const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
    await prisma.category.upsert({ where: { name: category }, update: {}, create: { name: category, slug: categorySlug } });

    const categoryRecord = await prisma.category.findUnique({ where: { name: category } });
    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        category,
        categoryId: categoryRecord.id,
        stock: Number(stock || 0),
        imageUrl,
      },
    });

    try {
      const db = await getMongoDb();
      if (db) {
        await db.collection('activity').insertOne({
          type: 'product.created',
          productId: product.id,
          message: `${product.name} created`,
          createdAt: new Date(),
        });
      }
    } catch (mongoErr) {
      // Ignore Mongo logging failures so core product flows still succeed.
    }

    return res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Product not found.' });

    const { name, description, price, category, stock } = req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = parseFloat(price);
    if (stock !== undefined) data.stock = stock;
    if (req.file) data.imageUrl = `/uploads/${req.file.filename}`;

    if (category) {
      const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
      await prisma.category.upsert({ where: { name: category }, update: {}, create: { name: category, slug: categorySlug } });
      const categoryRecord = await prisma.category.findUnique({ where: { name: category } });
      data.category = category;
      data.categoryId = categoryRecord.id;
    }

    const product = await prisma.product.update({ where: { id }, data });
    return res.status(200).json({ product });
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Product not found.' });
    await prisma.product.delete({ where: { id } });
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct };
