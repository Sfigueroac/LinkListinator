import { Repository } from 'typeorm';
import { Collection } from './entities/collection.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
export declare class CollectionsService {
    private repo;
    constructor(repo: Repository<Collection>);
    findMine(ownerId: string): Promise<Collection[]>;
    findPublic(page?: number, limit?: number): Promise<Collection[]>;
    findOne(id: string, requesterId?: string): Promise<Collection>;
    create(ownerId: string, dto: CreateCollectionDto): Promise<Collection>;
    update(id: string, ownerId: string, dto: UpdateCollectionDto): Promise<Collection | null>;
    remove(id: string, ownerId: string): Promise<{
        deleted: boolean;
    }>;
}
