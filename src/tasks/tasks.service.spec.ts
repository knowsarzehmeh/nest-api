import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
});

describe('TasksService', () => {
  let service: TasksService;
  let taskRepository;
  let mockUser;

  beforeEach(async () => {
    mockUser = {
      id: 1,
      username: 'test',
      password: 'Testing123!',
      salt: 'qwer4kerk34klkwekl',
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskRepository = module.get<TaskRepository>(TaskRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTasks', () => {
    it('should get all tasks from the task repository', async () => {
      taskRepository.getTasks.mockResolvedValue('someValue');

      expect(taskRepository.getTasks).not.toHaveBeenCalled();

      const filters: GetTasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'Some search query',
      };
      // call taskService.getTasks
      const result = await service.getTasks(mockUser, filters);
      // expect the taskRepository to have been called
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('should call taskRepository.findOne() and successfully return a task ', async () => {
      const taskObj = { title: 'Task Title', description: 'Task desc' };
      taskRepository.findOne.mockResolvedValue(taskObj);

      const result = await service.getTaskById(mockUser, 1);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: mockUser.id },
      });
      expect(result).toEqual(taskObj);
    });

    it('should throw an error if task not found', () => {
      taskRepository.findOne.mockResolvedValue(null);

      expect(service.getTaskById(mockUser, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createTask', () => {
    it('should create a task and return the result', async () => {
      taskRepository.createTask.mockResolvedValue({});
      expect(taskRepository.createTask).not.toHaveBeenCalled();
      const mockCreateTask = {
        title: 'Mock Title',
        description: 'Mock description',
      };
      const result = await service.createTask(mockUser, mockCreateTask);
      expect(taskRepository.createTask).toHaveBeenCalledWith(
        mockUser,
        mockCreateTask,
      );
      expect(result).toEqual({});
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 1 });
      expect(taskRepository.delete).not.toHaveBeenCalled();
      await service.deleteTask(mockUser, 2);
      expect(taskRepository.delete).toHaveBeenCalled();
    });

    it('should throw an error if task not found', () => {
      taskRepository.delete.mockResolvedValue({ affected: 0 });
      expect(service.deleteTask(mockUser, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      const save = jest.fn().mockResolvedValue(true);
      service.getTaskById = jest.fn().mockResolvedValue({
        status: TaskStatus.OPEN,
        save,
      });

      expect(service.getTaskById).not.toHaveBeenCalled();
      const result = await service.updateTask(mockUser, 2, TaskStatus.DONE);
      expect(service.getTaskById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.status).toBe(TaskStatus.DONE);
    });
  });
});
