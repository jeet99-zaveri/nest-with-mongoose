import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

import { Quiz } from './quiz.schema';

export type QuestionSchema = HydratedDocument<Question>;

@Schema({ timestamps: true })
export class Question extends Document {
  @Prop()
  question: string;

  @Prop({ type: Types.ObjectId, ref: 'Quiz' })
  quiz: Quiz;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
