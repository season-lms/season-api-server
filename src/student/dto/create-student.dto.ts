import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

class Credits {
  @IsOptional()
  @IsNumber()
  public readonly current: number;

  @IsOptional()
  @IsNumber()
  public readonly completed: number;
}

class Semester {
  @IsOptional()
  @IsNumber()
  public readonly current: number;

  @IsOptional()
  @IsNumber()
  public readonly completed: number;
}

class Affiliation {
  @IsOptional()
  @IsString()
  public readonly organization: string;

  @IsOptional()
  @IsString()
  public readonly college: string;

  @IsOptional()
  @IsString()
  public readonly department: string;

  @IsOptional()
  @IsString()
  public readonly major: string;
}

export class CreateStudentDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  public readonly user: string;

  @IsOptional()
  @Type(() => Credits)
  public readonly credits: Credits;

  @IsOptional()
  @Type(() => Semester)
  public readonly semester: Semester;

  @IsOptional()
  @IsNumber()
  public readonly grade: number;

  @IsOptional()
  @IsNumber()
  public readonly gpa: number;

  @IsOptional()
  @Type(() => Affiliation)
  public readonly affiliation: Affiliation;
}
