import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

class Duration {
  @IsNotEmpty()
  @IsDate()
  start: Date;

  @IsNotEmpty()
  @IsDate()
  end: Date;
}

export class CreateAssignmentDto {
  @IsNotEmpty()
  @Type(() => Number)
  public readonly week;

  @IsNotEmpty()
  @IsString()
  public readonly title;

  @IsOptional()
  @IsString()
  public readonly description;

  @IsNotEmpty()
  @Type(() => Duration)
  public readonly duration;
}
