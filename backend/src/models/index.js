const sequelize = require('../config/db');
const User = require('./User');
const Product = require('./Product');
const CartItem = require('./CartItem');
const Category = require('./Category');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Associations
User.hasMany(CartItem, { foreignKey: 'userId', onDelete: 'CASCADE' });
CartItem.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(CartItem, { foreignKey: 'productId', onDelete: 'CASCADE' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });

Category.hasMany(Product, { foreignKey: 'categoryId', onDelete: 'SET NULL' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

User.hasMany(Order, { foreignKey: 'userId', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

module.exports = {
  sequelize,
  User,
  Product,
  CartItem,
  Category,
  Order,
  OrderItem,
};
