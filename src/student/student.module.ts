import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './schemas/student.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Student.name,
        useFactory: () => {
          const schema = StudentSchema;
          return schema;
        },
      },
    ]),
  ],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [MongooseModule, StudentService],
})
export class StudentModule {}
