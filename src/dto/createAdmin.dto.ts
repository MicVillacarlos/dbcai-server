import { IsString, IsEmail } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  readonly first_name: string;

  @IsString()
  readonly last_name: string;

  @IsEmail({}, { message: 'Please enter a valid email.' })
  readonly email: string;
}
