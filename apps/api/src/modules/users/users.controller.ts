import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @Get(':username')
  findByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @Patch('me')
  updateMe(
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateMe(user.id, dto);
  }
}
