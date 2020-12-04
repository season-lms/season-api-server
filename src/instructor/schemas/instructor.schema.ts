import * as mongoose from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AffiliationProperty } from 'src/shared/types/affiliation.type';

interface Labs {
  location: string;
  contact: string;
}

export type InstructorDocument = Instructor & mongoose.Document;

@Schema()
export class Instructor extends mongoose.Document {
  @Prop({
    type: String,
    default: 'unknown',
  })
  readonly major: string;

  @Prop(
    raw({
      location: {
        type: String,
        default: 'unknown',
      },
      contact: {
        type: String,
        default: 'unknown',
      },
    }),
  )
  readonly labs: Labs;

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

export const InstructorSchema = SchemaFactory.createForClass(Instructor);
