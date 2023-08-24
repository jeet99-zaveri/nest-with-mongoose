import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuizSchema = HydratedDocument<Quiz>;

@Schema({ timestamps: true })
export class Quiz {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
