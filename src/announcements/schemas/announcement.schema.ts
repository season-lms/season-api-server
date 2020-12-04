import * as mongoose from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Class } from 'src/class/schemas/class.schema';

interface Issuer {
  id: mongoose.SchemaType;
  name: string;
}

export type AnnouncementDocument = Announcement & mongoose.Document;

@Schema({
  _id: true,
  timestamps: true,
  toObject: {
    getters: false,
    virtuals: false,
    versionKey: false,
  },
})
export class Announcement extends mongoose.Document {
  @Prop({
    type: mongoose.SchemaTypes.ObjectId,
    ref: Class.name,
    required: true,
  })
  public readonly class: mongoose.SchemaType;

  @Prop({
    type: Number,
    unique: true,
    required: true,
  })
  public readonly number;

  @Prop({
    type: String,
    required: true,
  })
  public readonly title: string;

  @Prop({
    type: String,
    required: true,
  })
  public readonly body: string;

  @Prop(
    raw({
      id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Class.name,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    }),
  )
  public readonly issuer: Issuer;
}

export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);
