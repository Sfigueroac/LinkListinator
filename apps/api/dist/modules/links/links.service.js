"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const link_entity_1 = require("./entities/link.entity");
const tags_service_1 = require("../tags/tags.service");
let LinksService = class LinksService {
    repo;
    tagsService;
    constructor(repo, tagsService) {
        this.repo = repo;
        this.tagsService = tagsService;
    }
    async findMine(ownerId, filters) {
        const { collectionId, tag, page = 1, limit = 20 } = filters;
        const qb = this.repo
            .createQueryBuilder('link')
            .leftJoinAndSelect('link.tags', 'tag')
            .leftJoin('link.collection', 'collection')
            .where('collection.ownerId = :ownerId', { ownerId })
            .orderBy('link.createdAt', 'DESC')
            .take(limit)
            .skip((page - 1) * limit);
        if (collectionId) {
            qb.andWhere('link.collectionId = :collectionId', { collectionId });
        }
        if (tag) {
            qb.andWhere('tag.name = :tag', { tag: tag.toLowerCase() });
        }
        return qb.getMany();
    }
    async search(tag) {
        return this.repo
            .createQueryBuilder('link')
            .leftJoinAndSelect('link.tags', 'tag')
            .leftJoin('link.collection', 'collection')
            .where('collection.isPublic = true')
            .andWhere('tag.name = :tag', { tag: tag.toLowerCase() })
            .orderBy('link.createdAt', 'DESC')
            .getMany();
    }
    async create(ownerId, dto) {
        const tags = await Promise.all((dto.tags ?? []).map((t) => this.tagsService.findOrCreate(t)));
        const link = this.repo.create({
            url: dto.url,
            title: dto.title,
            description: dto.description,
            collectionId: dto.collectionId,
            tags,
        });
        return this.repo.save(link);
    }
    async update(id, ownerId, dto) {
        const link = await this.repo.findOne({
            where: { id },
            relations: { collection: true, tags: true },
        });
        if (!link)
            throw new common_1.NotFoundException('Link not found');
        if (link.collection.ownerId !== ownerId)
            throw new common_1.ForbiddenException('Access denied');
        if (dto.tags !== undefined) {
            link.tags = await Promise.all(dto.tags.map((t) => this.tagsService.findOrCreate(t)));
        }
        Object.assign(link, {
            url: dto.url ?? link.url,
            title: dto.title ?? link.title,
            description: dto.description ?? link.description,
            collectionId: dto.collectionId ?? link.collectionId,
        });
        return this.repo.save(link);
    }
    async fetchMeta(url) {
        try {
            const res = await fetch(url, {
                signal: AbortSignal.timeout(5000),
                headers: { 'User-Agent': 'Mozilla/5.0' },
            });
            const html = await res.text();
            const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
            const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ??
                html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
            return {
                title: titleMatch?.[1]?.trim() ?? '',
                description: descMatch?.[1]?.trim() ?? '',
            };
        }
        catch {
            return { title: '', description: '' };
        }
    }
    async remove(id, ownerId) {
        const link = await this.repo.findOne({
            where: { id },
            relations: { collection: true },
        });
        if (!link)
            throw new common_1.NotFoundException('Link not found');
        if (link.collection.ownerId !== ownerId)
            throw new common_1.ForbiddenException('Access denied');
        await this.repo.remove(link);
        return { deleted: true };
    }
};
exports.LinksService = LinksService;
exports.LinksService = LinksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(link_entity_1.Link)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        tags_service_1.TagsService])
], LinksService);
//# sourceMappingURL=links.service.js.map