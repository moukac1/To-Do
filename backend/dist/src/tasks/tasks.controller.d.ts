import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksController {
    private tasksService;
    constructor(tasksService: TasksService);
    create(req: any, createTaskDto: CreateTaskDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        done: boolean;
        ownerId: number;
    }>;
    findAll(req: any, done?: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        done: boolean;
        ownerId: number;
    }[]>;
    findOne(req: any, id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        done: boolean;
        ownerId: number;
    }>;
    update(req: any, id: number, updateTaskDto: UpdateTaskDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        done: boolean;
        ownerId: number;
    }>;
    remove(req: any, id: number): Promise<void>;
}
