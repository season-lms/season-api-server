import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AffiliationProperty } from 'src/shared/types/affiliation.type';

type SemesterProperty = 'current' | 'completed';
type CreditsProperty = 'current' | 'completed';

export type StudentDocument = Student & mongoose.Document;

@Schema({
  toJSON: {
    getters: false,
    virtuals: false,
    versionKey: false,
  },
  toObject: {
    getters: true,
    virtuals: false,
    versionKey: false,
  },
})
export class Student extends mongoose.Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  readonly user: string;

  @Prop(
    raw({
      current: {
        type: Number,
        default: 0,
      },
      completed: {
        type: Number,
        default: 0,
      },
    }),
  )
  readonly credits: Record<CreditsProperty, number>;

  @Prop(
    raw({
      current: {
        type: Number,
        default: 0,
      },
      completed: {
        type: Number,
        default: 0,
      },
    }),
  )
  readonly semester: Record<SemesterProperty, number>;

  @Prop({
    type: Number,
    default: 1,
  })
  readonly grade: number;

  @Prop({
    type: Number,
    default: 0.0,
  })
  readonly gpa: number;

  @Prop(
    raw({
      organization: {
        type: String,
        default: 'unknown',
      },
      college: {
        type: String,
        default: 'unknown',
      },
      department: {
        type: String,
        default: 'unknown',
      },
      major: {
        type: String,
        default: 'unknown',
      },
    }),
  )
  readonly affiliation: Record<AffiliationProperty, string>;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
