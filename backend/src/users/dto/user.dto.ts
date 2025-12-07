import { Exclude } from 'class-transformer';

export class UserDto {
  id: number;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
