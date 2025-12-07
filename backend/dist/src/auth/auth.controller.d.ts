import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        user: import("../users/dto/user.dto").UserDto;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: import("../users/dto/user.dto").UserDto;
    }>;
}
