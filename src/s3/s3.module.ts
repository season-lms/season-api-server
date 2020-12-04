import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentsModule } from 'src/contents/contents.module';
import { DatabaseModule } from 'src/database/database.module';
import { S3Service } from './s3.service';

@Module({
  imports: [DatabaseModule, MongooseModule],
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module {}
