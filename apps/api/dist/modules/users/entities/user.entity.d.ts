import { Collection } from '../../collections/entities/collection.entity';
export declare class User {
    id: string;
    email: string;
    username: string;
    passwordHash: string;
    displayName: string;
    createdAt: Date;
    collections: Collection[];
}
