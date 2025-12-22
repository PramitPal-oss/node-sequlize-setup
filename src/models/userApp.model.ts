import { sequelize } from '@config/database';
import { DataTypes } from 'sequelize';

const UserAppModel = sequelize.define(
  'UserApp',
  {
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      field: 'USER_ID',
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    app_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      field: 'APP_ID',
      references: {
        model: 'apps',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    assigned_at: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'ASSIGNED_AT',
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'user_apps',
    timestamps: false,
  },
);

export default UserAppModel;
