import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DocDocument = Doc & Document;

@Schema()
export class Doc {
  @Prop()
  doc_name: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  firstName: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  lastName: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  email: Types.ObjectId;

  @Prop({ default: () => new Date() })
  created_at: Date;

  @Prop({ default: () => new Date() })
  updated_at: Date;

  @Prop({ default: null })
  deleted_at: Date;

  @Prop({ default: "draft" })
  isStatus: string;

  @Prop({ default: "pending" })
  isProgress: string;

  @Prop({ default: 0 })
  currentPriority: number

  @Prop()
  docs_path: string;

  @Prop({ default: false })
  public: boolean;

  // No need to explicitly define _id, it's included in Document
  _id?: Types.ObjectId;
}

export const DocSchema = SchemaFactory.createForClass(Doc);
