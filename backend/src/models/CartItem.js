const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class CartItem extends Model {}

CartItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: { min: 1 },
    },
  },
  {
    sequelize,
    modelName: 'CartItem',
    tableName: 'cart_items',
  }
);

module.exports = CartItem;
