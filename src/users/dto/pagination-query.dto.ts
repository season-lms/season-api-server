import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsPositive, IsString } from 'class-validator';
import { Role } from 'src/auth/enums/role.enum';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  @Transform((limit) => parseInt(limit))
  readonly limit: number;

  @IsOptional()
  @IsPositive()
  @Transform((offset) => parseInt(offset))
  readonly offset: number;

  @IsOptional()
  @IsEnum(Role)
  readonly type: string;
}
