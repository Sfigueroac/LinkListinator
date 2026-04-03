import { Repository } from 'typeorm';
import { Link } from './entities/link.entity';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { TagsService } from '../tags/tags.service';
export declare class LinksService {
    private repo;
    private tagsService;
    constructor(repo: Repository<Link>, tagsService: TagsService);
    findMine(ownerId: string, filters: {
        collectionId?: string;
        tag?: string;
        page?: number;
        limit?: number;
    }): Promise<Link[]>;
    search(tag: string): Promise<Link[]>;
    create(ownerId: string, dto: CreateLinkDto): Promise<Link>;
    update(id: string, ownerId: string, dto: UpdateLinkDto): Promise<Link>;
    fetchMeta(url: string): Promise<{
        title: string;
        description: string;
    }>;
    remove(id: string, ownerId: string): Promise<{
        deleted: boolean;
    }>;
}
