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
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('collections')
export class CollectionsController {
  constructor(private collectionsService: CollectionsService) {}

  @Get()
  findMine(@CurrentUser() user: { id: string }) {
    return this.collectionsService.findMine(user.id);
  }

  @Public()
  @Get('public')
  findPublic(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.collectionsService.findPublic(+page, +limit);
  }

  @Public()
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user?: { id: string },
  ) {
    return this.collectionsService.findOne(id, user?.id);
  }

  @Post()
  create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateCollectionDto,
  ) {
    return this.collectionsService.create(user.id, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateCollectionDto,
  ) {
    return this.collectionsService.update(id, user.id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.collectionsService.remove(id, user.id);
  }
}
