import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @Length(5, 10)
  readonly userId: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
