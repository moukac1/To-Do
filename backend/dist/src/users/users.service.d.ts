import { UsersRepository } from './users.repository';
import { UserDto } from './dto/user.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: UsersRepository);
    createUser(email: string, password: string, name?: string): Promise<UserDto>;
    findByEmail(email: string): Promise<UserDto | null>;
    findById(id: number): Promise<UserDto | null>;
}
