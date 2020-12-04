import * as mongoose from 'mongoose';
import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';

import { collegeArray } from 'src/shared/constants/college.constant';
import { departmentsArray } from 'src/shared/constants/department.constant';
import { majorsArray } from 'src/shared/constants/major.constant';
import { languageArray } from 'src/shared/constants/language.constant';
import { courseArray } from 'src/shared/constants/course-type.constant';
import { organizationArray } from 'src/shared/constants/organization.constant';

type CreditsProperty = 'theory' | 'practice';
type OffersProperty = 'college' | 'department' | 'major';

export type CourseDocument = Course & mongoose.Document;

@Schema({
  _id: true,
  timestamps: true,
  toObject: {
    getters: false,
    virtuals: false,
    versionKey: false,
  },
})
export class Course extends mongoose.Document {
  @Prop({
    type: String,
    unique: true,
    required: true,
  })
  public readonly courseId;

  @Prop({
    type: String,
    required: true,
  })
  public readonly title;

  @Prop({
    type: String,
    required: true,
  })
  public readonly provider;

  @Prop(
    raw({
      college: {
        type: [String],
        enum: collegeArray,
        default: ['unknown'],
      },
      department: {
        type: [String],
        enum: departmentsArray,
        default: ['unknown'],
      },
      major: {
        type: [String],
        enum: majorsArray,
        default: ['unknown'],
      },
    }),
  )
  public readonly offers: Record<OffersProperty, string>;

  @Prop({
    type: String,
    enum: languageArray,
    default: 'kr',
  })
  public readonly language;

  @Prop({
    type: String,
    enum: courseArray,
    default: 'unknown',
  })
  public readonly type;

  @Prop(
    raw({
      theory: {
        type: Number,
        required: true,
      },
      practice: {
        type: Number,
        required: true,
      },
    }),
  )
  public readonly credits: Record<CreditsProperty, number>;

  @Prop({
    type: Number,
    required: true,
  })
  public readonly grade;

  @Prop({
    type: String,
    enum: organizationArray,
    default: 'bachleor',
  })
  public readonly organization;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
