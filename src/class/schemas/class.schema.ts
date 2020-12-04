import * as mongoose from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Course } from 'src/courses/schemas/course.schema';
import { AffiliationProperty } from 'src/shared/types/affiliation.type';
import { Student } from 'src/student/schemas/student.schema';
import { Instructor } from 'src/instructor/schemas/instructor.schema';
import { User } from 'src/users/schemas/user.schema';

interface PartialCourse {
  courseId: mongoose.SchemaType;
  title: string;
}

interface PartialInstructor {
  id: mongoose.SchemaType;
  userId: mongoose.SchemaType;
  instructorId: mongoose.SchemaType;
  name: string;
}

interface PartialStudent {
  userId: mongoose.SchemaType;
  studentId: mongoose.SchemaType;
  name: string;
  grade: number;
  affiliation: Record<AffiliationProperty, string>;
}

interface Period {
  strat: Date;
  end: Date;
}

export type ClassDocument = Class & mongoose.Document;

@Schema({
  _id: true,
  timestamps: true,
  toObject: {
    getters: false,
    virtuals: false,
    versionKey: false,
  },
})
export class Class extends mongoose.Document {
  @Prop(
    raw({
      id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Course.name,
        required: true,
      },
      courseId: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
    }),
  )
  public readonly course: PartialCourse;

  @Prop({
    type: Number,
    required: true,
  })
  public readonly class: number;

  @Prop(
    raw({
      id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Instructor.name,
        required: true,
      },
      instructorId: {
        type: String,
        required: true,
      },
      userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: User.name,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    }),
  )
  public readonly instructor: PartialInstructor;

  @Prop({
    type: String,
    default: 'unknown',
  })
  public readonly schedule: string;

  @Prop(
    raw({
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
    }),
  )
  public readonly period: Period;

  @Prop({
    type: String,
    default: 'unknown',
  })
  public readonly room: string;

  @Prop(
    raw({
      userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: User.name,
      },
      studentId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Student.name,
      },
      name: String,
      grade: Number,
      affiliation: {
        organization: {
          type: String,
        },
        college: {
          type: String,
        },
        department: {
          type: String,
        },
        major: {
          type: String,
        },
      },
    }),
  )
  public readonly students: PartialStudent[];
}

export const ClassSchema = SchemaFactory.createForClass(Class);
