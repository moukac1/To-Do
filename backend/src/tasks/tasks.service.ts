import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '@prisma/client';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private tasksRepository: TasksRepository) {}

  async create(userId: number, createTaskDto: CreateTaskDto): Promise<Task> {
    this.logger.log(`Creating task for user ${userId}: ${createTaskDto.title}`);

    return this.tasksRepository.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
      ownerId: userId,
    });
  }

  async findAll(userId: number, done?: boolean): Promise<Task[]> {
    this.logger.log(`Fetching tasks for user ${userId}, done filter: ${done}`);

    return this.tasksRepository.findManyByOwner(userId, done);
  }

  async findOne(id: number, userId: number): Promise<Task> {
    const task = await this.tasksRepository.findByIdAndOwner(id, userId);

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found or access denied`);
    }

    return task;
  }

  async update(id: number, userId: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    this.logger.log(`Updating task ${id} for user ${userId}`);

    const task = await this.tasksRepository.update(id, userId, updateTaskDto);

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found or access denied`);
    }

    return task;
  }

  async remove(id: number, userId: number): Promise<void> {
    this.logger.log(`Deleting task ${id} for user ${userId}`);

    const task = await this.tasksRepository.delete(id, userId);

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found or access denied`);
    }
  }

  async toggleDone(id: number, userId: number): Promise<Task> {
    const task = await this.findOne(id, userId);
    return this.update(id, userId, { done: !task.done });
  }
}
