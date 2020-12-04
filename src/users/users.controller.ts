import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  NotFoundException,
  HttpCode,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { JwtAuthGuard } from 'src/auth/guards';

// @UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return user;
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    const users = this.usersService.findAll(paginationQuery);
    if (!users) {
      throw new NotFoundException('user does not exist');
    }
    return users;
  }

  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    const user = await this.usersService.findByUserId(userId);
    return user;
  }

  @Put(':userId')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('userId') userId: string,
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(req, userId, updateUserDto);
  }

  @HttpCode(204)
  @Delete(':userId')
  remove(@Param('userId') userId: string) {
    return this.usersService.remove(userId);
  }
}
