import { Injectable, ConflictException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserDto } from './dto/user.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async createUser(email: string, password: string, name?: string): Promise<UserDto> {
    const existingUser = await this.usersRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersRepository.createUser({
      email,
      password: hashedPassword,
      name,
    });

    return new UserDto(user);
  }

  async findByEmail(email: string): Promise<UserDto | null> {
    const user = await this.usersRepository.findByEmail(email);
    return user ? new UserDto(user) : null;
  }

  async findById(id: number): Promise<UserDto | null> {
    const user = await this.usersRepository.findById(id);
    return user ? new UserDto(user) : null;
  }
}
