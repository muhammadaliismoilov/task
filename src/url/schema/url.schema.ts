import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Url extends Document {
  @Prop({ required: true })
  originalUrl: string;

  @Prop({ required: true, unique: true })
  shortCode: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ default: 0 })
  visits: number;

  @Prop()
  expiresAt?: Date;

   createdAt?: Date;
  updatedAt?: Date;
}

export const UrlSchema = SchemaFactory.createForClass(Url);