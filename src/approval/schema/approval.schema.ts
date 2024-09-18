import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: 'create_at', updatedAt: 'update_at' } })
export class Approval extends Document {

  @Prop({ type: Types.ObjectId, ref: 'Doc', required: true })
  doc_id: Types.ObjectId;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String }) // This can be a URL or base64 string
  signature: string;

  @Prop([Number])  // Coordinates for the signature
  position: number[];

  @Prop()  // Page number where the approval is made
  page: number;

  @Prop({ type: Date, default: null })
  delete_at: Date;

  @Prop({ type: Date, default: null })
  create_at: Date;

  @Prop({ type: Date, default: null })
  update_at: Date;
}

export const ApprovalSchema = SchemaFactory.createForClass(Approval);
