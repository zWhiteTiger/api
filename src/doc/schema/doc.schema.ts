import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DocDocument = Doc & Document;

@Schema()
export class Doc {
  @Prop()
  doc_name: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })  // Corrected reference type
  user_id: Types.ObjectId;

  @Prop({ default: () => new Date() })
  created_at: Date;

  @Prop({ default: () => new Date() })
  updated_at: Date;

  @Prop({ default: null })
  deleted_at: Date;

  @Prop({default: "draft"})
  isStatus: string;

  @Prop()
  docs_path: string;

  @Prop({default: false})
  public: boolean;

}

export const DocSchema = SchemaFactory.createForClass(Doc);
