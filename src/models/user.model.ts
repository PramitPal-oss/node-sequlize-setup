import { sequelize } from '@config/database';
import { DataTypes } from 'sequelize';

const UserModel = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      field: 'ID',
    },
    first_name: {
      type: DataTypes.STRING(100),
      field: 'FIRST_NAME',
      allowNull: false,
      validate: {
        isAlpha: true,
        notEmpty: true,
      },
    },
    last_name: {
      type: DataTypes.STRING(100),
      field: 'LAST_NAME',
      allowNull: true,
      validate: {
        isAlpha: true,
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'EMAIL',
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'PHONE',
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'ADDRESS',
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'PASSWORD_HASH',
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'USERNAME',
      validate: {
        isLowercase: true,
        notEmpty: true,
      },
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: true,
  },
);

export default UserModel;
