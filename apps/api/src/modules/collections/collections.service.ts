import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection } from './entities/collection.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Injectable()
export class CollectionsService {
  constructor(@InjectRepository(Collection) private repo: Repository<Collection>) {}

  findMine(ownerId: string) {
    return this.repo.find({ where: { ownerId }, order: { createdAt: 'DESC' } });
  }

  findPublic(page = 1, limit = 20) {
    return this.repo.find({
      where: { isPublic: true },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
      relations: { owner: true },
    });
  }

  async findOne(id: string, requesterId?: string) {
    const collection = await this.repo.findOne({
      where: { id },
      relations: { links: { tags: true }, owner: true },
    });
    if (!collection) throw new NotFoundException('Collection not found');
    if (!collection.isPublic && collection.ownerId !== requesterId) {
      throw new ForbiddenException('Access denied');
    }
    return collection;
  }

  create(ownerId: string, dto: CreateCollectionDto) {
    const collection = this.repo.create({ ...dto, ownerId });
    return this.repo.save(collection);
  }

  async update(id: string, ownerId: string, dto: UpdateCollectionDto) {
    const collection = await this.repo.findOneBy({ id });
    if (!collection) throw new NotFoundException('Collection not found');
    if (collection.ownerId !== ownerId) throw new ForbiddenException('Access denied');
    await this.repo.update(id, dto);
    return this.repo.findOneBy({ id });
  }

  async remove(id: string, ownerId: string) {
    const collection = await this.repo.findOneBy({ id });
    if (!collection) throw new NotFoundException('Collection not found');
    if (collection.ownerId !== ownerId) throw new ForbiddenException('Access denied');
    await this.repo.remove(collection);
    return { deleted: true };
  }
}
