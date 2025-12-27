import { sequelize } from '@config/database';
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

export type TodoStatus = 'todo' | 'in_progress' | 'completed';
export type TodoPriority = 'low' | 'medium' | 'high';

class TodoModel extends Model<InferAttributes<TodoModel>, InferCreationAttributes<TodoModel>> {
  declare id: CreationOptional<number>;
  declare user_id: number;

  declare title: string;
  declare description: string | null;

  declare status: TodoStatus;
  declare priority: TodoPriority;

  declare completed_at: Date | null;
  declare deleted_at: Date | null;
}

TodoModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'ID',
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'USER_ID',
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },

    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'TITLE',
      validate: {
        notEmpty: true,
      },
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'DESCRIPTION',
    },

    status: {
      type: DataTypes.ENUM('todo', 'in_progress', 'completed'),
      allowNull: false,
      defaultValue: 'todo',
      field: 'STATUS',
    },

    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      allowNull: false,
      defaultValue: 'medium',
      field: 'PRIORITY',
    },

    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'COMPLETED_AT',
    },

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'DELETED_AT',
    },
  },
  {
    sequelize,
    tableName: 'todos',

    timestamps: true,
    createdAt: 'CREATED_AT',
    updatedAt: 'UPDATED_AT',

    paranoid: true,
    deletedAt: 'DELETED_AT',

    hooks: {
      beforeUpdate: (todo) => {
        if (todo.changed('status') && todo.status === 'completed') {
          todo.completed_at = new Date();
        }
      },
    },

    indexes: [{ fields: ['USER_ID'] }, { fields: ['STATUS'] }, { fields: ['PRIORITY'] }],
  },
);

export default TodoModel;
