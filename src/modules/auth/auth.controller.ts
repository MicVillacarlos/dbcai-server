import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAdminDto } from '../../dto/createAdmin.dto';
import { LoginUserDto } from '../../dto/loginUser.dto';
import { JwtAuthGuard } from '../../helpers/auth.guard.helper/auth.guard.helper';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.loginUser(loginUserDto);
  }

  @Post('/admin')
  @UseGuards(JwtAuthGuard)
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return await this.authService.createAdmin(createAdminDto);
  }
}
