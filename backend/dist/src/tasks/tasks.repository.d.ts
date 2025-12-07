import { PrismaService } from '../prisma/prisma.service';
import { Task } from '@prisma/client';
export declare class TasksRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        title: string;
        description?: string;
        ownerId: number;
    }): Promise<Task>;
    findManyByOwner(ownerId: number, done?: boolean): Promise<Task[]>;
    findByIdAndOwner(id: number, ownerId: number): Promise<Task | null>;
    update(id: number, ownerId: number, data: {
        title?: string;
        description?: string;
        done?: boolean;
    }): Promise<Task | null>;
    delete(id: number, ownerId: number): Promise<Task | null>;
}
