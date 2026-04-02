import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private repo;
    constructor(repo: Repository<User>);
    findByUsername(username: string): Promise<{
        id: string;
        username: string;
        displayName: string;
        collections: {
            id: string;
            name: string;
            description: string;
            isPublic: boolean;
            createdAt: Date;
        }[];
    }>;
    updateMe(userId: string, dto: UpdateUserDto): Promise<User | null>;
}
