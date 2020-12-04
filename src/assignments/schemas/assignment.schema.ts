import * as mongoose from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role, roleArray } from 'src/auth/enums/role.enum';
import { File } from 'src/file/schemas/file.schema';
import { Class } from 'src/class/schemas/class.schema';
import { User } from 'src/users/schemas/user.schema';

interface Duration {
  status: string;
  start: Date;
  end: Date;
}

interface Comment {
  user: {
    id: string;
    name: string;
    role: Role;
  };
  body: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AssignmentDocument = Assignment & mongoose.Document;

@Schema({
  _id: true,
  timestamps: true,
  toObject: {
    getters: false,
    virtuals: false,
    versionKey: false,
  },
})
export class Assignment extends mongoose.Document {
  @Prop({
    type: Number,
    required: true,
  })
  public readonly week: number;

  @Prop({
    type: Number,
    required: true,
  })
  public readonly number: number;

  @Prop({
    type: mongoose.SchemaTypes.ObjectId,
    ref: Class.name,
    required: true,
  })
  public readonly class: mongoose.SchemaType;

  @Prop({
    type: String,
    required: true,
  })
  public readonly title: string;

  @Prop({
    type: String,
  })
  public readonly description: string;

  @Prop({
    type: mongoose.SchemaTypes.ObjectId,
    ref: File.name,
  })
  public attachment: mongoose.SchemaType;

  @Prop({
    type: mongoose.SchemaTypes.ObjectId,
    // ref: CalendarItem.name,
  })
  public calendarItem: string;

  @Prop({
    type: String,
    default: 'progress',
  })
  public status: string;

  @Prop(
    raw({
      start: {
        type: Date,
        default: Date.now(),
      },
      end: {
        type: Date,
        required: true,
      },
    }),
  )
  public duration: Duration;

  @Prop({
    type: Number,
    default: -1,
  })
  public average: number;

  @Prop({
    type: mongoose.SchemaTypes.ObjectId,
    ref: User.name,
  })
  public submitter: string[];

  @Prop(
    raw([
      {
        user: {
          userid: {
            type: String,
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          role: {
            type: String,
            enum: roleArray,
            required: true,
          },
        },
        body: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now(),
        },
        updatedAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ]),
  )
  public readonly comments: Comment[];
}

export const AssignmentSchema = SchemaFactory.createForClass(Assignment);
