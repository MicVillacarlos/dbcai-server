import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StudentDocument = HydratedDocument<Student>;

@Schema({ timestamps: true })
export class Student {
  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ required: true })
  section: string;

  @Prop({ required: true })
  batch: string;

  @Prop({ default: false })
  isBatchRep: boolean;

  @Prop({ required: false })
  contact_number?: string;

  @Prop({ required: false })
  occupation?: string;

  @Prop({ default: false })
  isDeceased: boolean;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
