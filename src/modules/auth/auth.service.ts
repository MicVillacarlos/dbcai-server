import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../schemas/users.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { generateTemporaryPassword } from '../../utils/auth.utils';
import { JwtService } from '@nestjs/jwt';
import { CreateAdminDto } from '../../dto/createAdmin.dto';
import { LoginUserDto } from '../../dto/loginUser.dto';
import { projectConfig } from '../../config/config';
import { UpdatePasswordDto } from '../../dto/updatePassword.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User')
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * @param data
   * @returns
   */
  async createAdmin(
    data: CreateAdminDto,
  ): Promise<{ success: boolean; tempPassword: string }> {
    const { first_name, last_name, email } = data;

    try {
      const user = await this.userModel.findOne({
        email,
      });

      if (user) {
        throw new UnauthorizedException('Email is already been taken.');
      }

      const tempPassword = generateTemporaryPassword();
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      const newUser = await this.userModel.create({
        full_name: `${first_name} ${last_name}`,
        password: hashedPassword,
        email,
      });

      const token = this.jwtService.sign({ _id: newUser._id });

      if (token) {
        return {
          success: true,
          tempPassword,
        };
      } else {
        return { success: false, tempPassword: 'An error has occured.' };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error occurred';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async loginUser(
    data: LoginUserDto,
  ): Promise<{ email: string; token: string }> {
    const { email, password } = data;
    try {
      const user = await this.userModel.findOne({
        email,
      });

      if (!user) {
        throw new UnauthorizedException('Invalid email or password.');
      }
      const isPasswordMatched = await bcrypt.compare(password, user.password);

      if (!isPasswordMatched) {
        throw new UnauthorizedException('Invalid email or password.');
      }

      const token = this.jwtService.sign(
        { _id: user._id },
        { expiresIn: projectConfig.jwtExpire },
      );

      return { email: user.email, token };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error occurred';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateAdminPassword(
    id: string,
    data: UpdatePasswordDto,
  ): Promise<{ success: boolean; message: string }> {
    const { newPassword, confirmPassword, oldPassword } = data;

    try {
      const user = await this.userModel.findById(id);

      if (!user) {
        throw new BadRequestException('User not found.');
      }

      const isOldPasswordMatched = await bcrypt.compare(
        oldPassword,
        user.password,
      );

      if (!isOldPasswordMatched) {
        throw new BadRequestException('Old password is incorrect.');
      }

      if (newPassword !== confirmPassword) {
        throw new BadRequestException(
          'New password and confirm password must match.',
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.userModel.findByIdAndUpdate(id, { password: hashedPassword });

      return { success: true, message: 'Password successfully updated.' };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error occurred';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async validateToken(
    token: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.jwtService.verify(token);
      return { success: true, message: 'Token is valid.' };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error occurred';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
