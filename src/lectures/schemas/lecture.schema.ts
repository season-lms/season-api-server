import * as mongoose from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role, roleArray } from '../../auth/enums/role.enum';
import { Class } from '../../class/schemas/class.schema';
import { File } from '../../file/schemas/file.schema';

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

export type LectureDocument = Lecture & mongoose.Document;

@Schema({
  _id: true,
  timestamps: true,
  toObject: {
    getters: false,
    virtuals: false,
    versionKey: false,
  },
})
export class Lecture extends mongoose.Document {
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
    type: String,
  })
  public readonly body: string;

  @Prop({
    type: mongoose.SchemaTypes.ObjectId,
    ref: File.name,
  })
  public video: mongoose.SchemaType;

  @Prop([
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: File.name,
    },
  ])
  public attachments: mongoose.SchemaType[];

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

export const LectureSchema = SchemaFactory.createForClass(Lecture);
