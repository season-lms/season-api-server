import * as mongoose from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Student } from 'src/student/schemas/student.schema';
import { Instructor } from 'src/instructor/schemas/instructor.schema';

type NameProperty = 'first' | 'middle' | 'last';
type AddressProperty = 'details' | 'city' | 'state' | 'country' | 'zipcode';
type Socials = 'google';
interface Token {
  id: string;
  accessToken: string;
}

export type UserDocument = User & mongoose.Document;

@Schema({
  _id: true,
  timestamps: true,
  toObject: {
    getters: false,
    virtuals: false,
    versionKey: false,
  },
})
export class User extends mongoose.Document {
  @Prop({
    type: String,
    unique: true,
    required: true,
  })
  public readonly userId: string;

  @Prop(
    raw({
      first: {
        type: String,
        required: true,
      },
      middle: {
        type: String,
      },
      last: {
        type: String,
        required: true,
      },
    }),
  )
  name: Record<NameProperty, string>;

  @Prop({
    type: String,
    required: true,
    trim: true,
    default: function () {
      const _t = this as any;
      return _t.userId;
    },
  })
  password: string;

  @Prop([
    {
      type: String,
      enum: ['admin', 'student', 'instructor'],
      required: true,
    },
  ])
  roles: string[];

  @Prop({
    type: mongoose.SchemaTypes.ObjectId,
    ref: Student.name,
  })
  student: string;

  @Prop({
    type: mongoose.SchemaTypes.ObjectId,
    ref: Instructor.name,
  })
  instructor: string;

  @Prop([
    {
      type: String,
      enum: ['active', 'suspend', 'deleted'],
      default: 'active',
      required: true,
    },
  ])
  status: string[];

  @Prop([
    {
      type: String,
    },
  ])
  email: string[];

  @Prop([
    {
      type: String,
    },
  ])
  phone: string[];

  @Prop(
    raw({
      details: String,
      city: String,
      state: String,
      country: String,
      zipcode: String,
    }),
  )
  address: Record<AddressProperty, string>;

  @Prop()
  birth: string;

  @Prop()
  sex: string;

  @Prop(
    raw({
      google: {
        id: String,
        accessToken: String,
      },
    }),
  )
  social: Record<Socials, Token>;
}

export const UserSchema = SchemaFactory.createForClass(User);
