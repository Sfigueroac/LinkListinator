import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';
import { Link } from './entities/link.entity';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [TypeOrmModule.forFeature([Link]), TagsModule],
  controllers: [LinksController],
  providers: [LinksService],
})
export class LinksModule {}
