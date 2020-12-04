import { forwardRef, Module } from '@nestjs/common';
import { ContentsService } from './contents.service';
import { ContentsController } from './contents.controller';
import { LecturesModule } from '../lectures/lectures.module';
import { AttachmentsModule } from '../attachments/attachments.module';
import { AssignmentsModule } from 'src/assignments/assignments.module';

@Module({
  imports: [
    forwardRef(() => LecturesModule),
    AttachmentsModule,
    AssignmentsModule,
  ],
  controllers: [ContentsController],
  providers: [ContentsService],
  exports: [ContentsService],
})
export class ContentsModule {}
