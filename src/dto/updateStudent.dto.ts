import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateStudentDto {
  @IsString()
  readonly first_name: string;

  @IsString()
  readonly last_name: string;

  @IsString()
  readonly section: string;

  @IsString()
  readonly batch: string;

  @IsOptional()
  @IsBoolean()
  readonly isBatchRep?: boolean;

  @IsOptional()
  @IsString()
  readonly contact_number?: string;

  @IsOptional()
  @IsString()
  readonly occupation?: string;

  @IsOptional()
  @IsBoolean()
  readonly isDeceased?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly isDbcaiCareerMember?: boolean;
}
