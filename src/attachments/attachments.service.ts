import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ClassService } from '../class/class.service';
import { FileService } from '../file/file.service';
import { UsersService } from '../users/users.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { Attachment, AttachmentDocument } from './schemas/attachment.schema';

@Injectable()
export class AttachmentsService {
  @InjectModel(Attachment.name)
  private readonly attachmentModel: Model<Attachment>;
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

    const attachments = await this.attachmentModel
      .find({ class: _class._id })
      .populate({ path: 'attachment', select: 'key url size' })
      .skip(offset)
      .limit(limit)
      .exec();

    if (attachments.length === 0) {
      throw new NotFoundException('cannot find any attachments');
    }
    return attachments;
  }

  public async create(
    courseId: string,
    classNumber: number,
    passportuser,
    file: Express.MulterS3.File,
    createAttachmentDto: CreateAttachmentDto,
  ) {
    const _class = await this.classService.findOne(courseId, classNumber);
    const user = await this.usersService.findById(passportuser.userId);
    const { instructor } = _class;

    if (String(user._id) !== String(instructor.userId)) {
      throw new ForbiddenException('cannot upload attachment');
    }
    if (!file) {
      throw new BadRequestException('cannot find file from request');
    }

    const { week } = createAttachmentDto;
    const attachments = await this.attachmentModel
      .find({ class: _class._id })
      .sort({ number: -1 });
    const number = attachments.length === 0 ? 1 : attachments[0].number + 1;

    const attachment = new this.attachmentModel({
      class: _class.id,
      number,
      ...createAttachmentDto,
    });

    const rootpath = `/uploads/courses/${courseId}/class/${classNumber}/week${week}/attachments`;

    const attachmentFile = await this.fileService.upload(
      file,
      rootpath,
      user._id,
      attachment._id,
    );
    attachment.attachment = attachmentFile._id;
    await attachment.save();
    return attachment;
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

    const attachment = await this.attachmentModel.findOneAndRemove({
      class: _class._id,
      number,
    });
    if (!attachment) {
      throw new BadRequestException('cannot find matched attachment');
    }
    await this.fileService.delete(String(attachment.attachment));
  }

  public filterAttachment(attachment: AttachmentDocument) {
    const obj = attachment.toObject();
    console.log(obj);

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
    const lectures = await this.attachmentModel
      .find({
        class: _class._id,
        week,
      })
      .sort({ week: -1, number: -1 });
    return lectures;
  }
}
