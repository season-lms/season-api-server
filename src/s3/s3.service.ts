import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';
import { memoryStorage } from 'multer';
import * as MulterS3 from 'multer-s3';
import { File } from 'src/file/schemas/file.schema';

@Injectable()
export class S3Service implements MulterOptionsFactory {
  private s3: AWS.S3;
  private readonly FILE_LIMIT_SIZE = 1024 * 1024 * 1;

  constructor(private readonly configService: ConfigService) {
    AWS.config.update({
      accessKeyId: this.configService.get('aws.s3.key.access'),
      secretAccessKey: this.configService.get('aws.s3.key.secret'),
      region: 'ap-northeast-2',
    });
    this.s3 = new AWS.S3();
  }

  public async upload(file: Express.MulterS3.File, path: string) {
    const { originalname, buffer, mimetype } = file;
    const s3 = new AWS.S3();
    const uploadResult = await s3
      .upload({
        Bucket: `season-api-server-repository`,
        Body: buffer,
        ContentType: mimetype,
        Key: `${path}/${Date.now()}-${originalname}`,
      })
      .promise();
    return uploadResult;
  }

  public async delete(file: File) {
    const s3 = new AWS.S3();
    await s3
      .deleteObject({
        Bucket: `season-api-server-repository`,
        Key: file.key,
      })
      .promise();
  }

  createMulterOptions(): MulterModuleOptions {
    const bucket = `season-api-server-repository`;
    const multerS3Storage = MulterS3({
      s3: this.s3,
      bucket,
      contentType: MulterS3.AUTO_CONTENT_TYPE,
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        cb(null, `${Date.now().toString()}-${file.originalname}`);
      },
    });
    return {
      storage: memoryStorage(),
      limits: {
        fileSize: this.FILE_LIMIT_SIZE,
      },
    };
  }

  private fileFilter(
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      cb(null, true);
    } else {
      console.log(`No! ${JSON.stringify(file)}`);
      cb(new Error('unsupported file'), false);
    }
  }
}
