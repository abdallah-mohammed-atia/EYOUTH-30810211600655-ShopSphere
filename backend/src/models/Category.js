const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Category extends Model {}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { notEmpty: true },
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { notEmpty: true },
    },
  },
  {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
  }
);

module.exports = Category;
