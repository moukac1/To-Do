"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_service_1 = require("../src/auth/auth.service");
const users_service_1 = require("../src/users/users.service");
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
jest.mock('bcrypt');
describe('AuthService', () => {
    let service;
    let usersService;
    let jwtService;
    const mockUsersService = {
        createUser: jest.fn(),
        findByEmail: jest.fn(),
        findById: jest.fn(),
    };
    const mockJwtService = {
        signAsync: jest.fn(),
    };
    const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: '$2b$10$hashedpassword',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                {
                    provide: users_service_1.UsersService,
                    useValue: mockUsersService,
                },
                {
                    provide: jwt_1.JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
        usersService = module.get(users_service_1.UsersService);
        jwtService = module.get(jwt_1.JwtService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('register', () => {
        it('should register a new user successfully', async () => {
            const registerDto = {
                email: 'newuser@example.com',
                password: 'password123',
                name: 'New User',
            };
            mockUsersService.createUser.mockResolvedValue(mockUser);
            mockJwtService.signAsync.mockResolvedValue('mock.jwt.token');
            const result = await service.register(registerDto);
            expect(usersService.createUser).toHaveBeenCalledWith(registerDto.email, registerDto.password, registerDto.name);
            expect(result).toHaveProperty('user');
            expect(result).toHaveProperty('accessToken');
            expect(result.user.password).toBeUndefined();
        });
        it('should throw ConflictException if user already exists', async () => {
            const registerDto = {
                email: 'existing@example.com',
                password: 'password123',
            };
            mockUsersService.createUser.mockRejectedValue(new common_1.ConflictException('User with this email already exists'));
            await expect(service.register(registerDto)).rejects.toThrow(common_1.ConflictException);
        });
    });
    describe('login', () => {
        it('should login user with valid credentials', async () => {
            const loginDto = {
                email: 'test@example.com',
                password: 'password123',
            };
            mockUsersService.findByEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            mockJwtService.signAsync.mockResolvedValue('mock.jwt.token');
            const result = await service.login(loginDto);
            expect(usersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
            expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
            expect(result).toHaveProperty('user');
            expect(result).toHaveProperty('accessToken');
            expect(result.user.password).toBeUndefined();
        });
        it('should throw UnauthorizedException with invalid credentials', async () => {
            const loginDto = {
                email: 'test@example.com',
                password: 'wrongpassword',
            };
            mockUsersService.findByEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);
            await expect(service.login(loginDto)).rejects.toThrow(common_1.UnauthorizedException);
        });
        it('should throw UnauthorizedException if user not found', async () => {
            const loginDto = {
                email: 'nonexistent@example.com',
                password: 'password123',
            };
            mockUsersService.findByEmail.mockResolvedValue(null);
            await expect(service.login(loginDto)).rejects.toThrow(common_1.UnauthorizedException);
        });
    });
    describe('validateUser', () => {
        it('should return user if credentials are valid', async () => {
            mockUsersService.findByEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            const result = await service.validateUser('test@example.com', 'password123');
            expect(result).toEqual(mockUser);
        });
        it('should return null if password is invalid', async () => {
            mockUsersService.findByEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);
            const result = await service.validateUser('test@example.com', 'wrongpassword');
            expect(result).toBeNull();
        });
        it('should return null if user not found', async () => {
            mockUsersService.findByEmail.mockResolvedValue(null);
            const result = await service.validateUser('nonexistent@example.com', 'password123');
            expect(result).toBeNull();
        });
    });
});
//# sourceMappingURL=auth.service.spec.js.map