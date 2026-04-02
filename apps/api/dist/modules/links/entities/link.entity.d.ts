import { Collection } from '../../collections/entities/collection.entity';
import { Tag } from '../../tags/entities/tag.entity';
export declare class Link {
    id: string;
    url: string;
    title: string;
    description: string;
    favicon: string;
    createdAt: Date;
    collection: Collection;
    collectionId: string;
    tags: Tag[];
}
