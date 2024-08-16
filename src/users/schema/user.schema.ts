import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  birthDate: Date;

  @Prop()
  gender: string;

  @Prop({ default: null })
  picture?: string; // Path to the profile picture

  @Prop({ default: () => new Date() })
  created_at: Date;

  @Prop({ default: null })
  updated_at: Date;

  @Prop({ default: null })
  deleted_at: Date;

  @Prop()
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
