import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findByUsername(username: string) {
    const user = await this.repo.findOne({
      where: { username },
      relations: { collections: true },
    });
    if (!user) throw new NotFoundException('User not found');

    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      collections: user.collections
        .filter((c) => c.isPublic)
        .map((c) => ({
          id: c.id,
          name: c.name,
          description: c.description,
          isPublic: c.isPublic,
          createdAt: c.createdAt,
        })),
    };
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    await this.repo.update(userId, dto);
    return this.repo.findOneBy({ id: userId });
  }
}
