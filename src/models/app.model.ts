import { sequelize } from '@config/database';
import { DataTypes } from 'sequelize';

const AppModel = sequelize.define(
  'App',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      field: 'ID',
    },
    app_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: 'APP_CODE',
    },
    app_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'APP_NAME',
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'DESCRIPTION',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'IS_ACTIVE',
    },
  },
  {
    tableName: 'apps',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: true,
  },
);

export default AppModel;
