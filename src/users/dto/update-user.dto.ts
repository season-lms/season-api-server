import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Role } from 'src/auth/enums/role.enum';
import { Sex } from '../enum/sex.enum';

class Name {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly first: string;

  @MaxLength(255)
  readonly middle: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly last: string;
}

class Address {
  @IsString()
  @MaxLength(255)
  readonly details: string;

  @MaxLength(50)
  readonly city: string;

  @MaxLength(50)
  readonly state: string;

  @MaxLength(50)
  readonly country: string;

  @MaxLength(10)
  readonly zipcode: string;
}

export class UpdateUserDto {
  @IsNotEmpty()
  @Type(() => Name)
  @ValidateNested()
  readonly name: Name;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  readonly username: string;

  @IsString()
  @MaxLength(20)
  readonly password: string;

  @IsArray()
  @ArrayMaxSize(3)
  @IsEnum(Role, { each: true })
  readonly roles: string[];

  @ArrayMaxSize(3)
  @MinLength(5, { each: true })
  @MaxLength(255, { each: true })
  @IsString({ each: true })
  @IsEmail({ ignore_max_length: false }, { each: true })
  readonly email: string[];

  @ArrayMaxSize(3)
  readonly phone: string[];

  @ValidateNested()
  readonly address: Address;

  @IsString()
  readonly birth: string;

  @IsEnum(Sex)
  readonly sex: string;
}
