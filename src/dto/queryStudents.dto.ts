import { IsOptional, IsString, IsNumberString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class QueryStudentsDto {
  @IsOptional()
  @IsString()
  readonly batch?: string;

  @IsOptional()
  @IsString()
  readonly batchRange?: string; // Format: "1989-2000"

  @IsOptional()
  @IsString()
  readonly full_name?: string;

  @IsOptional()
  @IsString()
  readonly occupation?: string;

  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value as string, 10))
  @IsNumberString()
  readonly page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value as string, 10))
  @IsNumberString()
  readonly limit?: number = 10;
}
