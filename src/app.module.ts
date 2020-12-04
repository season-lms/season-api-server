import { forwardRef, Module } from '@nestjs/common';
import { AppLogger } from './logger/app-logger.provider';
import { LoggerModule } from './logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import httpConfig from './config/http.config';
import databaseConfig from './config/database.config';
import swaggerConfig from './config/swagger.config';
import { CaslModule } from './casl/casl.module';
import { CatsModule } from './cats/cats.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesModule } from './courses/courses.module';
import { StudentModule } from './student/student.module';
import { ClassModule } from './class/class.module';
import { InstructorModule } from './instructor/instructor.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { ContentsModule } from './contents/contents.module';
import { LecturesModule } from './lectures/lectures.module';
import { S3Module } from './s3/s3.module';
import awsConfig from './config/aws.config';
import { FileModule } from './file/file.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { AssignmentsModule } from './assignments/assignments.module';

@Module({
  imports: [
    AppLogger,
    LoggerModule,
    ConfigModule.forRoot({
      envFilePath: ['.dev.env', '.prod.env', '.test.env'],
      cache: true,
      isGlobal: true,
      load: [httpConfig, databaseConfig, swaggerConfig, awsConfig],
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      user: process.env.MONGODB_USER,
      pass: process.env.MONGODB_PASS,
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }),
    forwardRef(() => FileModule),
    AuthModule,
    CaslModule,
    CatsModule,
    UsersModule,
    AuthModule,
    CoursesModule,
    StudentModule,
    ClassModule,
    InstructorModule,
    AnnouncementsModule,
    forwardRef(() => ContentsModule),
    LecturesModule,
    S3Module,
    AttachmentsModule,
    AssignmentsModule,
  ],
})
export class AppModule {
  private logger = new AppLogger(AppModule.name);

  constructor() {
    this.logger.log('Initialize AppModule constructor');
  }
}
