import { Controller, Post, Body } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from '../../../dto/createStudent.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('/')
  async createStudent(@Body() createStudentDto: CreateStudentDto) {
    return await this.studentService.createStudent(createStudentDto);
  }
}
