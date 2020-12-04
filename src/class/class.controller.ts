import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { PaginationQueryDto } from 'src/class/pagination-query.dto';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';

@Controller('courses/:courseId/classes')
export class ClassController {
  constructor(private classService: ClassService) {}

  @Get()
  async findAllClassesByCourseId(
    @Param('courseId') courseId: string,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    const classes = await this.classService.findAll(
      courseId,
      paginationQueryDto,
    );
    if (!classes) {
      throw new NotFoundException('cannot find any class');
    }
    const result = [];
    classes.forEach((_class) => {
      result.push(this.classService.filterClass(_class));
    });
    return result;
  }

  @Get(':classNumber')
  async findByCourseIdAndClass(
    @Param('courseId') courseId: string,
    @Param('classNumber') classNumber: number,
  ) {
    const _class = await this.classService.findOne(courseId, classNumber);
    return this.classService.filterClass(_class);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createClass(
    @Req() req,
    @Param('courseId') courseId: string,
    @Body() createClassDto: CreateClassDto,
  ) {
    const _class = await this.classService.create(
      req.user,
      courseId,
      createClassDto,
    );
    return this.classService.filterClass(_class);
  }
}
