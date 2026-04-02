import { TagsService } from './tags.service';
export declare class TagsController {
    private tagsService;
    constructor(tagsService: TagsService);
    findAll(): Promise<import("./entities/tag.entity").Tag[]>;
    findPopular(): Promise<import("./entities/tag.entity").Tag[]>;
}
