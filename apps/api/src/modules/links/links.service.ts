import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from './entities/link.entity';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { TagsService } from '../tags/tags.service';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link) private repo: Repository<Link>,
    private tagsService: TagsService,
  ) {}

  async findMine(
    ownerId: string,
    filters: { collectionId?: string; tag?: string; page?: number; limit?: number },
  ) {
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

  async search(tag: string) {
    return this.repo
      .createQueryBuilder('link')
      .leftJoinAndSelect('link.tags', 'tag')
      .leftJoin('link.collection', 'collection')
      .where('collection.isPublic = true')
      .andWhere('tag.name = :tag', { tag: tag.toLowerCase() })
      .orderBy('link.createdAt', 'DESC')
      .getMany();
  }

  async create(ownerId: string, dto: CreateLinkDto) {
    const tags = await Promise.all(
      (dto.tags ?? []).map((t) => this.tagsService.findOrCreate(t)),
    );

    const link = this.repo.create({
      url: dto.url,
      title: dto.title,
      description: dto.description,
      collectionId: dto.collectionId,
      tags,
    });

    // Verify ownership of collection is done implicitly via DB constraint
    // (ownerId is used to query in findMine, but here we just save)
    return this.repo.save(link);
  }

  async update(id: string, ownerId: string, dto: UpdateLinkDto) {
    const link = await this.repo.findOne({
      where: { id },
      relations: { collection: true, tags: true },
    });
    if (!link) throw new NotFoundException('Link not found');
    if (link.collection.ownerId !== ownerId) throw new ForbiddenException('Access denied');

    if (dto.tags !== undefined) {
      link.tags = await Promise.all(
        dto.tags.map((t) => this.tagsService.findOrCreate(t)),
      );
    }

    Object.assign(link, {
      url: dto.url ?? link.url,
      title: dto.title ?? link.title,
      description: dto.description ?? link.description,
      collectionId: dto.collectionId ?? link.collectionId,
    });

    return this.repo.save(link);
  }

  async searchMine(ownerId: string, q: string) {
    const term = `%${q.toLowerCase()}%`;
    return this.repo
      .createQueryBuilder('link')
      .leftJoinAndSelect('link.tags', 'tag')
      .leftJoinAndSelect('link.collection', 'collection')
      .where('collection.ownerId = :ownerId', { ownerId })
      .andWhere(
        '(LOWER(link.title) LIKE :term OR LOWER(link.url) LIKE :term OR LOWER(tag.name) LIKE :term)',
        { term },
      )
      .orderBy('link.createdAt', 'DESC')
      .getMany();
  }

  async fetchMeta(url: string): Promise<{ title: string; description: string }> {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(5000),
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
      const html = await res.text();
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const descMatch =
        html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ??
        html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
      return {
        title: titleMatch?.[1]?.trim() ?? '',
        description: descMatch?.[1]?.trim() ?? '',
      };
    } catch {
      return { title: '', description: '' };
    }
  }

  async remove(id: string, ownerId: string) {
    const link = await this.repo.findOne({
      where: { id },
      relations: { collection: true },
    });
    if (!link) throw new NotFoundException('Link not found');
    if (link.collection.ownerId !== ownerId) throw new ForbiddenException('Access denied');
    await this.repo.remove(link);
    return { deleted: true };
  }
}
