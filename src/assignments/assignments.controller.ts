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
import { JwtAuthGuard } from 'src/auth/guards';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Controller('courses/:courseId/classes/:classNumber/assignment')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  async get(
    @Param('courseId') courseId: string,
    @Param('classNumber') classNumber: number,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return await this.assignmentsService.findAll(
      courseId,
      classNumber,
      paginationQueryDto,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async createAssignment(
    @Param('courseId') courseId: string,
    @Param('classNumber') classNumber: number,
    @Req() req,
    @Body() createAssignmentDto: CreateAssignmentDto,
    @UploadedFile() file: Express.MulterS3.File,
  ) {
    const assignment = await this.assignmentsService.create(
      courseId,
      classNumber,
      req.user,
      createAssignmentDto,
      file,
    );
    return assignment;
  }

  @Delete(':number')
  @UseGuards(JwtAuthGuard)
  async deleteAssignment(
    @Param('courseId') courseId: string,
    @Param('classNumber') classNumber: number,
    @Param('number') number: number,
    @Req() req,
  ) {
    await this.assignmentsService.delete(
      courseId,
      classNumber,
      number,
      req.user,
    );
  }
}
