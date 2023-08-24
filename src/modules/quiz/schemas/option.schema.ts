import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { Question } from './question.schema';

export type OptionSchema = HydratedDocument<Option>;

@Schema({ timestamps: true })
export class Option {
  @Prop()
  text: string;

  @Prop({ default: false })
  isCorrect: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Question' })
  question: Question;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

export const OptionSchema = SchemaFactory.createForClass(Option);
