import { Module } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { InstructorController } from './instructor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Instructor, InstructorSchema } from './schemas/instructor.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Instructor.name,
        useFactory: () => {
          const schema = InstructorSchema;
          return schema;
        },
      },
    ]),
  ],
  controllers: [InstructorController],
  providers: [InstructorService],
  exports: [MongooseModule, InstructorService],
})
export class InstructorModule {}
