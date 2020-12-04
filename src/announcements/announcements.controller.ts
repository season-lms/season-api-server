import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Controller('courses/:courseId/classes/:classNumber/announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Get(':number')
  async getAnnouncement(
    @Param('courseId') courseId: string,
    @Param('classNumber') classNumber: number,
    @Param('number') number: number,
  ) {
    return await this.announcementsService.findOne(
      courseId,
      classNumber,
      number,
    );
  }

  @Get()
  async getAnnouncements(
    @Param('courseId') courseId: string,
    @Param('classNumber') classNumber: number,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return await this.announcementsService.findAll(
      courseId,
      classNumber,
      paginationQueryDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createAnnouncement(
    @Param('courseId') courseId: string,
    @Param('classNumber') classNumber: number,
    @Req() req,
    @Body() createAnnouncementDto: CreateAnnouncementDto,
  ) {
    const { user } = req;
    return await this.announcementsService.create(
      courseId,
      classNumber,
      user,
      createAnnouncementDto,
    );
  }

  @Put(':number')
  @UseGuards(JwtAuthGuard)
  async updateAnnouncement(
    @Param('courseId') courseId: string,
    @Param('classNumber') classNumber: number,
    @Param('number') number: number,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
    @Req() req,
  ) {
    const { user } = req;
    return await this.announcementsService.updateAnnouncement(
      courseId,
      classNumber,
      number,
      user,
      updateAnnouncementDto,
    );
  }

  @Delete(':number')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async deleteAnnouncement(
    @Param('courseId') courseId: string,
    @Param('classNumber') classNumber: number,
    @Param('number') number: number,
    @Req() req,
  ) {
    const { user } = req;
    return await this.announcementsService.deleteAnnouncement(
      courseId,
      classNumber,
      number,
      user,
    );
  }
}
