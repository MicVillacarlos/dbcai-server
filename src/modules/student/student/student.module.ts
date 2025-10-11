import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { StudentSchema } from '../../../schemas/students.schema';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { JwtAuthGuard } from '../../../helpers/auth.guard.helper/auth.guard.helper';
import { projectConfig } from '../../../config/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Student', schema: StudentSchema }]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: projectConfig.jwtSecret,
        signOptions: { expiresIn: projectConfig.jwtExpire },
      }),
    }),
  ],
  controllers: [StudentController],
  providers: [StudentService, JwtAuthGuard],
  exports: [StudentService],
})
export class StudentModule {}
