import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsPositive, IsString } from 'class-validator';

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
  @IsString()
  readonly sort: string;
}
