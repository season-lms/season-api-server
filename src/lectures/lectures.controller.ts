import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards';
import {
  CreateLectureDto,
  CreateLectureFilesDto,
} from './dto/create-lecture.dto';
import { LecturesService } from './lectures.service';

@Controller('courses/:courseId/classes/:classNumber/lectures')
export class LecturesController {
  constructor(private readonly lecturesService: LecturesService) {}

  @Get('cats')
  get(
    @Param('courseId') courseId: string,
    @Param('classNumber') classNumber: string,
  ) {
    return `${courseId} ${classNumber}`;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'video',
        maxCount: 1,
      },
      {
        name: 'attachment',
        maxCount: 5,
      },
    ]),
  )
  async createLecture(
    @Param('courseId') courseId: string,
    @Param('classNumber') classNumber: number,
    @Req() req,
    @Body() createLectureDto: CreateLectureDto,
    @UploadedFiles() files: CreateLectureFilesDto,
  ) {
    return await this.lecturesService.create(
      courseId,
      classNumber,
      req.user,
      files,
      createLectureDto,
    );
  }

  @Delete(':number')
  @UseGuards(JwtAuthGuard)
  async deleteLecture(
    @Param('courseId') courseId: string,
    @Param('classNumber') classNumber: number,
    @Param('number') number: number,
    @Req() req,
  ) {
    await this.lecturesService.delete(courseId, classNumber, number, req.user);
  }
}
