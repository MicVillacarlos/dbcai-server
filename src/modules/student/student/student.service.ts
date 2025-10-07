import {
  Injectable,
  HttpException,
  HttpStatus,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Student } from '../../../schemas/students.schema';
import { Model } from 'mongoose';
import { CreateStudentDto } from '../../../dto/createStudent.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel('Student')
    private studentModel: Model<Student>,
  ) {}

  async createStudent(data: CreateStudentDto): Promise<Student> {
    try {
      const { first_name, last_name, batch } = data;

      const existingStudent = await this.studentModel.findOne({
        first_name,
        last_name,
        batch,
      });

      if (existingStudent) {
        throw new ConflictException(
          `Student with name "${first_name} ${last_name}" already exists in batch "${batch}". Students with the same name can only be in different batches.`,
        );
      }

      const newStudent = await this.studentModel.create(data);
      return newStudent;
    } catch (error) {
      // Re-throw ConflictException as is
      if (error instanceof ConflictException) {
        throw error;
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error occurred while creating student';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
