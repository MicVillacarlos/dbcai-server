import { IsString, IsStrongPassword } from 'class-validator';

export class UpdatePasswordDto {
  @IsStrongPassword()
  readonly newPassword: string;

  @IsStrongPassword()
  readonly confirmPassword: string;

  @IsString()
  readonly oldPassword: string;
}
