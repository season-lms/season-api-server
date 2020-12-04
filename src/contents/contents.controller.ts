import { Controller, Get, Param, Query } from '@nestjs/common';
import { PaginationQueryDto } from '../lectures/dto/pagination-query.dto';
import { ContentsService } from './contents.service';

@Controller('courses/:courseId/classes/:classNumber/contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Get()
  async get(
    @Param('courseId') courseId: string,
    @Param('classNumber') classNumber: number,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return await this.contentsService.getContents(courseId, classNumber);
  }
}
