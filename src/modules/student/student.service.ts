import {
  Injectable,
  HttpException,
  HttpStatus,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Student } from '../../schemas/students.schema';
import { Model, PipelineStage } from 'mongoose';
import { CreateStudentDto } from '../../dto/createStudent.dto';
import { QueryStudentsDto } from '../../dto/queryStudents.dto';

interface MatchStage {
  batch?: string | { $gte: string; $lte: string };
  $or?: Array<{
    $expr: { $regexMatch: { input: any; regex: string; options: string } };
  }>;
  occupation?: { $regex: string; $options: string };
}

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

  /**
   * @param id
   * @param data
   * @returns
   */
  async updateStudent(
    id: string,
    data: CreateStudentDto,
  ): Promise<{ success: boolean; student: Student }> {
    try {
      const { ...updateFields } = data;

      if (!id) {
        throw new HttpException(
          'Student id is required for update.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const student = await this.studentModel.findByIdAndUpdate(
        id,
        updateFields,
        {
          new: true, // Return the updated document
          runValidators: true, // Run schema validators on update
        },
      );

      if (!student) {
        throw new HttpException(
          `Student with id "${id}" not found.`,
          HttpStatus.NOT_FOUND,
        );
      }

      return { success: true, student };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error occurred while updating student';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getStudents(query: QueryStudentsDto): Promise<{
    students: Student[];
    pagination: {
      page: number;
      limit: number;
      totalCount: number;
      totalPages: number;
    };
  }> {
    try {
      const {
        batch,
        batchRange,
        full_name,
        occupation,
        page = 1,
        limit = 10,
      } = query;

      // Build match stage
      const matchStage: MatchStage = this.buildMatchStage({
        batch,
        batchRange,
        full_name,
        occupation,
      });

      // Build base pipeline
      const basePipeline: PipelineStage[] = [];

      if (Object.keys(matchStage).length > 0) {
        basePipeline.push({ $match: matchStage as PipelineStage });
      }

      // Add full_name field for easier searching/sorting
      basePipeline.push({
        $addFields: {
          full_name: { $concat: ['$first_name', ' ', '$last_name'] },
        },
      });

      // Execute count and data queries in parallel
      const skip = (page - 1) * limit;

      const [countResult, students] = await Promise.all([
        this.studentModel.aggregate([...basePipeline, { $count: 'total' }]),
        this.studentModel.aggregate([
          ...basePipeline,
          { $sort: { createdAt: -1 } }, // Sort before pagination
          { $skip: skip },
          { $limit: limit },
        ]),
      ]);

      const totalCount =
        countResult.length > 0
          ? (countResult[0] as { total: number }).total
          : 0;
      const totalPages = Math.ceil(totalCount / limit);

      return {
        students: students as Student[],
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error occurred while fetching students';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Helper method to build match stage
  private buildMatchStage(filters: {
    batch?: string;
    batchRange?: string;
    full_name?: string;
    occupation?: string;
  }): MatchStage {
    const { batch, batchRange, full_name, occupation } = filters;
    const matchStage: MatchStage = {};

    // Default filter: last 5 years if no batch filters provided
    if (!batch && !batchRange) {
      const currentYear = new Date().getFullYear();
      const fiveYearsAgo = currentYear - 5;
      matchStage.batch = {
        $gte: fiveYearsAgo.toString(),
        $lte: currentYear.toString(),
      };
    }

    // Single batch filter (overrides default)
    if (batch) {
      matchStage.batch = batch;
    }

    // Batch range filter (overrides single batch and default)
    if (batchRange) {
      const [startYear, endYear] = batchRange
        .split('-')
        .map((year) => year.trim());
      if (startYear && endYear) {
        matchStage.batch = {
          $gte: startYear,
          $lte: endYear,
        };
      }
    }

    // Full name search (case-insensitive partial match)
    if (full_name) {
      matchStage.$or = [
        {
          $expr: {
            $regexMatch: {
              input: { $concat: ['$first_name', ' ', '$last_name'] },
              regex: full_name,
              options: 'i',
            },
          },
        },
      ];
    }

    // Occupation search (case-insensitive partial match)
    if (occupation) {
      matchStage.occupation = {
        $regex: occupation,
        $options: 'i',
      };
    }

    return matchStage;
  }
}
