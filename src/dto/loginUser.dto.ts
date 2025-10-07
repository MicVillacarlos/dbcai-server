import { IsString, IsEmail } from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: 'Please enter a valid email.' })
  readonly email: string;

  @IsString()
  readonly password: string;
}
