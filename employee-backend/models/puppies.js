// models/puppy.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const Puppy = sequelize.define(
  'puppies',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    breed: { type: DataTypes.STRING(100), allowNull: true },
    weight_lbs: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    arrival_date: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
    vaccinated: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  },
  {
    tableName: 'puppies',
    timestamps: false,   // no createdAt/updatedAt
    underscored: true    // uses snake_case columns if Sequelize adds any
  }
);

export default Puppy;
