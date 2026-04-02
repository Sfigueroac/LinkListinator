import { User } from '../../users/entities/user.entity';
import { Link } from '../../links/entities/link.entity';
export declare class Collection {
    id: string;
    name: string;
    description: string;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
    owner: User;
    ownerId: string;
    links: Link[];
}
