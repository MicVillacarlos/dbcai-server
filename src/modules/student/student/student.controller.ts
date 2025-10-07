import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from '../../../dto/createStudent.dto';
import { QueryStudentsDto } from '../../../dto/queryStudents.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('/')
  async createStudent(@Body() createStudentDto: CreateStudentDto) {
    return await this.studentService.createStudent(createStudentDto);
  }

  @Get()
  async getStudents(@Query() query: QueryStudentsDto) {
    return await this.studentService.getStudents(query);
  }
}
