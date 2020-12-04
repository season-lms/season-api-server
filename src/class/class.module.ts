import { forwardRef, Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { CoursesService } from 'src/courses/courses.service';
import { UsersService } from 'src/users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Class, ClassSchema } from './schemas/class.schema';
import { Course } from 'src/courses/schemas/course.schema';
import { CoursesModule } from 'src/courses/courses.module';
import { UsersModule } from 'src/users/users.module';
import { ClassController } from './class.controller';

@Module({
  imports: [
    forwardRef(() => CoursesModule),
    UsersModule,
    MongooseModule.forFeatureAsync([
      {
        name: Class.name,
        useFactory: () => {
          const schema = ClassSchema;
          return schema;
        },
      },
    ]),
  ],
  providers: [ClassService],
  exports: [ClassService, MongooseModule],
  controllers: [ClassController],
})
export class ClassModule {}
