import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
export declare class UsersRepository {
    private prisma;
    constructor(prisma: PrismaService);
    createUser(data: {
        email: string;
        password: string;
        name?: string;
    }): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
}
