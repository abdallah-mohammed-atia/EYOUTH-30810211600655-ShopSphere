const prisma = require('../lib/prisma');

async function getCart(req, res, next) {
  try {
    const items = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true },
      orderBy: { createdAt: 'asc' },
    });

    const total = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0).toFixed(2);
    return res.status(200).json({ items: items.map((item) => ({ ...item, product: item.product })), total });
  } catch (err) {
    next(err);
  }
}

async function addToCart(req, res, next) {
  try {
    const { productId, quantity } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId is required.' });

    const product = await prisma.product.findUnique({ where: { id: Number(productId) } });
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    const qty = Math.max(parseInt(quantity, 10) || 1, 1);
    let cartItem = await prisma.cartItem.findFirst({ where: { userId: req.user.id, productId: Number(productId) } });

    if (cartItem) {
      cartItem = await prisma.cartItem.update({ where: { id: cartItem.id }, data: { quantity: cartItem.quantity + qty } });
    } else {
      cartItem = await prisma.cartItem.create({ data: { userId: req.user.id, productId: Number(productId), quantity: qty } });
    }

    return res.status(201).json({ cartItem });
  } catch (err) {
    next(err);
  }
}

async function updateCartItem(req, res, next) {
  try {
    const quantity = Number(req.body.quantity);
    if (!quantity || quantity < 1) return res.status(400).json({ message: 'quantity must be at least 1.' });

    const cartItem = await prisma.cartItem.findFirst({ where: { id: Number(req.params.id), userId: req.user.id } });
    if (!cartItem) return res.status(404).json({ message: 'Cart item not found.' });

    const updated = await prisma.cartItem.update({ where: { id: cartItem.id }, data: { quantity } });
    return res.status(200).json({ cartItem: updated });
  } catch (err) {
    next(err);
  }
}

async function removeCartItem(req, res, next) {
  try {
    const cartItem = await prisma.cartItem.findFirst({ where: { id: Number(req.params.id), userId: req.user.id } });
    if (!cartItem) return res.status(404).json({ message: 'Cart item not found.' });

    await prisma.cartItem.delete({ where: { id: cartItem.id } });
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };
