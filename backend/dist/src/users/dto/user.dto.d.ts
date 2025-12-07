export declare class UserDto {
    id: number;
    email: string;
    name?: string;
    createdAt: Date;
    updatedAt: Date;
    password: string;
    constructor(partial: Partial<UserDto>);
}
