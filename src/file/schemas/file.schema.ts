import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';

export type FileDocument = File & mongoose.Document;

@Schema()
export class File extends mongoose.Document {
  @Prop({
    type: String,
    required: true,
  })
  public readonly key: string;

  @Prop({
    type: String,
    required: true,
  })
  public readonly url: string;

  @Prop({
    type: String,
  })
  public readonly originalname: string;

  @Prop({
    type: String,
  })
  public readonly serverefilename: string;

  @Prop({
    type: Number,
  })
  public readonly size: number;

  @Prop({
    type: mongoose.SchemaTypes.ObjectId,
    ref: User.name,
    required: true,
  })
  public readonly uploader: mongoose.SchemaType;

  @Prop({
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  })
  public relation: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
