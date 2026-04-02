import { Controller, Get } from '@nestjs/common';
import { TagsService } from './tags.service';
import { Public } from '../../common/decorators/public.decorator';

@Public()
@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Get()
  findAll() {
    return this.tagsService.findAll();
  }

  @Get('popular')
  findPopular() {
    return this.tagsService.findPopular();
  }
}
