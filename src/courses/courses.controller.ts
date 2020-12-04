import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
export class CoursesController {
  public s3Options;
  constructor(private readonly coursesService: CoursesService) {}

  @Get(':courseId')
  async findByCourseId(@Param('courseId') courseId: string) {
    return await this.coursesService.findOne(courseId);
  }

  @Get()
  async findAll() {
    const courses = await this.coursesService.findAll();
    if (!courses) {
      throw new NotFoundException('cannot find any courses');
    }
    return courses;
  }

  @Post()
  async create(@Body() createCourseDto: CreateCourseDto) {
    return await this.coursesService.create(createCourseDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(+id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(+id);
  }
}
