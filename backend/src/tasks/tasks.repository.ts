import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from '@prisma/client';

@Injectable()
export class TasksRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: { title: string; description?: string; ownerId: number }): Promise<Task> {
    return this.prisma.task.create({
      data,
    });
  }

  async findManyByOwner(ownerId: number, done?: boolean): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: {
        ownerId,
        ...(done !== undefined && { done }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByIdAndOwner(id: number, ownerId: number): Promise<Task | null> {
    return this.prisma.task.findFirst({
      where: {
        id,
        ownerId,
      },
    });
  }

  async update(
    id: number,
    ownerId: number,
    data: { title?: string; description?: string; done?: boolean },
  ): Promise<Task | null> {
    // First check if task exists and belongs to owner
    const task = await this.findByIdAndOwner(id, ownerId);
    if (!task) {
      return null;
    }

    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  async delete(id: number, ownerId: number): Promise<Task | null> {
    // First check if task exists and belongs to owner
    const task = await this.findByIdAndOwner(id, ownerId);
    if (!task) {
      return null;
    }

    return this.prisma.task.delete({
      where: { id },
    });
  }
}
