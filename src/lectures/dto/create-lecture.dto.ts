import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLectureDto {
  @IsNotEmpty()
  @Type(() => Number)
  public readonly week;

  @IsNotEmpty()
  @IsString()
  public readonly title;

  @IsOptional()
  @IsString()
  public readonly description;

  @IsOptional()
  @IsString()
  public readonly body;
}

export class CreateLectureFilesDto {
  public readonly video: Express.MulterS3.File[];
  public readonly attachment: Express.MulterS3.File[];
}
