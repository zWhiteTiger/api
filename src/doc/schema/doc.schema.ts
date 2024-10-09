import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DocDocument = Doc & Document;

export enum StatusType {
  DRAFT = 'draft',
  UNREAD = 'unread',
  READ = 'read',
  EXPRESS = 'express',
  REJECT = 'reject',
}

@Schema()
export class Doc {
  @Prop()
  doc_name: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user_id: Types.ObjectId;

  @Prop({ default: () => new Date() })
  created_at: Date;

  @Prop({ default: () => new Date() })
  updated_at: Date;

  @Prop({ default: null })
  deleted_at: Date;

  @Prop([{
    userId: { type: Number, required: true },
    isStatus: { type: Number, required: true },
    default: { type: String, enum: Object.values(StatusType), default: StatusType.DRAFT } // Correct enum and default handling
  }])
  status: { userId: number, isStatus: number, default: StatusType }[];

  @Prop()
  docs_path: string;

  @Prop({ default: false })
  public: boolean;

  // No need to explicitly define _id, it's included in Document
  _id?: Types.ObjectId;
}

export const DocSchema = SchemaFactory.createForClass(Doc);
