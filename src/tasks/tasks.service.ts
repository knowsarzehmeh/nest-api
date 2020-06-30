import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { DeleteResult } from 'typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}

  async getTasks(user: User, filterDto: GetTasksFilterDto): Promise<Task[]> {
    return await this.taskRepository.getTasks(user, filterDto);
  }

  async getTaskById(user: User, id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!task)
      throw new NotFoundException(
        `Task with the given id ${id} was not found!`,
      );

    return task;
  }

  async createTask(user: User, createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(user, createTaskDto);
  }

  async updateTask(user: User, id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(user, id);
    task.status = status;
    await task.save();
    return task;
  }

  async deleteTask(user: User, id: number): Promise<void> {
    const deleteResult: DeleteResult = await this.taskRepository.delete({
      id,
      userId: user.id,
    });
    if (deleteResult.affected === 0)
      throw new NotFoundException('Task Id not Found');
  }
}
