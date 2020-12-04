import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ClassService } from 'src/class/class.service';
import { FileService } from 'src/file/file.service';
import { UsersService } from 'src/users/users.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { Assignment, AssignmentDocument } from './schemas/assignment.schema';

@Injectable()
export class AssignmentsService {
  @InjectModel(Assignment.name)
  private readonly assignmentModel: Model<Assignment>;

  @Inject() private readonly classService: ClassService;
  @Inject() private readonly usersService: UsersService;
  @Inject() private readonly fileService: FileService;

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

    const assignments = await this.assignmentModel
      .find({ class: _class._id })
      .populate({ path: 'attachment', select: 'key url size' })
      .skip(offset)
      .limit(limit)
      .exec();

    if (assignments.length === 0) {
      throw new NotFoundException('cannot find any attachments');
    }
    return assignments;
  }

  public async create(
    courseId: string,
    classNumber: number,
    passportuser,
    createAssignmentDto: CreateAssignmentDto,
    file?: Express.MulterS3.File,
  ) {
    const _class = await this.classService.findOne(courseId, classNumber);
    const user = await this.usersService.findById(passportuser.userId);
    const { instructor } = _class;

    if (String(user._id) !== String(instructor.userId)) {
      throw new ForbiddenException('cannot upload attachment');
    }

    const { week } = createAssignmentDto;
    const assignments = await this.assignmentModel
      .find({ class: _class._id })
      .sort({ number: -1 });
    const number = assignments.length === 0 ? 1 : assignments[0].number + 1;
    const assignment = new this.assignmentModel({
      class: _class._id,
      number,
      ...createAssignmentDto,
    });

    if (!file) {
      await assignment.save();
      return assignment;
    }
    const rootpath = `/uploads/courses/${courseId}/class/${classNumber}/week${week}/assignments`;
    const assignmentFile = await this.fileService.upload(
      file,
      rootpath,
      user._id,
      assignment._id,
    );
    assignment.attachment = assignmentFile._id;
    await assignment.save();
    return assignment;
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
      throw new ForbiddenException('cannot upload attachment');
    }

    const assignment = await this.assignmentModel.findOneAndRemove({
      class: _class._id,
      number,
    });
    if (!assignment) {
      throw new BadRequestException('cannot find matched attachment');
    }
    if (assignment.attachment) {
      await this.fileService.delete(String(assignment.attachment));
    }
  }

  public filterAssignment(assignment: AssignmentDocument) {
    const obj = assignment.toObject();
    if (obj['_id']) {
      delete obj['_id'];
    }
    if (Types.ObjectId.isValid(obj['class'])) {
      delete obj['class'];
    }
    if (obj['attachment']) {
      delete obj['attachment']['_id'];
    }
    return obj;
  }

  private async findByWeek(
    courseId: string,
    classNumber: number,
    week: number,
  ) {
    const _class = await this.classService.findOne(courseId, classNumber);
    const lectures = await this.assignmentModel
      .find({
        class: _class._id,
        week,
      })
      .sort({ week: -1, number: -1 });
    return lectures;
  }
}
