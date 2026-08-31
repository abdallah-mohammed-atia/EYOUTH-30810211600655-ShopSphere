const prisma = require('../lib/prisma');
const { getMongoDb } = require('../lib/mongo');

async function createOrder(req, res, next) {
  try {
    const cartItems = await prisma.cartItem.findMany({ where: { userId: req.user.id }, include: { product: true } });
    if (!cartItems.length) return res.status(400).json({ message: 'Your cart is empty.' });

    const total = cartItems.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0).toFixed(2);
    const order = await prisma.order.create({ data: { userId: req.user.id, total, status: 'completed' } });

    const items = await Promise.all(cartItems.map((item) => prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: item.productId,
        productName: item.product.name,
        unitPrice: item.product.price,
        quantity: item.quantity,
        total: (Number(item.product.price) * item.quantity).toFixed(2),
      },
    })));

    await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });

    try {
      const db = await getMongoDb();
      if (db) {
        await db.collection('activity').insertOne({
          type: 'order.created',
          userId: req.user.id,
          orderId: order.id,
          message: `Order ${order.id} created by ${req.user.name}`,
          createdAt: new Date(),
        });
      }
    } catch (mongoErr) {
      // Ignore Mongo logging failures so core order flows still succeed.
    }

    return res.status(201).json({ order: { ...order, total: order.total.toString(), items } });
  } catch (err) {
    next(err);
  }
}

async function getOrders(req, res, next) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json({ items: orders });
  } catch (err) {
    next(err);
  }
}

async function getOrder(req, res, next) {
  try {
    const order = await prisma.order.findUnique({ where: { id: Number(req.params.id) }, include: { items: { include: { product: true } } } });
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    if (order.userId !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied.' });
    return res.status(200).json({ order });
  } catch (err) {
    next(err);
  }
}

module.exports = { createOrder, getOrders, getOrder };
