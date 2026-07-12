const { CartItem, Order, OrderItem, Product } = require('../models');
const { getMongoDb } = require('../lib/mongo');

async function createOrder(req, res, next) {
  try {
    const cartItems = await CartItem.findAll({
      where: { userId: req.user.id },
      include: [{ model: Product }],
    });

    if (!cartItems.length) {
      return res.status(400).json({ message: 'Your cart is empty.' });
    }

    const total = cartItems
      .reduce((sum, item) => sum + parseFloat(item.Product.price) * item.quantity, 0)
      .toFixed(2);

    const order = await Order.create({ userId: req.user.id, total, status: 'completed' });

    const items = await Promise.all(
      cartItems.map((item) =>
        OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          productName: item.Product.name,
          unitPrice: item.Product.price,
          quantity: item.quantity,
          total: (parseFloat(item.Product.price) * item.quantity).toFixed(2),
        })
      )
    );

    await CartItem.destroy({ where: { userId: req.user.id } });

    try {
      const db = await getMongoDb();
      await db.collection('activity').insertOne({
        type: 'order.created',
        userId: req.user.id,
        orderId: order.id,
        message: `Order ${order.id} created by ${req.user.name}`,
        createdAt: new Date(),
      });
    } catch (mongoErr) {
      console.warn('Mongo activity logging unavailable:', mongoErr.message);
    }

    return res.status(201).json({ order: { ...order.toJSON(), items } });
  } catch (err) {
    next(err);
  }
}

async function getOrders(req, res, next) {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{ model: OrderItem, include: [Product] }],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({ items: orders });
  } catch (err) {
    next(err);
  }
}

async function getOrder(req, res, next) {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, include: [Product] }],
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    return res.status(200).json({ order });
  } catch (err) {
    next(err);
  }
}

module.exports = { createOrder, getOrders, getOrder };
