import { forwardRef, Module } from '@nestjs/common';
import { FileService } from './file.service';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './schemas/file.schema';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [
    forwardRef(() => S3Module),
    MongooseModule.forFeature([
      {
        name: File.name,
        schema: FileSchema,
      },
    ]),
  ],
  providers: [FileService],
  exports: [FileService, MongooseModule],
})
export class FileModule {}
