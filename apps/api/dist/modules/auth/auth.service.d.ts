import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private usersRepo;
    private jwtService;
    constructor(usersRepo: Repository<User>, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            username: string;
            displayName: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            username: string;
            displayName: string;
        };
    }>;
    private signResponse;
}
