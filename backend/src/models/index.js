const sequelize = require('../config/db');
const User = require('./User');
const Product = require('./Product');
const CartItem = require('./CartItem');
const Category = require('./Category');

// Associations
User.hasMany(CartItem, { foreignKey: 'userId', onDelete: 'CASCADE' });
CartItem.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(CartItem, { foreignKey: 'productId', onDelete: 'CASCADE' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });

Category.hasMany(Product, { foreignKey: 'categoryId', onDelete: 'SET NULL' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = {
  sequelize,
  User,
  Product,
  CartItem,
  Category,
};
