import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { Colleges } from 'src/shared/constants/college.constant';
import { CourseType } from 'src/shared/constants/course-type.constant';
import { Departments } from 'src/shared/constants/department.constant';
import { Majors } from 'src/shared/constants/major.constant';

class Credits {
  @IsNotEmpty()
  @IsPositive()
  readonly theory: number;

  @IsNotEmpty()
  @IsPositive()
  readonly practice: number;
}

class Offers {
  @IsEnum(Colleges, { each: true })
  readonly college: string[];

  @IsEnum(Departments, { each: true })
  readonly department: string[];

  @IsEnum(Majors, { each: true })
  readonly major: string[];
}

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly courseId: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly provider: string;

  @IsNotEmpty()
  @Type(() => Offers)
  readonly offers: Offers;

  @IsString()
  @MaxLength(2)
  readonly language;

  @IsString()
  @IsEnum(CourseType)
  readonly type: string;

  @IsNotEmpty()
  @Type(() => Credits)
  readonly credits: Credits;

  @IsNumber()
  @IsPositive()
  readonly grade: number;
}
