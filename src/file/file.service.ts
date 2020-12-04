import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { S3Service } from 'src/s3/s3.service';
import { File } from './schemas/file.schema';

@Injectable()
export class FileService {
  @InjectModel(File.name) private readonly fileModel: Model<File>;
  @Inject() private readonly s3Service: S3Service;

  async upload(
    file: Express.MulterS3.File,
    path: string,
    uploader: string,
    relation: string,
  ) {
    const uploaded = await this.s3Service.upload(file, path);
    const newFile = new this.fileModel({
      key: uploaded.Key,
      url: uploaded.Location,
      originalname: file.originalname,
      serverfilename: file.filename,
      size: file.size,
      uploader,
      relation,
    });
    await newFile.save();
    return newFile;
  }

  async delete(fileId: string) {
    const file = await this.fileModel.findById(fileId);
    await this.s3Service.delete(file);
    await file.deleteOne();
  }
}
