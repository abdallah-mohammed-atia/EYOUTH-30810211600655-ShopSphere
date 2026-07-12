const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Order extends Model {}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'completed',
    },
  },
  {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
  }
);

module.exports = Order;
