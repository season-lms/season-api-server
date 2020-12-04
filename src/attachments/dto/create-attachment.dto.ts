import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAttachmentDto {
  @IsNotEmpty()
  @Type(() => Number)
  public readonly week;

  @IsNotEmpty()
  @IsString()
  public readonly title;

  @IsOptional()
  @IsString()
  public readonly description;
}
