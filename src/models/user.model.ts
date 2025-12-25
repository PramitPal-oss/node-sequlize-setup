import { sequelize } from '@config/database';
import bcrypt from 'bcrypt';
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

class UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  declare id: CreationOptional<number>;
  declare first_name: string;
  declare last_name: string;
  declare email: string;
  declare phone: string | null;
  declare address: string | null;
  declare password: string;
  declare username: string;
  declare app_ids?: number[];

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'ID',
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'FIRST_NAME',
      validate: {
        isAlpha: true,
        notEmpty: true,
      },
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'LAST_NAME',
      validate: {
        isAlpha: true,
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      field: 'EMAIL',
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
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'PASSWORD',
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
    sequelize,
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },

      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
    // 🔐 DEFAULT: password hidden
    defaultScope: {
      attributes: {
        exclude: ['password'],
      },
    },

    scopes: {
      withPassword: {
        attributes: {
          include: ['password'],
        },
      },
    },
  },
);

export default UserModel;
