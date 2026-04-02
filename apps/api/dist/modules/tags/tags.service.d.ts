import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
export declare class TagsService {
    private repo;
    constructor(repo: Repository<Tag>);
    findOrCreate(name: string): Promise<Tag>;
    findAll(): Promise<Tag[]>;
    findPopular(limit?: number): Promise<Tag[]>;
}
