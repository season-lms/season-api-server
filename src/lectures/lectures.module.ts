import { forwardRef, Module } from '@nestjs/common';
import { LecturesService } from './lectures.service';
import { LecturesController } from './lectures.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Lecture, LectureSchema } from './schemas/lecture.schema';
import { ContentsModule } from 'src/contents/contents.module';
import { ClassModule } from 'src/class/class.module';
import { UsersModule } from 'src/users/users.module';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [
    forwardRef(() => ContentsModule),
    ClassModule,
    UsersModule,
    forwardRef(() => FileModule),
    MongooseModule.forFeature([
      {
        name: Lecture.name,
        schema: LectureSchema,
      },
    ]),
  ],
  controllers: [LecturesController],
  providers: [LecturesService],
  exports: [LecturesService],
})
export class LecturesModule {}
