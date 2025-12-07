import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserDto } from '../users/dto/user.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    private readonly logger;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        user: UserDto;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: UserDto;
    }>;
    validateUser(email: string, password: string): Promise<UserDto>;
    private generateTokens;
}
