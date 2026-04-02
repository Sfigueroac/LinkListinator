import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
export declare class CollectionsController {
    private collectionsService;
    constructor(collectionsService: CollectionsService);
    findMine(user: {
        id: string;
    }): Promise<import("./entities/collection.entity").Collection[]>;
    findPublic(page?: number, limit?: number): Promise<import("./entities/collection.entity").Collection[]>;
    findOne(id: string, user?: {
        id: string;
    }): Promise<import("./entities/collection.entity").Collection>;
    create(user: {
        id: string;
    }, dto: CreateCollectionDto): Promise<import("./entities/collection.entity").Collection>;
    update(id: string, user: {
        id: string;
    }, dto: UpdateCollectionDto): Promise<import("./entities/collection.entity").Collection | null>;
    remove(id: string, user: {
        id: string;
    }): Promise<{
        deleted: boolean;
    }>;
}
