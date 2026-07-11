const { CartItem, Product } = require('../models');

async function getCart(req, res, next) {
  try {
    const items = await CartItem.findAll({
      where: { userId: req.user.id },
      include: [{ model: Product }],
    });

    const total = items.reduce((sum, item) => {
      return sum + parseFloat(item.Product.price) * item.quantity;
    }, 0);

    return res.status(200).json({ items, total: total.toFixed(2) });
  } catch (err) {
    next(err);
  }
}

async function addToCart(req, res, next) {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'productId is required.' });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const qty = Math.max(parseInt(quantity, 10) || 1, 1);

    let cartItem = await CartItem.findOne({
      where: { userId: req.user.id, productId },
    });

    if (cartItem) {
      cartItem.quantity += qty;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({ userId: req.user.id, productId, quantity: qty });
    }

    return res.status(201).json({ cartItem });
  } catch (err) {
    next(err);
  }
}

async function updateCartItem(req, res, next) {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'quantity must be at least 1.' });
    }

    const cartItem = await CartItem.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found.' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    return res.status(200).json({ cartItem });
  } catch (err) {
    next(err);
  }
}

async function removeCartItem(req, res, next) {
  try {
    const cartItem = await CartItem.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found.' });
    }

    await cartItem.destroy();
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };
