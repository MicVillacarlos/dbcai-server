import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAdminDto } from '../../dto/createAdmin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/admin')
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return await this.authService.createAdmin(createAdminDto);
  }
}
