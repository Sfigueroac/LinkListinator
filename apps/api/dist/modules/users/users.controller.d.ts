import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
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
    updateMe(user: {
        id: string;
    }, dto: UpdateUserDto): Promise<import("./entities/user.entity").User | null>;
}
