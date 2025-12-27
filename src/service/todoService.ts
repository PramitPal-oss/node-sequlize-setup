import { AppError } from '@utils/AppError';
import {
  CreateTodoInterface,
  TodoPriority,
  TodoStatus,
  UpdatePayload,
  UpdateTodoInterface,
} from 'interface/todoInterface';
import { TodoModel } from 'models';

export const createTodoService = async (params: CreateTodoInterface) => {
  const { description, title, userId } = params;

  const todo = await TodoModel.create({
    title: title.trim(),
    description: description?.trim() ?? null,
    user_id: userId,
    priority: params.priority ?? TodoPriority.MEDIUM,
    status: params.status ?? TodoStatus.TODO,
  });

  return todo;
};

export const updateTodoService = async (data: UpdateTodoInterface) => {
  const { id, userId, ...rest } = data;

  const todo = await TodoModel.findOne({
    where: { id, user_id: userId },
  });

  if (!todo) throw new AppError('Todo not found', 404, 'TodoNotFound');

  const updatePayload: UpdatePayload = rest;

  const TodoKeys = Object.keys(updatePayload) as (keyof UpdatePayload)[];

  TodoKeys.forEach((key) => {
    const value = updatePayload[key];
    if (value !== undefined && value !== null) {
      (todo[key] as any) = value;
    }
  });

  await todo.save();
  return todo;
};

export const getAllTodosService = async (userId: number) => {
  const todos = await TodoModel.findAll({
    where: { user_id: userId },
    attributes: {
      exclude: ['DELETED_AT', 'deleted_at', 'user_id'],
    },
    order: [['CREATED_AT', 'DESC']],
  });

  return todos;
};

export const deleTodoService = async (userId: number, id: number) => {
  const todo = await TodoModel.findOne({
    where: { id, user_id: userId },
  });

  if (!todo) throw new AppError('Todo Not Found!', 404, 'NotFound!');

  await todo.destroy();

  return true;
};

export const restoreTodo = async (todoId: number, userId: number) => {
  const todo = await TodoModel.findOne({
    where: { id: todoId, user_id: userId },
    paranoid: false,
  });

  if (!todo) throw new AppError('Todo not found!', 404);

  await todo.restore();

  return todo;
};
