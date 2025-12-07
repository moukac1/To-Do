import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '@prisma/client';
export declare class TasksService {
    private tasksRepository;
    private readonly logger;
    constructor(tasksRepository: TasksRepository);
    create(userId: number, createTaskDto: CreateTaskDto): Promise<Task>;
    findAll(userId: number, done?: boolean): Promise<Task[]>;
    findOne(id: number, userId: number): Promise<Task>;
    update(id: number, userId: number, updateTaskDto: UpdateTaskDto): Promise<Task>;
    remove(id: number, userId: number): Promise<void>;
    toggleDone(id: number, userId: number): Promise<Task>;
}
