import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('links')
export class LinksController {
  constructor(private linksService: LinksService) {}

  @Get()
  findMine(
    @CurrentUser() user: { id: string },
    @Query('collectionId') collectionId?: string,
    @Query('tag') tag?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.linksService.findMine(user.id, {
      collectionId,
      tag,
      page: +page,
      limit: +limit,
    });
  }

  @Public()
  @Get('search')
  search(@Query('tag') tag: string) {
    return this.linksService.search(tag ?? '');
  }

  @Post()
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateLinkDto) {
    return this.linksService.create(user.id, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateLinkDto,
  ) {
    return this.linksService.update(id, user.id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.linksService.remove(id, user.id);
  }
}
