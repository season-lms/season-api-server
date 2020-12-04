import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CoursesService } from 'src/courses/courses.service';
import { PaginationQueryDto } from 'src/class/pagination-query.dto';
import { UsersService } from 'src/users/users.service';
import { CreateClassDto } from 'src/class/dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Class, ClassDocument } from './schemas/class.schema';

@Injectable()
export class ClassService {
  @InjectModel(Class.name) private readonly classModel: Model<Class>;
  @Inject() private readonly courseService: CoursesService;
  @Inject() private readonly userService: UsersService;
  public async create(user, courseId: string, createClassDto: CreateClassDto) {
    const { instructorId } = createClassDto;
    await this.isUniqueClass({
      courseId,
      class: createClassDto.class,
    });
    const course = await this.courseService.findOne(courseId);
    const instructor = await this.userService.findOneByCondition({
      userId: instructorId,
    });

    if (!user.roles.includes('admin')) {
      throw new ForbiddenException('cannot register course');
    }
    console.log(instructor);

    const newClass = new this.classModel({
      course: {
        id: course._id,
        courseId,
        title: course.title,
      },
      class: createClassDto.class,
      instructor: {
        id: instructor.instructor,
        instructorId,
        userId: instructor._id,
        name: `${instructor.name.first} ${instructor.name.last}`,
      },
      schedule: createClassDto.schedule,
      period: createClassDto.period,
      room: createClassDto.room,
    });
    await newClass.save();
    return newClass;
  }

  public async findAll(courseId: string, paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;

    const classes = await this.classModel
      .find({ 'course.courseId': courseId })
      .skip(offset)
      .limit(limit)
      .sort({ 'course.courseId': 1 })
      .exec();
    return classes;
  }

  public async findByCourseId(courseId: string) {
    const classes = await this.classModel
      .find({
        'course.courseId': courseId,
      })
      .exec();
    return classes;
  }

  public async findOne(courseId: string, classNumber: number) {
    const _class = await this.classModel
      .findOne({
        'course.courseId': courseId,
        class: classNumber,
      })
      .exec();
    if (!_class) {
      throw new NotFoundException('cannot find matched class');
    }
    return _class;
  }

  update(id: number, updateClassDto: UpdateClassDto) {
    return `This action updates a #${id} class`;
  }

  remove(id: number) {
    return `This action removes a #${id} class`;
  }

  public filterClass(_class: ClassDocument) {
    const obj = _class.toObject();
    delete obj['_id'];
    delete obj['__v'];
    delete obj.course.courseId;
    delete obj.instructor.id;
    delete obj.instructor.userId;
    return obj;
  }

  private async isUniqueClass(conditions) {
    const matched = await this.classModel.findOne({
      'course.courseId': conditions.courseId,
      class: conditions.class,
    });
    if (matched) {
      throw new ConflictException('same class already exists');
    }
  }
}
