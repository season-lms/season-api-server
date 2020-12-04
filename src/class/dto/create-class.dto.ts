import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsPositive, IsString } from 'class-validator';

class Period {
  @IsDate()
  @IsNotEmpty()
  readonly start: Date;

  @IsDate()
  @IsNotEmpty()
  readonly end: Date;
}

class Affiliation {
  @IsString()
  readonly organization: string;

  @IsString()
  readonly college: string;

  @IsString()
  readonly department: string;

  @IsString()
  readonly major: string;
}
export class CreateClassDto {
  @IsNotEmpty()
  @IsPositive()
  readonly class: number;

  @IsNotEmpty()
  @IsString()
  readonly instructorId: string;

  @IsString()
  readonly schedule: string;

  @IsNotEmpty()
  @Type(() => Period)
  readonly period: Period;

  @IsString()
  readonly room: string;

  @Type(() => Affiliation)
  readonly affiliation: Affiliation;
}
