import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards';
import { AttachmentsService } from './attachments.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Controller('courses/:courseId/classes/:classNumber/attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Get()
  async get(
    @Param('courseId') courseId: string,
    @Param('classNumber') classNumber: number,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return await this.attachmentsService.findAll(
      courseId,
      classNumber,
      paginationQueryDto,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async createLecture(
    @Param('courseId') courseId: string,
    @Param('classNumber') classNumber: number,
    @Req() req,
    @Body() createAttachmentDto: CreateAttachmentDto,
    @UploadedFile() file: Express.MulterS3.File,
  ) {
    return await this.attachmentsService.create(
      courseId,
      classNumber,
      req.user,
      file,
      createAttachmentDto,
    );
  }

  @Delete(':number')
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param('courseId') courseId: string,
    @Param('classNumber') classNumber: number,
    @Param('number') number: number,
    @Req() req,
  ) {
    await this.attachmentsService.delete(
      courseId,
      classNumber,
      number,
      req.user,
    );
  }
}
