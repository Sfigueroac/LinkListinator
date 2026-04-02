import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(Tag) private repo: Repository<Tag>) {}

  async findOrCreate(name: string): Promise<Tag> {
    const normalized = name.toLowerCase().trim();
    let tag = await this.repo.findOneBy({ name: normalized });
    if (!tag) {
      tag = await this.repo.save(this.repo.create({ name: normalized }));
    }
    return tag;
  }

  findAll() {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  async findPopular(limit = 20) {
    return this.repo
      .createQueryBuilder('tag')
      .leftJoin('tag.links', 'link')
      .addSelect('COUNT(link.id)', 'count')
      .groupBy('tag.id')
      .orderBy('count', 'DESC')
      .limit(limit)
      .getMany();
  }
}
