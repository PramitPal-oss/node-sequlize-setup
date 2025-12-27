import { TodoModel } from 'models';

export enum TodoStatus {
  TODO = 1,
  IN_PROGRESS = 2,
  COMPLETED = 3,
}

export enum TodoPriority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
}

export interface CreateTodoInterface {
  title: string;
  description: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  userId: number;
}

export interface UpdateTodoInterface {
  id: number;
  title?: string;
  description?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  userId: number;
}

export type UpdatableTodoFields = Pick<TodoModel, 'title' | 'description' | 'status' | 'priority'>;

export type UpdatePayload = Partial<UpdatableTodoFields>;
