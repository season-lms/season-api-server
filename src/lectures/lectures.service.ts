import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CreateLectureDto,
  CreateLectureFilesDto,
} from './dto/create-lecture.dto';
import { Lecture, LectureDocument } from './schemas/lecture.schema';
import { ClassService } from '../class/class.service';
import { UsersService } from '../users/users.service';
import { FileService } from '../file/file.service';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Injectable()
export class LecturesService {
  @InjectModel(Lecture.name) private readonly lectureModel: Model<Lecture>;
  @Inject() private readonly classService: ClassService;
  @Inject() private readonly usersService: UsersService;
  @Inject() private readonly fileService: FileService;

  public async create(
    courseId: string,
    classNumber: number,
    passportuser,
    files: CreateLectureFilesDto,
    createLectureDto: CreateLectureDto,
  ) {
    const _class = await this.classService.findOne(courseId, classNumber);

    const user = await this.usersService.findById(passportuser.userId);
    const { instructor } = _class;
    if (String(user._id) !== String(instructor.userId)) {
      throw new ForbiddenException('cannot upload attachment');
    }

    const lectures = await this.lectureModel
      .find({
        courseId,
        classNumber,
      })
      .sort({ number: -1 })
      .exec();

    const number = lectures.length === 0 ? 1 : lectures[0].number + 1;
    const lecture = new this.lectureModel({
      class: _class._id,
      number,
      ...createLectureDto,
    });

    const { week } = createLectureDto;
    const rootpath = `/uploads/courses/${courseId}/class/${classNumber}/week${week}/lecture${number}`;

    const inputVideoFile = files['video'][0];
    if (!inputVideoFile) {
      throw new BadRequestException('cannot find video from request');
    }
    const video = await this.fileService.upload(
      inputVideoFile,
      rootpath,
      passportuser.userId,
      lecture._id,
    );
    lecture.video = video._id;

    const inputAttachs = files['attachment'];
    if (inputAttachs) {
      for await (const inputAttach of inputAttachs) {
        const attach = await this.fileService.upload(
          inputAttach,
          rootpath,
          lecture._id,
          passportuser.userId,
        );
        lecture.attachments.push(attach._id);
      }
    }

    await lecture.save();
    return lecture;
  }

  public async findAll(
    courseId: string,
    classNumber: number,
    paginationQueryDto?: PaginationQueryDto,
  ) {
    const _class = await this.classService.findOne(courseId, classNumber);
    if (!_class) {
      throw new NotFoundException('cannot find matched class');
    }

    let limit, offset;
    if (paginationQueryDto) {
      limit = paginationQueryDto.limit;
      offset = paginationQueryDto.offset;
    }
    const lectures = await this.lectureModel
      .find({ class: _class._id })
      .populate({ path: 'video', select: 'key url size' })
      .populate({ path: 'attachments', select: 'key url size' })
      .skip(offset)
      .limit(limit)
      .exec();

    if (lectures.length === 0) {
      throw new NotFoundException('cannot find any lectures');
    }
    return lectures;
  }

  public filterLecture(lecture: LectureDocument) {
    const obj = lecture.toObject();

    if (obj['_id']) {
      delete obj['_id'];
    }
    if (Types.ObjectId.isValid(obj['class'])) {
      delete obj['class'];
    }
    if (obj['attachment']) {
      delete obj['attachment']['_id'];
    }
    delete obj['video']['_id'];
    return obj;
  }

  public async delete(
    courseId: string,
    classNumber: number,
    number: number,
    passportuser,
  ) {
    const _class = await this.classService.findOne(courseId, classNumber);
    const user = await this.usersService.findById(passportuser.userId);
    const { instructor } = _class;

    if (String(user._id) !== String(instructor.userId)) {
      throw new ForbiddenException('cannot delete attachment');
    }

    const lecture = await this.lectureModel.findOneAndRemove({
      class: _class._id,
      number,
    });
    if (!lecture) {
      throw new BadRequestException('cannot find matched lecture');
    }
    await this.fileService.delete(String(lecture.video));
    if (lecture.attachments) {
      for await (const attach of lecture.attachments) {
        await this.fileService.delete(String(attach));
      }
    }
  }

  private async findByWeek(
    courseId: string,
    classNumber: number,
    week: number,
  ) {
    const _class = await this.classService.findOne(courseId, classNumber);
    const lectures = await this.lectureModel
      .find({
        class: _class._id,
        week,
      })
      .sort({ week: -1, number: -1 });
    return lectures;
  }
}
