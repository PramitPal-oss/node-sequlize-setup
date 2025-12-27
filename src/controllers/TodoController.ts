import { catchAsync } from '@utils/catchAsync';
import { Request, Response } from 'express';
import { CreateTodoInterface, UpdateTodoInterface } from 'interface/todoInterface';
import { createTodoService, deleTodoService, getAllTodosService, updateTodoService } from 'service/todoService';

export const createTodoController = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const data = req.body;
  const params: CreateTodoInterface = { ...data, userId };

  await createTodoService(params);

  res.status(200).json({
    success: true,
    message: 'Todo Created Successfully!!',
  });
});

export const updateTodoController = catchAsync(async (req: Request, res: Response) => {
  const todoId = Number(req.params.id);
  const userId = req.user!.userId;
  const data = req.body as UpdateTodoInterface;

  const updatedTodo = await updateTodoService({
    id: todoId,
    userId,
    title: data?.title,
    description: data?.description,
    status: data?.status,
    priority: data?.priority,
  });

  res.status(200).json({
    success: true,
    message: 'Todo updated successfully',
    data: updatedTodo,
  });
});

export const getAllTodoController = catchAsync(async (req: Request, res: Response) => {
  console.log('Running from controller');
  const userId = req.user!.userId;
  console.log(userId);
  const todos = await getAllTodosService(userId);

  res.status(200).json({
    success: true,
    message: 'Successfully Retrive all Todos',
    data: todos,
  });
});

export const deleteTodoController = catchAsync(async (req: Request, res: Response) => {
  const todoId = Number(req.params.id);
  const userId = req.user!.userId;

  await deleTodoService(todoId, userId);

  res.status(204).json({
    success: true,
    message: 'Todo Deleted!',
  });
});
