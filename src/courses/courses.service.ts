import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './schemas/course.schema';

@Injectable()
export class CoursesService {
  @InjectModel(Course.name) private readonly courseModel: Model<Course>;

  public async create(createCourseDto: CreateCourseDto) {
    const { courseId } = createCourseDto;
    await this.isUniqueCourseId(courseId);
    const course = new this.courseModel(createCourseDto);
    await course.save();
    return course;
  }

  findAll() {
    return `This action returns all courses`;
  }

  public async findOne(courseId: string) {
    const course = await this.courseModel.findOne({ courseId });
    if (!course) {
      throw new NotFoundException('cannot find matched course');
    }
    return course;
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${id} course`;
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }

  private async isUniqueCourseId(courseId: string) {
    const course = await this.courseModel.findOne({ courseId }).exec();
    if (course) {
      throw new BadRequestException('course id is already registered');
    }
  }
}
