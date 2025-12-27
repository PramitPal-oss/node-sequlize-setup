import { sequelize } from '@config/database';
import { TodoPriority, TodoStatus } from 'interface/todoInterface';
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

class TodoModel extends Model<InferAttributes<TodoModel>, InferCreationAttributes<TodoModel>> {
  declare id: CreationOptional<number>;
  declare user_id: number;

  declare title: string;
  declare description: string | null;

  declare status: TodoStatus;
  declare priority: TodoPriority;

  declare completed_at: Date | null;
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
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: TodoStatus.TODO,
      field: 'STATUS',
    },

    priority: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: TodoPriority.MEDIUM,
      field: 'PRIORITY',
    },

    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'COMPLETED_AT',
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
        if (todo.changed('status') && todo.status === TodoStatus.COMPLETED && !todo.completed_at) {
          todo.completed_at = new Date();
        }
      },
    },

    indexes: [{ fields: ['USER_ID'] }, { fields: ['STATUS'] }, { fields: ['PRIORITY'] }],
  },
);

export default TodoModel;
