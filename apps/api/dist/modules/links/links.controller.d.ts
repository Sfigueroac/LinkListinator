import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
export declare class LinksController {
    private linksService;
    constructor(linksService: LinksService);
    findMine(user: {
        id: string;
    }, collectionId?: string, tag?: string, page?: number, limit?: number): Promise<import("./entities/link.entity").Link[]>;
    search(tag: string): Promise<import("./entities/link.entity").Link[]>;
    create(user: {
        id: string;
    }, dto: CreateLinkDto): Promise<import("./entities/link.entity").Link>;
    update(id: string, user: {
        id: string;
    }, dto: UpdateLinkDto): Promise<import("./entities/link.entity").Link>;
    remove(id: string, user: {
        id: string;
    }): Promise<{
        deleted: boolean;
    }>;
}
