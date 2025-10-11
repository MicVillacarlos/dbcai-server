import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  Put,
  Param,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from '../../dto/createStudent.dto';
import { QueryStudentsDto } from '../../dto/queryStudents.dto';
import { JwtAuthGuard } from '../../helpers/auth.guard.helper/auth.guard.helper';
import { UpdateStudentDto } from '../../dto/updateStudent.dto';

@Controller('student')
@UseGuards(JwtAuthGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  async createStudent(@Body() createStudentDto: CreateStudentDto) {
    return await this.studentService.createStudent(createStudentDto);
  }

  @Put('/:id')
  async updateStudent(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return await this.studentService.updateStudent(id, updateStudentDto);
  }

  @Get()
  async getStudents(@Query() query: QueryStudentsDto) {
    return await this.studentService.getStudents(query);
  }
}
