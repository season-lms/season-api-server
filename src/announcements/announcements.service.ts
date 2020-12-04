import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClassService } from 'src/class/class.service';
import { PaginationQueryDto } from 'src/class/pagination-query.dto';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import {
  Announcement,
  AnnouncementDocument,
} from './schemas/announcement.schema';

@Injectable()
export class AnnouncementsService {
  @InjectModel(Announcement.name)
  private readonly announcementModel: Model<Announcement>;
  @Inject() private readonly classService: ClassService;

  public async findAll(
    courseId: string,
    _class: number,
    paginationQueryDto: PaginationQueryDto,
  ) {
    const foundClass = await this.classService.findOne(courseId, _class);
    if (!foundClass) {
      throw new NotFoundException('cannot find matched class');
    }

    const { limit, offset } = paginationQueryDto;
    const announcements = await this.announcementModel
      .find({
        class: foundClass._id,
      })
      .skip(offset)
      .limit(limit)
      .sort({ number: -1 });

    const result = [];
    announcements.forEach((announcement) => {
      result.push(this.filterAnnouncement(announcement));
    });
    return result;
  }

  public async findOne(courseId: string, _class: number, number: number) {
    const foundClass = await this.classService.findOne(courseId, _class);
    if (!foundClass) {
      throw new NotFoundException('cannot find matched class');
    }
    const announcement = await this.announcementModel
      .findOne({
        class: foundClass._id,
        number,
      })
      .sort({ number: -1 });
    if (!announcement) {
      throw new NotFoundException('cannot find matched announcement');
    }
    return this.filterAnnouncement(announcement);
  }

  public async create(
    courseId: string,
    classNumber: number,
    user: any,
    createAnnouncementDto: CreateAnnouncementDto,
  ) {
    const _class = await this.classService.findOne(courseId, classNumber);
    if (!_class) {
      throw new NotFoundException('cannot find matched class');
    }
    const { instructor } = _class;

    if (String(instructor.userId) !== user.userId) {
      throw new ForbiddenException('cannot register announcement');
    }

    const mockQueryDto = {
      limit: undefined,
      offset: undefined,
      sort: 'number',
    };
    const announcements = await this.findAll(
      courseId,
      classNumber,
      mockQueryDto,
    );
    const number = announcements.length === 0 ? 1 : announcements[0].number + 1;
    const announcement = new this.announcementModel({
      class: _class._id,
      number,
      ...createAnnouncementDto,
      issuer: {
        id: instructor.id,
        name: instructor.name,
      },
    });
    await announcement.save();
    return this.filterAnnouncement(announcement);
  }

  public async updateAnnouncement(
    courseId: string,
    _class: number,
    number,
    user,
    updateAnnouncementDto: UpdateAnnouncementDto,
  ) {
    const foundClass = await this.classService.findOne(courseId, _class);
    if (!foundClass) {
      throw new NotFoundException('cannot find matched class');
    }
    const { instructor } = foundClass;
    if (String(instructor.userId) !== user.userId) {
      throw new ForbiddenException('cannot register announcement');
    }
    const announcement = await this.announcementModel.findOneAndUpdate(
      {
        class: foundClass._id,
        number,
      },
      updateAnnouncementDto,
      {
        new: true,
      },
    );
    if (!announcement) {
      throw new NotFoundException('cannot find matched announcement');
    }
    return this.filterAnnouncement(announcement);
  }

  public async deleteAnnouncement(
    courseId: string,
    _class: number,
    number: number,
    user,
  ) {
    const foundClass = await this.classService.findOne(courseId, _class);
    if (!foundClass) {
      throw new NotFoundException('cannot find matched class');
    }
    const { instructor } = foundClass;
    if (String(instructor.userId) !== user.userId) {
      throw new ForbiddenException('cannot delete announcement');
    }
    const announcement = await this.announcementModel.findOneAndRemove({
      class: foundClass._id,
      number,
    });
    if (!announcement) {
      throw new NotFoundException('cannot find matched announcement');
    }
    return this.filterAnnouncement(announcement);
  }

  private filterAnnouncement(announcement: AnnouncementDocument) {
    const obj = announcement.toObject();
    delete obj.class;
    delete obj['_id'];
    obj.issuer = obj.issuer.name;
    return obj;
  }
}
